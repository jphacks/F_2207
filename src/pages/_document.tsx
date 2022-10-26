import { createGetInitialProps } from "@mantine/next"
import Document, { Head, Html, Main, NextScript } from "next/document"
import Script from "next/script"

const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
  static getInitialProps = getInitialProps

  render() {
    return (
      <Html lang="ja">
        <Head prefix="og: http://ogp.me/ns#">
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#212121" />
          <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
          <Script
            strategy="beforeInteractive"
            type="text/javascript"
            src="https://api.mapbox.com/mapbox-gl-js/v1.13.2/mapbox-gl.js"
          />
        </Head>
        <body className="bg-[#212121]">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
