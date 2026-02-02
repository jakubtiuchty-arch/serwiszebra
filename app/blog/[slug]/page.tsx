import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts, getRelatedPosts, BLOG_CATEGORIES, DEVICE_TYPES } from '@/lib/blog'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { 
  Clock, 
  Calendar, 
  Tag,
  BookOpen,
  ArrowRight,
  User,
  Printer,
  Smartphone,
  ScanLine,
  Tablet,
  Package
} from 'lucide-react'
import BlogReactions from '@/components/BlogReactions'

// ISR - strony rewalidowane co 60 sekund (szybsze odświeżanie po deployu)
export const revalidate = 60
export const dynamicParams = true

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

  const canonicalUrl = `https://www.serwis-zebry.pl/blog/${post.slug}`
  
  // Map category to article:section
  const sectionMap: Record<string, string> = {
    'poradniki': 'Poradniki',
    'troubleshooting': 'Rozwiązywanie problemów',
    'porownania': 'Porównania',
    'aktualnosci': 'Aktualności',
    'nowosci-produktowe': 'Nowości produktowe'
  }
  
  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      type: 'article',
      url: canonicalUrl, // og:url - WYMAGANE dla deduplication
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      siteName: 'TAKMA - Autoryzowany Serwis Zebra',
      locale: 'pl_PL',
      images: [
        {
          url: `https://www.serwis-zebry.pl${post.coverImage}`,
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
      images: [`https://www.serwis-zebry.pl${post.coverImage}`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'pl': canonicalUrl,
        'x-default': canonicalUrl,
      },
      types: {
        'application/rss+xml': 'https://www.serwis-zebry.pl/rss.xml', // RSS feed
      },
    },
    // article:section meta tag
    other: {
      'article:section': sectionMap[post.category] || BLOG_CATEGORIES[post.category]?.name || 'Artykuły',
      'article:tag': post.tags.slice(0, 5).join(', '),
    },
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

  const relatedPosts = getRelatedPosts(params.slug, 6)

  // Schema.org structured data for Article
  const wordCount = post.content.split(/\s+/).length
  const canonicalUrl = `https://www.serwis-zebry.pl/blog/${post.slug}`
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle', // Bardziej precyzyjny typ dla artykułów technicznych
    headline: post.title,
    description: post.excerpt,
    image: `https://www.serwis-zebry.pl${post.coverImage}`,
    author: {
      '@type': 'Organization',
      name: post.author.name,
      url: 'https://www.serwis-zebry.pl'
    },
    publisher: {
      '@type': 'Organization',
      name: 'TAKMA - Autoryzowany Serwis Zebra',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.serwis-zebry.pl/takma_logo_1.png'
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    keywords: post.tags.join(', '),
    wordCount: wordCount,
    timeRequired: `PT${post.readingTime}M`, // ISO 8601 duration format
    inLanguage: 'pl-PL',
    isAccessibleForFree: true,
    about: {
      '@type': 'Thing',
      name: 'Zebra Technologies'
    },
    // Speakable for voice search (AEO)
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article header h1', 'article header p', '.prose > blockquote:first-of-type']
    }
  }

  // FAQ Schema - prefer explicit faqSchema from SEO, fallback to content extraction
  const faqSchema = post.seo?.faqSchema ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.seo.faqSchema.map((faq: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : post.content.includes('## FAQ') ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: extractFAQFromContent(post.content)
  } : null

  // Product Schema for product pages (nowosci-produktowe category with price mentions)
  const isProductPage = post.category === 'nowosci-produktowe' && 
    (post.content.includes('Cena') || post.content.includes('cena') || post.content.includes('zł'))
  
  const productSchema = isProductPage ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: post.title.replace(/–.*$/, '').trim(), // Clean title
    description: post.excerpt,
    image: `https://www.serwis-zebry.pl${post.coverImage}`,
    brand: {
      '@type': 'Brand',
      name: 'Zebra Technologies'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Zebra Technologies',
      url: 'https://www.zebra.com'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PLN',
      lowPrice: extractPriceFromContent(post.content, 'low'),
      highPrice: extractPriceFromContent(post.content, 'high'),
      offerCount: 1,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'TAKMA - Autoryzowany Partner Zebra',
        url: 'https://www.serwis-zebry.pl'
      }
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      author: {
        '@type': 'Organization',
        name: 'Zespół TAKMA'
      }
    }
  } : null

  // HowTo Schema for step-by-step guides
  // Include for: poradniki category OR content with numbered steps/instructions
  const hasStepByStepContent = 
    post.category === 'poradniki' || 
    post.category === 'troubleshooting' ||
    /\d+\.\s+(Otwórz|Zamknij|Wyczyść|Skalibruj|Naciśnij|Przytrzymaj|Przetrzyj|Sprawdź|Usuń|Załaduj|Włącz|Wyłącz|Poczekaj)/i.test(post.content) ||
    /### (Krok|Czyszczenie|Kalibracja|Reset|Konserwacja)/i.test(post.content)
  
  const steps = extractStepsFromContent(post.content)
  const howToSchema = hasStepByStepContent && steps.length >= 3 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: post.title,
    description: post.excerpt,
    image: `https://www.serwis-zebry.pl${post.coverImage}`,
    totalTime: `PT${post.readingTime}M`,
    tool: extractToolsFromContent(post.content),
    step: steps
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
        item: 'https://www.serwis-zebry.pl'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.serwis-zebry.pl/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.deviceType.charAt(0).toUpperCase() + post.deviceType.slice(1),
        item: `https://www.serwis-zebry.pl/blog?device=${post.deviceType}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: `https://www.serwis-zebry.pl/blog/${post.slug}`
      }
    ]
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      poradniki: 'bg-blue-100 text-blue-700',
      troubleshooting: 'bg-red-100 text-red-700',
      porownania: 'bg-purple-100 text-purple-700',
      aktualnosci: 'bg-green-100 text-green-700',
      'nowosci-produktowe': 'bg-orange-100 text-orange-700'
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
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <Header currentPage="blog" />
        
        {/* Main content wrapper for semantic SEO */}
        <main id="main-content">

        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm flex-wrap">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Strona główna
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/blog" className="text-gray-500 hover:text-gray-700">
                Blog
              </Link>
              <span className="text-gray-400">/</span>
              <Link 
                href={`/blog?device=${post.deviceType}`} 
                className="text-gray-500 hover:text-gray-700 capitalize"
              >
                {post.deviceType}
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
            <BackButton 
              fallbackUrl="/blog"
              label="Wróć do bloga"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            />

            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-gray-100 text-gray-700">
                  {post.deviceType === 'drukarki' && <Printer className="w-3.5 h-3.5" />}
                  {post.deviceType === 'terminale' && <Smartphone className="w-3.5 h-3.5" />}
                  {post.deviceType === 'skanery' && <ScanLine className="w-3.5 h-3.5" />}
                  {post.deviceType === 'tablety' && <Tablet className="w-3.5 h-3.5" />}
                  {post.deviceType === 'inne' && <Package className="w-3.5 h-3.5" />}
                  {DEVICE_TYPES[post.deviceType].name}
                </span>
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

              <p className="text-base sm:text-xl text-gray-600 mb-6">
                {post.excerpt}
              </p>

              {/* Author & Date */}
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">{post.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('pl-PL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                  {post.updatedAt && post.updatedAt !== post.publishedAt && (
                    <span className="text-gray-400">
                      (aktualizacja: <time dateTime={post.updatedAt}>
                        {new Date(post.updatedAt).toLocaleDateString('pl-PL', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </time>)
                    </span>
                  )}
                </div>
              </div>
            </header>

            {/* Cover Image - wrapped in figure/figcaption for semantic SEO */}
            {post.coverImage && (
              <figure className="mb-8">
                <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                  {post.coverImage !== '/blog/placeholder.jpg' ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      quality={80}
                      className="object-cover"
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMiMWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABoRAAICAwAAAAAAAAAAAAAAAAECABEDITH/2gAMAwEAAhEDEQA/ANL1HeLWt2tvb2cLJFGqLI0hJbA+AAD+5qf/AJ7qn1fyn2lKVJk7nAmK3TP/2Q=="
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-blue-300" />
                    </div>
                  )}
                </div>
                <figcaption className="mt-2 text-center text-sm text-gray-500">
                  {post.title}
                </figcaption>
              </figure>
            )}

            {/* Content */}
            <div 
              className="prose prose-sm sm:prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:not-italic prose-img:rounded-xl"
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

            {['troubleshooting', 'poradniki'].includes(post.category) && (
              <BlogReactions slug={post.slug} />
            )}

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Udostępnij</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://www.serwis-zebry.pl/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=https://www.serwis-zebry.pl/blog/${post.slug}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-4 py-2 bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-800 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=https://www.serwis-zebry.pl/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  X (Twitter)
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Internal Links Section - Device Category */}
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Więcej o {post.deviceType === 'drukarki' ? 'drukarkach' : 
                        post.deviceType === 'terminale' ? 'terminalach' : 
                        post.deviceType === 'skanery' ? 'skanerach' : 
                        post.deviceType === 'tablety' ? 'tabletach' : 'urządzeniach'} Zebra
            </h2>
            <div className="flex flex-wrap gap-3">
              {post.deviceType === 'drukarki' && (
                <>
                  <Link href="/drukarki" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    <Printer className="w-4 h-4" />
                    Serwis drukarek Zebra
                  </Link>
                  <Link href="/blog?device=drukarki" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    <BookOpen className="w-4 h-4" />
                    Wszystkie artykuły o drukarkach
                  </Link>
                </>
              )}
              {post.deviceType === 'terminale' && (
                <>
                  <Link href="/terminale" className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                    <Smartphone className="w-4 h-4" />
                    Serwis terminali Zebra
                  </Link>
                  <Link href="/blog?device=terminale" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    <BookOpen className="w-4 h-4" />
                    Wszystkie artykuły o terminalach
                  </Link>
                </>
              )}
              {post.deviceType === 'skanery' && (
                <>
                  <Link href="/skanery" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
                    <ScanLine className="w-4 h-4" />
                    Serwis skanerów Zebra
                  </Link>
                  <Link href="/blog?device=skanery" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    <BookOpen className="w-4 h-4" />
                    Wszystkie artykuły o skanerach
                  </Link>
                </>
              )}
              {post.deviceType === 'tablety' && (
                <>
                  <Link href="/blog?device=tablety" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                    <Tablet className="w-4 h-4" />
                    Wszystkie artykuły o tabletach
                  </Link>
                </>
              )}
              <Link href="/faq" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                FAQ - Często zadawane pytania
              </Link>
              <Link href="/#formularz" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                Zgłoś naprawę →
              </Link>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Powiązane artykuły
              </h2>
              <p className="text-gray-600 mb-8">
                Przeczytaj także inne poradniki dotyczące urządzeń Zebra
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={70}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMiMWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABoRAAICAwAAAAAAAAAAAAAAAAECABEDITH/2gAMAwEAAhEDEQA/ANL1HeLWt2tvb2cLJFGqLI0hJbA+AAD+5qf/AJ7qn1fyn2lKVJk7nAmK3TP/2Q=="
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-blue-300" />
                        </div>
                      )}
                      {/* Device type badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          relatedPost.deviceType === 'drukarki' ? 'bg-blue-100 text-blue-700' :
                          relatedPost.deviceType === 'terminale' ? 'bg-green-100 text-green-700' :
                          relatedPost.deviceType === 'skanery' ? 'bg-orange-100 text-orange-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {relatedPost.deviceType}
                        </span>
                      </div>
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
              
              {/* Link do wszystkich artykułów */}
              <div className="text-center mt-8">
                <Link 
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Zobacz wszystkie artykuły
                  <ArrowRight className="w-4 h-4" />
                </Link>
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

        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </footer>

        {/* Lightbox - rendered via script to avoid Server Component onClick issues */}
        <div 
          id="lightbox" 
          className="fixed inset-0 bg-black/90 z-50 hidden items-center justify-center p-4"
        >
          <button 
            id="lightbox-close"
            className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300 z-10"
            aria-label="Zamknij"
          >
            ×
          </button>
          <img 
            id="lightbox-img" 
            src="" 
            alt="" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <p id="lightbox-caption" className="absolute bottom-4 left-0 right-0 text-center text-white text-sm"></p>
        </div>

        {/* Lightbox Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function closeLightbox() {
                  const lightbox = document.getElementById('lightbox');
                  if (lightbox) {
                    lightbox.classList.add('hidden');
                    lightbox.classList.remove('flex');
                  }
                }
                
                window.openLightbox = function(src, alt) {
                  const lightbox = document.getElementById('lightbox');
                  const img = document.getElementById('lightbox-img');
                  const caption = document.getElementById('lightbox-caption');
                  if (lightbox && img && caption) {
                    img.src = src;
                    img.alt = alt;
                    caption.textContent = alt;
                    lightbox.classList.remove('hidden');
                    lightbox.classList.add('flex');
                  }
                };
                
                // Close on background click
                document.getElementById('lightbox')?.addEventListener('click', function(e) {
                  if (e.target === this) closeLightbox();
                });
                
                // Close on X button
                document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
                
                // Close on Escape key
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'Escape') closeLightbox();
                });
              })();
            `
          }}
        />
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
        const headers = tableRows[0] || []
        let tableHtml = '<div class="overflow-x-auto my-4 sm:my-6 -mx-4 sm:mx-0 px-4 sm:px-0"><table class="w-full border-collapse bg-white sm:rounded-xl overflow-hidden shadow-sm mobile-card-table">'
        tableRows.forEach((row, idx) => {
          if (idx === 0) {
            // Header row
            tableHtml += '<thead class="bg-gray-100"><tr>'
            row.forEach(cell => {
              tableHtml += `<th class="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 border-b border-gray-200">${processInline(cell)}</th>`
            })
            tableHtml += '</tr></thead><tbody>'
          } else {
            // Body row with data-label for mobile
            tableHtml += `<tr class="${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">`
            row.forEach((cell, cellIdx) => {
              const label = headers[cellIdx] || ''
              tableHtml += `<td data-label="${label.replace(/\*\*/g, '')}" class="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 border-b border-gray-100">${processInline(cell)}</td>`
            })
            tableHtml += '</tr>'
          }
        })
        tableHtml += '</tbody></table></div>'
        result.push(tableHtml)
        tableRows = []
      }
    }

    // Code blocks with ```
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeBlockLang = line.slice(3).trim() || 'text'
        codeBlockContent = []
        continue
      } else {
        inCodeBlock = false
        const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
        const codeContent = codeBlockContent.join('\n')
        result.push(`
          <div class="relative group my-3 sm:my-4 -mx-4 sm:mx-0">
            <div class="absolute right-2 top-2 flex items-center gap-2 z-10">
              <span class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded hidden sm:inline">${codeBlockLang.toUpperCase()}</span>
              <button 
                onclick="navigator.clipboard.writeText(document.getElementById('${codeId}').textContent).then(() => { this.innerHTML = '✓ Skopiowano'; setTimeout(() => this.innerHTML = 'Kopiuj', 2000) })"
                class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
              >Kopiuj</button>
            </div>
            <pre class="bg-gray-900 text-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 pt-10 sm:pt-10 overflow-x-auto text-xs sm:text-sm"><code id="${codeId}" class="language-${codeBlockLang}">${codeContent}</code></pre>
          </div>
        `)
        continue
      }
    }

    if (inCodeBlock) {
      codeBlockContent.push(line.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
      continue
    }
    
    // Indented code blocks (4 spaces) - collect consecutive lines
    if (line.startsWith('    ') && !inList && !inOrderedList) {
      // Start collecting indented code
      const indentedLines: string[] = [line.slice(4)]
      let j = i + 1
      while (j < lines.length && (lines[j].startsWith('    ') || lines[j].trim() === '')) {
        if (lines[j].trim() === '') {
          indentedLines.push('')
        } else {
          indentedLines.push(lines[j].slice(4))
        }
        j++
      }
      // Remove trailing empty lines
      while (indentedLines.length > 0 && indentedLines[indentedLines.length - 1].trim() === '') {
        indentedLines.pop()
      }
      if (indentedLines.length > 0) {
        const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
        const codeContent = indentedLines.map(l => l.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('\n')
        // Detect if it's JSON
        const isJson = codeContent.trim().startsWith('{') || codeContent.trim().startsWith('[')
        const lang = isJson ? 'JSON' : 'CODE'
        result.push(`
          <div class="relative group my-3 sm:my-4 -mx-4 sm:mx-0">
            <div class="absolute right-2 top-2 flex items-center gap-2 z-10">
              <span class="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded hidden sm:inline">${lang}</span>
              <button 
                onclick="navigator.clipboard.writeText(document.getElementById('${codeId}').textContent).then(() => { this.innerHTML = '✓ Skopiowano'; setTimeout(() => this.innerHTML = 'Kopiuj', 2000) })"
                class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
              >Kopiuj</button>
            </div>
            <pre class="bg-gray-900 text-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 pt-10 sm:pt-10 overflow-x-auto text-xs sm:text-sm"><code id="${codeId}">${codeContent}</code></pre>
          </div>
        `)
        i = j - 1 // Skip processed lines
        continue
      }
    }

    // Horizontal rule
    if (line.trim() === '---') {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      result.push('<hr class="my-6 sm:my-8 border-gray-200" />')
      continue
    }

    // Headers with anchor IDs
    if (line.startsWith('### ')) {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      const rawText = line.slice(4)
      const text = processInline(rawText)
      const id = generateHeadingId(rawText)
      result.push(`<h3 id="${id}" class="text-lg sm:text-xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 scroll-mt-24">${text}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      const rawText = line.slice(3)
      const text = processInline(rawText)
      const id = generateHeadingId(rawText)
      result.push(`<h2 id="${id}" class="text-xl sm:text-2xl font-bold text-gray-900 mt-8 sm:mt-10 mb-3 sm:mb-4 scroll-mt-24">${text}</h2>`)
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      if (inList) { result.push('</ul>'); inList = false }
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      const text = processInline(line.slice(2))
      result.push(`<blockquote class="border-l-4 border-blue-500 bg-blue-50 pl-3 sm:pl-4 py-2 sm:py-3 my-3 sm:my-4 rounded-r-lg text-sm sm:text-base"><p class="text-gray-700">${text}</p></blockquote>`)
      continue
    }

    // Unordered list
    if (line.startsWith('- ')) {
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false }
      if (!inList) {
        result.push('<ul class="list-disc list-inside space-y-1.5 sm:space-y-2 my-3 sm:my-4 text-gray-700 text-sm sm:text-base">')
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
        result.push('<ol class="list-decimal list-inside space-y-1.5 sm:space-y-2 my-3 sm:my-4 text-gray-700 text-sm sm:text-base">')
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

    // Gallery syntax: [GALLERY:folder:count:productName]
    const galleryMatch = line.match(/^\[GALLERY:([^\]:]+):?(\d+)?:?([^\]]+)?\]$/)
    if (galleryMatch) {
      const folder = galleryMatch[1]
      const count = parseInt(galleryMatch[2] || '5')
      const productName = galleryMatch[3] || `Zebra ${folder}`
      const galleryId = `gallery-${folder.toLowerCase()}`
      
      // SEO-friendly alt texts
      const altTexts = [
        `${productName} - widok z przodu, terminal mobilny przemysłowy`,
        `${productName} - widok z tyłu z aparatem 50MP`,
        `${productName} - wyświetlacz AMOLED 6 cali`,
        `${productName} - skaner kodów kreskowych`,
        `${productName} - wbudowany czytnik RFID UHF`
      ]
      
      let galleryHtml = `
        <figure class="my-6 sm:my-8" role="group" aria-label="Galeria zdjęć ${productName}">
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3" id="${galleryId}">
      `
      
      for (let j = 1; j <= count; j++) {
        const imgPath = `/${folder}/Zebra ${folder}_${j}.jpeg`
        const altText = altTexts[j - 1] || `${productName} - zdjęcie ${j}`
        galleryHtml += `
          <div class="aspect-square cursor-pointer group" onclick="openLightbox('${imgPath}', '${altText}')">
            <img 
              src="${imgPath}" 
              alt="${altText}"
              title="${altText}"
              class="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md group-hover:border-blue-300 transition-all duration-200"
              loading="lazy"
              decoding="async"
              width="200"
              height="200"
            />
          </div>
        `
      }
      
      galleryHtml += `
          </div>
          <figcaption class="text-center text-xs text-gray-500 mt-2">
            Galeria zdjęć ${productName} – kliknij aby powiększyć
          </figcaption>
        </figure>
      `
      result.push(galleryHtml)
      continue
    }

    // Empty line
    if (line.trim() === '') {
      continue
    }

    // Regular paragraph
    const text = processInline(line)
    result.push(`<p class="text-gray-700 leading-relaxed my-3 sm:my-4 text-sm sm:text-base">${text}</p>`)
  }

  // Close any open lists
  if (inList) result.push('</ul>')
  if (inOrderedList) result.push('</ol>')
  
  // Close any open table
  if (inTable && tableRows.length > 0) {
    const headers = tableRows[0] || []
    let tableHtml = '<div class="overflow-x-auto my-4 sm:my-6 -mx-4 sm:mx-0 px-4 sm:px-0"><table class="w-full border-collapse bg-white sm:rounded-xl overflow-hidden shadow-sm mobile-card-table">'
    tableRows.forEach((row, idx) => {
      if (idx === 0) {
        tableHtml += '<thead class="bg-gray-100"><tr>'
        row.forEach(cell => {
          tableHtml += `<th class="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 border-b border-gray-200">${processInline(cell)}</th>`
        })
        tableHtml += '</tr></thead><tbody>'
      } else {
        tableHtml += `<tr class="${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">`
        row.forEach((cell, cellIdx) => {
          const label = headers[cellIdx] || ''
          tableHtml += `<td data-label="${label.replace(/\*\*/g, '')}" class="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 border-b border-gray-100">${processInline(cell)}</td>`
        })
        tableHtml += '</tr>'
      }
    })
    tableHtml += '</tbody></table></div>'
    result.push(tableHtml)
  }

  return result.join('\n')
}

// Generate ID for headings (anchor links)
function generateHeadingId(text: string): string {
  // Map Polish characters to ASCII equivalents
  const polishMap: Record<string, string> = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n',
    'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z'
  }
  
  return text
    .toLowerCase()
    .split('')
    .map(char => polishMap[char] || char)
    .join('')
    .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')    // Remove leading/trailing hyphens
}

// Process inline markdown (bold, italic, links, code, images)
function processInline(text: string): string {
  return text
    // Images - MUST be before links! ![alt](url) renders as inline image
    .replace(/!\[(.*?)\]\((.*?)\)/g, `
      <figure class="my-4 sm:my-6 flex flex-col items-center">
        <img 
          src="$2" 
          alt="$1" 
          class="max-w-full sm:max-w-md h-auto rounded-lg shadow-md border border-gray-200 bg-white p-2 cursor-pointer hover:shadow-lg transition-shadow"
          onclick="this.classList.toggle('sm:max-w-md'); this.classList.toggle('sm:max-w-2xl');"
          loading="lazy"
        />
        <figcaption class="mt-2 text-xs sm:text-sm text-gray-500 text-center">
          📱 $1 <span class="text-gray-400">• kliknij aby powiększyć</span>
        </figcaption>
      </figure>
    `)
    // Custom check icon
    .replace(/\[CHECK\]/g, '<svg class="inline-block w-5 h-5 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>')
    .replace(/\[X\]/g, '<svg class="inline-block w-5 h-5 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    // Italic (but not the asterisk footnote)
    .replace(/(?<!\s)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
    // Links (after images!)
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline font-medium">$1</a>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>')
    // Checkmarks (emoji fallback)
    .replace(/✅/g, '<svg class="inline-block w-5 h-5 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>')
    .replace(/❌/g, '<svg class="inline-block w-5 h-5 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>')
    // Critical warning - red pulsating (use 🔴⚠️ in content)
    .replace(/🔴⚠️/g, '<svg class="inline-block w-6 h-6 text-red-600 mr-1 warning-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>')
    // Regular warning - yellow
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

// Extract tools/materials from content for HowTo schema
function extractToolsFromContent(content: string): Array<{
  '@type': 'HowToTool'
  name: string
}> {
  const tools: Array<{ '@type': 'HowToTool'; name: string }> = []
  
  // Look for "Potrzebne materiały" or similar sections
  const materialsMatch = content.match(/\*\*Potrzebne materiały:\*\*\n([\s\S]*?)(?=\n\n|\n###|\n##)/i)
  if (materialsMatch) {
    const items = materialsMatch[1].match(/- (.+)/g)
    if (items) {
      items.forEach(item => {
        const name = item.replace(/^- /, '').replace(/\*\*/g, '').trim()
        if (name) {
          tools.push({ '@type': 'HowToTool', name })
        }
      })
    }
  }
  
  return tools
}

// Extract steps from content for HowTo schema
function extractStepsFromContent(content: string): Array<{
  '@type': 'HowToStep'
  name: string
  text: string
  position: number
}> {
  const steps: Array<{
    '@type': 'HowToStep'
    name: string
    text: string
    position: number
  }> = []
  
  // Look for "### Krok" sections
  const stepRegex = /### Krok \d+[:\s]*([^\n]+)\n([\s\S]*?)(?=\n### Krok|\n## |$)/gi
  let match
  let position = 1
  
  while ((match = stepRegex.exec(content)) !== null) {
    const name = match[1].trim()
    const text = match[2]
      .replace(/\n\d+\. /g, ' ') // Remove numbered lists
      .replace(/\n- /g, ' ') // Remove bullet points
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()
      .slice(0, 500) // Limit length
    
    if (name && text) {
      steps.push({
        '@type': 'HowToStep',
        name,
        text,
        position: position++
      })
    }
  }
  
  // If no "Krok" sections found, try numbered steps (1., 2., etc.)
  if (steps.length === 0) {
    const numberedRegex = /^(\d+)\. (.+)$/gm
    let numberedMatch
    while ((numberedMatch = numberedRegex.exec(content)) !== null) {
      if (steps.length < 10) { // Limit to first 10 steps
        steps.push({
          '@type': 'HowToStep',
          name: `Krok ${numberedMatch[1]}`,
          text: numberedMatch[2].replace(/\*\*/g, '').trim(),
          position: parseInt(numberedMatch[1])
        })
      }
    }
  }
  
  return steps
}

// Extract price from content for Product schema
function extractPriceFromContent(content: string, type: 'low' | 'high'): string {
  // Look for price patterns like "5000 zł", "~5000 zł", "od 5000 zł", "5000-9000 zł"
  const pricePatterns = [
    /(?:od|~|około|cena)\s*(\d[\d\s]*)\s*(?:zł|PLN)/gi,
    /(\d[\d\s]*)\s*-\s*(\d[\d\s]*)\s*(?:zł|PLN)/gi,
    /(\d{4,})\s*(?:zł|PLN)/gi
  ]
  
  const prices: number[] = []
  
  for (const pattern of pricePatterns) {
    let match
    while ((match = pattern.exec(content)) !== null) {
      // Extract all number groups from the match
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          const price = parseInt(match[i].replace(/\s/g, ''))
          if (price >= 1000 && price <= 50000) { // Reasonable price range
            prices.push(price)
          }
        }
      }
    }
  }
  
  if (prices.length === 0) {
    return type === 'low' ? '5000' : '10000' // Default fallback
  }
  
  const sortedPrices = [...new Set(prices)].sort((a, b) => a - b)
  return type === 'low' 
    ? sortedPrices[0].toString() 
    : sortedPrices[sortedPrices.length - 1].toString()
}
