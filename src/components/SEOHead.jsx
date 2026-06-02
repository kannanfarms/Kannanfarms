import { Helmet } from 'react-helmet-async'

const SITE_URL   = 'https://www.kannanfarms.in'
const SITE_NAME  = 'Kannan Farms'
const OG_DEFAULT = `${SITE_URL}/assets/Logowoback.png`

export default function SEOHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType    = 'website',
  canonical,
  structuredData,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Natural Health Products`

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords    && <meta name="keywords"    content={keywords}    />}
      {canonical   && <link rel="canonical"    href={`${SITE_URL}${canonical}`} />}

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type"        content={ogType} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:title"       content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description || ''} />
      <meta property="og:image"       content={ogImage || OG_DEFAULT} />
      {canonical && <meta property="og:url" content={`${SITE_URL}${canonical}`} />}

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description || ''} />
      <meta name="twitter:image"       content={ogImage || OG_DEFAULT} />

      {/* Structured data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

/** Helper: generate Product schema.org structured data */
export function productSchema(product) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'Kannan Farms',
    },
    offers: product.sizes.map((s) => ({
      '@type': 'Offer',
      price: s.price.replace('₹', '').replace(',', ''),
      priceCurrency: 'INR',
      name: s.weight,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Kannan Farms' },
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '120',
    },
  }
}
