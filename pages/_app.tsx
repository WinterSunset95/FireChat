






import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { useState, useEffect, useContext } from 'react'
import AppContext from '../AppContext'
import { db } from '../firebase/Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection, getDoc, doc, query, orderBy, addDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

export default function App({ Component, pageProps }: AppProps) {
	const [name, setName] = useState('')
	const [state, setState] = useState(false)
	const [uid, setUid] = useState('')

	const usersRef = query(collection(db, 'users'))
	const users = useCollectionData(usersRef)[0]
	const auth = getAuth();

	const checkUser = (thisid:any) => {
		if (users && users.length > 0) {
			let stat = users.filter(item => item.uid == uid)
			if (stat.length > 0) {
				console.log('found')
			} else {
				console.log('not found')
				addDoc(collection(db, 'users'), {
					name: auth.currentUser.displayName,
					uid: auth.currentUser.uid,
					email: auth.currentUser.email,
					phone: auth.currentUser.phoneNumber,
					picture: auth.currentUser.photoURL
				})
			}
		}
	}

	const checkAuthState = () => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setState(true)
				setName(user.displayName!)
				setUid(user.uid!)
				checkUser(user.uid)
			} else {
				setState(false)
			}
		});
	}

	const signIn = () => {
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
		<AppContext.Provider value={{ name, setName, state, setState, uid, setUid, signIn, logOut, users }}>
			<Head>
				<meta name="application-name" content="FireChat" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Component {...pageProps} />
		</AppContext.Provider>
	)
}
