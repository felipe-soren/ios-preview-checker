import * as core from '@actions/core'
import * as github from '@actions/github'

import { hasPreview } from './services/previewChecker'
import { buildMarkdownTable } from './utils/markdown'
import { getPRFiles, getFileContent, commentOnPR } from './github/pullRequest'
import { FileInfo } from "./types/file"

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
      filesResponse.data.map(async (file: FileInfo) => {
        if (!file.name.endsWith('View.swift')) return null

        const content = await getFileContent(octokit, owner, repo, file.name, ref)
        if (!content) return null

        if (!hasPreview(content)) {
          return {
            name: file.name.split('/').pop() || file.name,
            path: file.name,
          }
        }

        return null
      })
    )

    // Remove nulls
    const filesWithoutPreview = results.filter(
      (file): file is { name: string; path: string } => file !== null
    )

    const body = buildMarkdownTable(filesWithoutPreview)

    await commentOnPR(octokit, owner, repo, prNumber, body)

    core.info('Comment posted successfully!')
  } catch (error) {
    core.setFailed(`Error: ${error}`)
  }
}

run()