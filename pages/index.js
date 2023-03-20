import Head from "next/head";
import Interactive from "components/Interactive";
import Scrollytelling from "components/Scrollytelling";
import Hero from "components/Hero";
import Footer from "components/Footer";
import { GithubIcon } from "components/icons/GithubIcon";

export default function Home() {
  return (
    <>
      <Head>
        <title>Portraits from Images</title>
        <meta name="description" content="Face Style Transfer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <header className="fixed top-0 right-0 p-3">
        <a
          href="https://github.com/annakaz/face-style-transfer"
          target="_blank"
        >
          <GithubIcon />
        </a>
      </header> */}
      <main className="main">
        {/* <Hero /> */}
        <Interactive />
        <Footer />
      </main>
    </>
  );
}
