import { createGetInitialProps } from "@mantine/next"
import Document, { Head, Html, Main, NextScript } from "next/document"

const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
  static getInitialProps = getInitialProps

  render() {
    return (
      <Html lang="ja">
        <Head prefix="og: http://ogp.me/ns#">
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#212121" />
          <link rel="preconnect dns-prefetch" href="https://identitytoolkit.googleapis.com" />
          <link rel="preconnect dns-prefetch" href="https://recupsel.firebaseapp.com" />
          <link rel="preconnect dns-prefetch" href="https://apis.google.com" />
        </Head>
        <body className="bg-[#212121]">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
