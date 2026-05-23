import { Helmet } from 'react-helmet-async'
import { OG_IMAGE, SITE_NAME, SITE_URL, type PageSEOConfig } from '../utils/seo'

type PageSEOProps = PageSEOConfig

function canonicalUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

const PageSEO = ({ title, description, path }: PageSEOProps) => {
  const url = canonicalUrl(path)

  return (
    <Helmet>
      <html lang="en-ZA" />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_ZA" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:alt" content={`${SITE_NAME} dental practice`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  )
}

export default PageSEO
