import '../style.css';
import 'react-dropzone-uploader/dist/styles.css'
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Magic Next.js</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
