import '@/styles/globals.css';
import { Lato } from 'next/font/google';

import type { AppProps } from 'next/app';

const lato = Lato({ 
  subsets: ['latin'], 
  weight: '400',
  variable: '--font-lato',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${lato.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}
