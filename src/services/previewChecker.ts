export function hasPreview(content: string): boolean {
  const hasNewPreview = content.includes('#Preview')
  const hasOldPreview = /struct\s+\w+[\s\S]*?:\s*PreviewProvider/.test(content)

  return hasNewPreview || hasOldPreview
}

export function isViewFile(content: string): boolean {
  return content.includes('var body: some View')
}