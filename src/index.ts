import * as core from '@actions/core'
import * as github from '@actions/github'

function hasPreview(content: string): boolean {
  const hasNewPreview = content.includes('#Preview')
  const hasOldPreview = /struct\s+\w+[\s\S]*?:\s*PreviewProvider/.test(content)

  return hasNewPreview || hasOldPreview
}

function buildMarkdownTable(files: { name: string; path: string }[]) {
  if (files.length === 0) {
    return `## ✅ SwiftUI Preview Checker\n\nAll checked files include a valid SwiftUI Preview. Great job! 🎉`
  }

  let table = `## ⚠️ SwiftUI Preview Checker\n\n`
  table += `Some SwiftUI files are missing a Preview. Consider adding previews to improve development experience and UI validation.\n\n`

  table += `| File | Path |\n`
  table += `|------|------|\n`

  for (const file of files) {
    table += `| ${file.name} | ${file.path} |\n`
  }

  return table
}

async function run() {
  try {
    const token = core.getInput('github-token')
    const octokit = github.getOctokit(token)
    const context = github.context

    if (!context.payload.pull_request) {
      core.info('Not a pull request')
      return
    }

    const { owner, repo } = context.repo
    const prNumber = context.payload.pull_request.number

    // Get changed files from PR
    const filesResponse = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
    })

    const filesWithoutPreview: { name: string; path: string }[] = []

    for (const file of filesResponse.data) {
      if (!file.filename.endsWith('View.swift')) continue

      // Get file content
      const fileData = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.filename,
        ref: context.payload.pull_request.head.sha,
      })

      if (!('content' in fileData.data)) continue

      const content = Buffer.from(fileData.data.content, 'base64').toString('utf-8')

      if (!hasPreview(content)) {
        const name = file.filename.split('/').pop() || file.filename

        filesWithoutPreview.push({
          name,
          path: file.filename,
        })
      }
    }

    // Build comment
    const body = buildMarkdownTable(filesWithoutPreview)

    // Post comment
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body,
    })

    core.info('Comment posted successfully!')
  } catch (error) {
    core.setFailed(`Error: ${error}`)
  }
}

run()