






import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { useState, useEffect, useContext } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
