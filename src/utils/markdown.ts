import { FileInfo } from '../types/file'

export function buildMarkdownTable(files: FileInfo[]) {
  if (files.length === 0) {
    return `## ✅ SwiftUI Preview Checker\n\nAll checked files include a valid SwiftUI Preview. Great job! 🎉`
  }

  let table = `## ⚠️ SwiftUI Preview Checker\n\n`
  table += `Some SwiftUI files are missing a Preview.\n\n`

  table += `| File | Path |\n`
  table += `|------|------|\n`

  for (const file of files) {
    table += `| ${file.name} | ${file.path} |\n`
  }

  return table
}