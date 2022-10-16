import Head from "next/head"
import React from "react"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

const serviceName = "サンプルアプリ"

export type MetaProps = {
  title: string
  description?: string
  ogType?: "website" | "article"
  imageUrl?: string
  ogUrl?: string
  twCard?: "summary" | "summary_large_image"
  canonical?: string
  disableIndex?: boolean
  disableOgp?: boolean
}

const Meta: React.FC<MetaProps> = ({
  title: _title,
  description,
  ogType = "article",
  imageUrl,
  ogUrl,
  twCard,
  canonical,
  disableIndex = false,
  disableOgp = false,
}) => {
  const title = `${_title}｜${serviceName}`
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width, viewport-fit=cover" />
      {canonical != null && <link rel="canonical" href={APP_URL + canonical} />}
      <meta name="description" content={description} />
      {!disableOgp && (
        <>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content={ogType} />
          {ogUrl != null && <meta property="og:url" content={APP_URL + ogUrl} />}
          <meta property="og:image" content={imageUrl} />
          <meta property="og:site_name" content={serviceName} />
          <meta property="og:locale" content="ja_JP" />
          <meta name="twitter:card" content={twCard} />
          <meta name="twitter:image" content={imageUrl} />
          <meta name="apple-mobile-web-app-title" content={serviceName} />
        </>
      )}
      {disableIndex && <meta name="robots" content="noindex, nofollow" />}
    </Head>
  )
}

export default Meta
