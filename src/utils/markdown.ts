import { FileInfo } from '../types/file'

export function buildMarkdownTable(
  files: FileInfo[],
  owner: string,
  repo: string,
  ref: string
): string {
  if (files.length === 0) {
    return '✅ All views have previews!'
  }

  const rows = files
    .map((file) => {
      const url = `https://github.com/${owner}/${repo}/blob/${ref}/${file.path}`

      return `| [${file.name}](${url}) | ${file.path} |`
    })
    .join('\n')

  return `
## ⚠️ Views without Preview

| File | Path |
|------|------|
${rows}
`
}