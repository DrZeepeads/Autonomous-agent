import MarkdownIt from 'markdown-it'

// Configure markdown-it with medical-friendly settings
const md = new MarkdownIt({
  html: false, // Disable HTML for security
  xhtmlOut: true,
  breaks: true, // Convert line breaks to <br>
  linkify: true, // Auto-convert URLs to links
  typographer: true, // Enable smart quotes and other typographic replacements
})

// Custom renderer for medical content
md.renderer.rules.heading_open = (tokens, idx, options, env, renderer) => {
  const token = tokens[idx]
  const level = token.tag
  const className = `medical-heading medical-heading-${level.slice(1)}`
  return `<${level} class="${className}">`
}

md.renderer.rules.paragraph_open = () => {
  return '<p class="medical-paragraph">'
}

md.renderer.rules.list_item_open = () => {
  return '<li class="medical-list-item">'
}

md.renderer.rules.blockquote_open = () => {
  return '<blockquote class="medical-blockquote">'
}

md.renderer.rules.code_inline = (tokens, idx) => {
  const token = tokens[idx]
  return `<code class="medical-code-inline">${md.utils.escapeHtml(token.content)}</code>`
}

md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const langClass = token.info ? ` language-${token.info}` : ''
  return `<pre class="medical-code-block"><code class="medical-code${langClass}">${md.utils.escapeHtml(token.content)}</code></pre>`
}

// Custom rule for medical references (e.g., [Chapter 15, Page 234])
md.renderer.rules.text = (tokens, idx) => {
  const token = tokens[idx]
  let content = token.content
  
  // Replace medical references with styled spans
  content = content.replace(
    /\[([^,]+),\s*Page\s*(\d+)\]/g,
    '<span class="medical-reference" data-chapter="$1" data-page="$2">[$1, Page $2]</span>'
  )
  
  return md.utils.escapeHtml(content)
}

export function renderMarkdown(content: string): string {
  return md.render(content)
}

export function renderInlineMarkdown(content: string): string {
  return md.renderInline(content)
}

// Utility to extract medical references from markdown
export function extractMedicalReferences(content: string): Array<{
  chapter: string
  page: number
  text: string
}> {
  const references: Array<{ chapter: string; page: number; text: string }> = []
  const regex = /\[([^,]+),\s*Page\s*(\d+)\]/g
  let match
  
  while ((match = regex.exec(content)) !== null) {
    references.push({
      chapter: match[1].trim(),
      page: parseInt(match[2]),
      text: match[0]
    })
  }
  
  return references
}

// Utility to sanitize user input before processing
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim()
}

// Utility to format medical dosage information
export function formatMedicalDosage(text: string): string {
  return text.replace(
    /(\d+(?:\.\d+)?)\s*(mg|mcg|g|kg|ml|L|units?)\b/gi,
    '<span class="medical-dosage">$1 $2</span>'
  )
}

// Utility to highlight medical terms
export function highlightMedicalTerms(text: string): string {
  const medicalTerms = [
    'pediatric', 'neonatal', 'infant', 'child', 'adolescent',
    'diagnosis', 'treatment', 'therapy', 'medication', 'dosage',
    'syndrome', 'disease', 'condition', 'symptom', 'sign',
    'acute', 'chronic', 'severe', 'mild', 'moderate'
  ]
  
  let result = text
  medicalTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi')
    result = result.replace(regex, `<span class="medical-term">$&</span>`)
  })
  
  return result
}

