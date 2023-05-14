import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
    <Head>
      <meta name="description" content="Simulations of various path finding algorithms."/>
      <meta name="keywords" content="dijkstras, A*, breadth first search"/>
      <meta name="author" content="Conot"></meta>
      <link rel="icon" type="image/png" href="/images/pathIcon2.jpg"/>
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
  )
}
