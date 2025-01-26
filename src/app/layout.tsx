import '../styles/global.css';
import MainLayout from '../layouts/MainLayout';
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Agentic AI - Automate your workflows with AI precision." />
        <meta name="keywords" content="AI, automation, workflows, productivity" />
        <meta name="author" content="Agentic Studio" />
        <link rel="icon" href="/favicon.ico" />
        <title>Agentic Studio</title>
      </Head>
      <body>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
