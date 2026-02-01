import { getAllPosts } from '@/lib/blog'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const posts = getAllPosts()
  const baseUrl = 'https://www.serwis-zebry.pl'
  
  const rssItems = posts.slice(0, 50).map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${post.deviceType}</category>
      ${post.tags.slice(0, 5).map(tag => `<category>${tag}</category>`).join('\n      ')}
      ${post.coverImage && post.coverImage !== '/blog/placeholder.jpg' 
        ? `<enclosure url="${baseUrl}${post.coverImage}" type="image/jpeg" />` 
        : ''}
    </item>
  `).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>TAKMA - Serwis Zebra Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Poradniki serwisowe, troubleshooting i aktualności o drukarkach, terminalach i skanerach Zebra. Autoryzowany serwis Zebra w Polsce.</description>
    <language>pl</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/takma_logo_1.png</url>
      <title>TAKMA - Serwis Zebra</title>
      <link>${baseUrl}</link>
    </image>
    <copyright>© ${new Date().getFullYear()} TAKMA - Autoryzowany Serwis Zebra</copyright>
    <managingEditor>serwis@serwis-zebry.pl (Zespół TAKMA)</managingEditor>
    <webMaster>serwis@serwis-zebry.pl (Zespół TAKMA)</webMaster>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
