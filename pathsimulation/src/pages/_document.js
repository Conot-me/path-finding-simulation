import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
    <Head>
      <title>Path finding simulation</title>
      <meta name="description" content="Simulations of various path finding algorithms."/>
      <meta name="keywords" content="dijkstras, A*, breadth first search"/>
      <meta name="author" content="Conot"></meta>
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
  )
}
