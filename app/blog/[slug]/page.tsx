import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts, getRelatedPosts, BLOG_CATEGORIES } from '@/lib/blog'
import Header from '@/components/Header'
import { 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Tag,
  Share2,
  BookOpen,
  ArrowRight,
  User
} from 'lucide-react'

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Artykuł nie znaleziony | Serwis Zebra',
    }
  }

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
    },
    alternates: {
      canonical: `https://serwiszebra.pl/blog/${post.slug}`
    }
  }
}

export default function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(params.slug, 3)

  // Schema.org structured data for Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `https://serwiszebra.pl${post.coverImage}`,
    author: {
      '@type': 'Organization',
      name: post.author.name,
      url: 'https://serwiszebra.pl'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Serwis Zebra - TAKMA',
      logo: {
        '@type': 'ImageObject',
        url: 'https://serwiszebra.pl/takma_logo_1.png'
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://serwiszebra.pl/blog/${post.slug}`
    },
    keywords: post.tags.join(', ')
  }

  // FAQ Schema if content has FAQ section
  const faqSchema = post.content.includes('## FAQ') ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: extractFAQFromContent(post.content)
  } : null

  // BreadcrumbList Schema for navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Strona główna',
        item: 'https://serwiszebra.pl'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://serwiszebra.pl/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://serwiszebra.pl/blog/${post.slug}`
      }
    ]
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      poradniki: 'bg-blue-100 text-blue-700',
      troubleshooting: 'bg-red-100 text-red-700',
      porownania: 'bg-purple-100 text-purple-700',
      aktualnosci: 'bg-green-100 text-green-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <Header currentPage="blog" />

        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Strona główna
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/blog" className="text-gray-500 hover:text-gray-700">
                Blog
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
                {post.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Article */}
        <article className="py-8 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Wróć do bloga
            </Link>

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                  {BLOG_CATEGORIES[post.category].name}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min czytania
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6">
                {post.excerpt}
              </p>

              {/* Author & Date */}
              <div className="w-full flex items-center justify-between pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">{post.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString('pl-PL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-blue-100 to-indigo-100">
                {post.coverImage !== '/blog/placeholder.jpg' ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-blue-300" />
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:not-italic prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Tagi</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Udostępnij</h3>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://serwiszebra.pl/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=https://serwiszebra.pl/blog/${post.slug}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=https://serwiszebra.pl/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  X (Twitter)
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Powiązane artykuły
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-blue-100 to-indigo-100">
                      {relatedPost.coverImage !== '/blog/placeholder.jpg' ? (
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-blue-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {relatedPost.readingTime} min czytania
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Potrzebujesz pomocy z urządzeniem Zebra?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Skorzystaj z darmowej diagnostyki AI lub wyślij zgłoszenie serwisowe.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                Czat z AI
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#formularz"
                className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 transition-colors"
              >
                Zgłoś naprawę
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

// Improved markdown to HTML parser
function parseMarkdown(markdown: string): string {
  const lines = markdown.split('\n')
  const result: string[] = []
  let inList = false
  let inOrderedList = false
  let inCodeBlock = false
  let inTable = false
  let tableRows: string[][] = []
  let codeBlockContent: string[] = []
  let codeBlockLang = ''

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim())
      
      // Check if this is a separator row (|---|---|)
      if (cells.every(c => /^[-:]+$/.test(c))) {
        continue // Skip separator row
      }
      
      if (!inTable) {
        inTable = true
        tableRows = []
      }
      tableRows.push(cells)
      continue
    } else if (inTable) {
      // End of table, render it
      inTable = false
      if (tableRows.length > 0) {
        let tableHtml = '<div class="overflow-x-auto my-6"><table class="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">'
        tableRows.forEach((row, idx) => {
          if (idx === 0) {
            // Header row
            tableHtml += '<thead class="bg-gray-100"><tr>'
            row.forEach(cell => {
              tableHtml += `<th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">${processInline(cell)}</th>`
            })
            tableHtml += '</tr></thead><tbody>'
          } else {
            // Body row
            tableHtml += `<tr class="${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">`
            row.forEach(cell => {
              tableHtml += `<td class="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">${processInline(cell)}</td>`
            })
            tableHtml += '</tr>'
          }
        })
        tableHtml += '</tbody></table></div>'
        result.push(tableHtml)
        tableRows = []
      }
    }

    // Code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeBlockLang = line.slice(3).trim()
        codeBlockContent = []
        continue
      } else {
        inCodeBlock = false
        result.push(`<pre class="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto my-4"><code class="language-${codeBlockLang}">${codeBlockContent.join('\n')}</code></pre>`)
        continue
      }
    }

    if (inCodeBlock) {
      codeBlockContent.push(line.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
      continue
    }

    // Horizontal rule
    if (line.trim() === '---') {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      result.push('<hr class="my-8 border-gray-200" />')
      continue
    }

    // Headers
    if (line.startsWith('### ')) {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      const text = processInline(line.slice(4))
      result.push(`<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">${text}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      const text = processInline(line.slice(3))
      result.push(`<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">${text}</h2>`)
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      const text = processInline(line.slice(2))
      result.push(`<blockquote class="border-l-4 border-blue-500 bg-blue-50 pl-4 py-3 my-4 rounded-r-lg"><p class="text-gray-700">${text}</p></blockquote>`)
      continue
    }

    // Unordered list
    if (line.startsWith('- ')) {
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      if (!inList) {
        result.push('<ul class="list-disc list-inside space-y-2 my-4 text-gray-700">')
        inList = true
      }
      const text = processInline(line.slice(2))
      result.push(`<li>${text}</li>`)
      continue
    }

    // Ordered list
    const orderedMatch = line.match(/^(\d+)\. (.*)/)
    if (orderedMatch) {
      if (inList) { result.push('</ul>'); inList = false }
      if (!inOrderedList) {
        result.push('<ol class="list-decimal list-inside space-y-2 my-4 text-gray-700">')
        inOrderedList = true
      }
      const text = processInline(orderedMatch[2])
      result.push(`<li>${text}</li>`)
      continue
    }

    // Close lists if not continuing
    if (inList && !line.startsWith('- ')) {
      result.push('</ul>')
      inList = false
    }
    if (inOrderedList && !orderedMatch) {
      result.push('</ol>')
      inOrderedList = false
    }

    // Empty line
    if (line.trim() === '') {
      continue
    }

    // Regular paragraph
    const text = processInline(line)
    result.push(`<p class="text-gray-700 leading-relaxed my-4">${text}</p>`)
  }

  // Close any open lists
  if (inList) result.push('</ul>')
  if (inOrderedList) result.push('</ol>')
  
  // Close any open table
  if (inTable && tableRows.length > 0) {
    let tableHtml = '<div class="overflow-x-auto my-6"><table class="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">'
    tableRows.forEach((row, idx) => {
      if (idx === 0) {
        tableHtml += '<thead class="bg-gray-100"><tr>'
        row.forEach(cell => {
          tableHtml += `<th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">${processInline(cell)}</th>`
        })
        tableHtml += '</tr></thead><tbody>'
      } else {
        tableHtml += `<tr class="${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">`
        row.forEach(cell => {
          tableHtml += `<td class="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">${processInline(cell)}</td>`
        })
        tableHtml += '</tr>'
      }
    })
    tableHtml += '</tbody></table></div>'
    result.push(tableHtml)
  }

  return result.join('\n')
}

// Process inline markdown (bold, italic, links, code)
function processInline(text: string): string {
  return text
    // Custom check icon
    .replace(/\[CHECK\]/g, '<svg class="inline-block w-5 h-5 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>')
    .replace(/\[X\]/g, '<svg class="inline-block w-5 h-5 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    // Italic (but not the asterisk footnote)
    .replace(/(?<!\s)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline font-medium">$1</a>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>')
    // Checkmarks (emoji fallback)
    .replace(/✅/g, '<svg class="inline-block w-5 h-5 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>')
    .replace(/❌/g, '<svg class="inline-block w-5 h-5 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>')
    .replace(/⚠️/g, '<svg class="inline-block w-5 h-5 text-yellow-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>')
    .replace(/💡/g, '<svg class="inline-block w-5 h-5 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>')
}

// Extract FAQ items from content
function extractFAQFromContent(content: string): Array<{
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}> {
  const faqSection = content.split('## FAQ')[1]
  if (!faqSection) return []

  const questions: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }> = []

  const faqRegex = /### (.+?)\n([^#]+)/g
  let match
  while ((match = faqRegex.exec(faqSection)) !== null) {
    questions.push({
      '@type': 'Question',
      name: match[1].trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: match[2].trim()
      }
    })
  }

  return questions
}

