






import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { useState, useEffect, useContext } from 'react'
import AppContext from '../AppContext'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

export default function App({ Component, pageProps }: AppProps) {
	const [name, setName] = useState('')
	const [state, setState] = useState(false)
	const [uid, setUid] = useState('')

	const checkAuthState = () => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setState(true)
				setName(user.displayName!)
				setUid(user.uid!)
			} else {
				setState(false)
			}
		});
	}

	const signIn = () => {
		const auth = getAuth();
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
		.then((result) => {
			setName(auth.currentUser!.displayName!)
			setUid(auth.currentUser!.uid)
			setState(true)
		})
	}

	const logOut = () => {
		const auth = getAuth()
		signOut(auth)
	}

	useEffect(() => {
		checkAuthState()
	}, [name])

	return (
		<AppContext.Provider value={{ name, setName, state, setState, uid, setUid, signIn, logOut }}>
			<Head>
				<meta name="application-name" content="FireChat" />
				<link rel="manifest" href="/manifest.json" />
			</Head>
			<Component {...pageProps} />
		</AppContext.Provider>
	)
}
