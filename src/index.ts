import * as core from '@actions/core'
import * as github from '@actions/github'

import { hasPreview, isViewFile } from './services/previewChecker'
import { buildMarkdownTable } from './utils/markdown'
import { getPRFiles, getFileContent, commentOnPR } from './github/pullRequest'
import { FileInfo } from './types/file'

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
    const ref = context.payload.pull_request.head.sha

    const filesResponse = await getPRFiles(octokit, owner, repo, prNumber)

    const results = await Promise.all(
      filesResponse.data.map(async (file) => {

        if (file.status === 'removed') return null

        const filePath = file.filename

        if (!filePath.endsWith('View.swift')) return null

        core.info(`Checking file: ${filePath}`)

        const content = await getFileContent(
          octokit,
          owner,
          repo,
          filePath,
          ref
        )

        if (!content) return null

        if (!isViewFile(content)) return null

        if (!hasPreview(content)) {
          const result: FileInfo = {
            name: filePath.split('/').pop() || filePath,
            path: filePath,
          }

          return result
        }

        return null
      })
    )

    const filesWithoutPreview: FileInfo[] = results.filter(
      (file): file is FileInfo => file !== null
    )

    const body = buildMarkdownTable(filesWithoutPreview)

    await commentOnPR(octokit, owner, repo, prNumber, body)

    core.info('Comment posted successfully!')
  } catch (error) {
    core.setFailed(`Error: ${error}`)
  }
}

run()