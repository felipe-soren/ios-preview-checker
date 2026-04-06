import * as core from '@actions/core'
import * as github from '@actions/github'

async function run() {
  try {
    const token = core.getInput('github-token')
    const octokit = github.getOctokit(token)
    const context = github.context

    if (!context.payload.pull_request) {
      core.info('Não é um PR')
      return
    }

    const { owner, repo } = context.repo
    const prNumber = context.payload.pull_request.number

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: 'SwiftUI Preview Check coming soon...'
    })

    core.info('Comentário enviado!')
  } catch (error) {
    core.setFailed(`Erro: ${error}`)
  }
}

run()