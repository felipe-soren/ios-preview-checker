import * as github from '@actions/github'

export async function getPRFiles(octokit: any, owner: string, repo: string, prNumber: number) {
  return await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  })
}

export async function getFileContent(
  octokit: any,
  owner: string,
  repo: string,
  path: string,
  ref: string
) {
  const fileData = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    ref,
  })

  if (!('content' in fileData.data)) return null

  return Buffer.from(fileData.data.content, 'base64').toString('utf-8')
}

export async function commentOnPR(
  octokit: any,
  owner: string,
  repo: string,
  prNumber: number,
  body: string
) {
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body,
  })
}