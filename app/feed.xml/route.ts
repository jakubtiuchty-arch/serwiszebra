import { getAllPosts } from '@/lib/blog'

// Funkcja do escape'owania znaków specjalnych XML
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Funkcja do enkodowania URL (zachowuje strukturę ścieżki)
function encodeImageUrl(url: string): string {
  // Rozdziel ścieżkę na części i enkoduj każdą część osobno
  const parts = url.split('/')
  return parts.map(part => encodeURIComponent(part)).join('/')
}

export async function GET() {
  const posts = getAllPosts()
  const siteUrl = 'https://www.serwis-zebry.pl'
  
  const rssItems = posts.map((post) => {
    // Bezpieczne enkodowanie URL obrazu
    const imageUrl = post.coverImage 
      ? `${siteUrl}${encodeImageUrl(post.coverImage)}`
      : null
    
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <category>${escapeXml(post.deviceType)}</category>
      ${imageUrl ? `<enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0" />` : ''}
      <author>serwis@serwis-zebry.pl (${escapeXml(post.author.name)})</author>
    </item>
  `
  }).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Blog Serwis Zebra - Poradniki napraw urządzeń Zebra</title>
    <link>${siteUrl}/blog</link>
    <description>Praktyczne poradniki napraw drukarek etykiet, terminali mobilnych i skanerów Zebra. Porady certyfikowanych techników z 25-letnim doświadczeniem.</description>
    <language>pl</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/takma_logo_1.png</url>
      <title>Blog Serwis Zebra</title>
      <link>${siteUrl}/blog</link>
    </image>
    <copyright>© 2025 TAKMA - Serwis Zebra</copyright>
    <managingEditor>serwis@serwis-zebry.pl (Zespół Serwis Zebra)</managingEditor>
    <webMaster>serwis@serwis-zebry.pl (Zespół Serwis Zebra)</webMaster>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

