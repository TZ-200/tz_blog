import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

/**
 * getInitialPropsはNextjsの機能。最初のrenderの前に実行される。
 * render前にそのページをスタイリングする要素を集めて適用=>サーバーサイドでpre-renderしてからクライアントに送信
 * なのでリフレッシュしたときのベアボーンなコンポーネントが露出しない
 */
export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>{this.props.styleTags}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}