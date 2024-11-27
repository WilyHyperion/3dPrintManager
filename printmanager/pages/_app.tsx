import "@/styles/globals.css";
import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { useEffect } from "react";
import  Head from "next/head";
import React from "react";
export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
     <Head>
        <title>Print Manager</title>
      </Head>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
    </>
  )
}