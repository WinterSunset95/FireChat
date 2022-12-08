




import {useState, useEffect} from 'react'
import User from '../components/User'
import Message from '../components/Message'
import { db } from '../firebase/Firebase'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, query, collection, orderBy, getDocs } from 'firebase/firestore'
import { ChatGPTAPI } from 'chatgpt'

const Global = () => {

	const [name, setName] = useState('')
	const [state, setState] = useState(false)
	const [uid, setUid] = useState('')
	const [drop, setDrop] = useState(false)

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

	const aichat = async (msg:any) => {
		send(msg)
		const api = new ChatGPTAPI({ sessionToken: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..u52hXbXhTAdQ8yub.aOH9UKPeiufeWQ4sg1hoWB_A2TSBESoCqNapxdwPLJ9X0vq9y2-BGKDCwuWZhZ0zgrALk0PXytDjxmcdMHlY0R05XqIQNzseRj--nQHj19TLdQ1zAQ6d-qNQNHxhasfanrloOAPg3fUTLDlQX7NkuBLtGrqE7JvzKtOB7JJdHeBnycrWU9a562MgeUc89NZUpG0Ljh7ujpk_gvb-CWSr44VunGpzwgFaJJ8dwsASZS2bKAhj0QtT9cJjU5phRkHVyRzqxTpVXnFbNR6XKe_rzTr3otlpP68oY43Z3saQs0kE3iXEHefCeGKxPmevCineMUHXBvwTq1hr8mPXiB3M1n3G3ZpQOeyinMFt333UrG42jR4rMELvbsyditVZAPmYuZCgvRqOgpBzxOlUxe2W7cjSMuKrQubg6guosVNB6qcU4J1qo0eOnU8BopiZ2mESy7AfRMV6q6ZYao2tz2wcjeXxUElWzO_C-Yf77FkSQrk7K4-fD2Nu5c26uLGqK5aenyID5_6eK6QkZIQ0sCsySh2vhJxRHhcpV3imYh-j5tC1OLNZGxoSnIKzDw0_an-cpDzN89orHqv-jZM5Bn7Jde8QTJP52UtKtPqoD1te7_AwQA6pfbtb_wYE3ftVM-4I2TT9J5JcFkpIySqWoeYZh0FNkSc9722CzcBlcPgJMsLbSmw-b21roxLOETo-jHRPvhOFXvhdaut3s3KvDxnfl6LS78x-Bi8LSUFK7AKBlIEmeqlASzTxZHqWJugdyl3hcKKSH_FiarHxCjSE4xs97cVpcB3PwnSO71i1BXlUAFUb8tNuaYS98O3lp3aFgqF2CdiNo1ZEoPiZsuoBMpU26FWfF6OsOujzjxYB-xVdnVr28oMcREgCF378ShznOiLI6H793dxB5FgpYTCqJKNKxZjxUV5wxhGWMK40uBfIb0X2-kGkVQCju4aLiB7Yv-nKCUCC-yhJUIz71Bv_RNy2NAuX_4hHuB1SRnmB3qwMSYxezxXcrlb5wkS6i7-8lYZPxU6S0aGLl5fsAndUl5jKQhHDwvvuEUQvlt8tkko5bNgrkckr5Zctp22AzKBIDug_OyJ9VHPSRm42LLc8oOgG6ptI4GREYqX22n3JcFC91OIyTmQT9S7DXtDVbbuaupek5-4AIzfVyY1DbW549QOaU5jprgad49la4ID9ZDBZ_Q7yvxxEbhqCQHc2xuAUQSin3PO0zahCx0eaAGCNmbQ76tFF5dbBt9heF8EeLzfLZCq1Ql0GjEvFhtvXF8jcGdplHzC7wuusUGRVDNiA6Cpfwq1TVCfi1M02H20HDXsmwssMEceWImHqZ0YIZsbHLddj70HbDOD0od9mnDv-KYjeCNom3odLJK9FjwYS5eZvz9mENYfdWrpbGjMZkOlecUZuUYgdOsGmeVfAs5HPNuTe6Mquk37E9fAqzggJgJWiioQDigVunx6bNGuWqU-PY0PSILPEGVPVOsfgdiT6xQ9fFDMS_3fJX2q2xPQtvC3TUmS6If-b18-GPxf8TXrf9AUDtgVTJJi33wxXwRJ6npwXE5OTVjoQlXL7oIae6dz9LuPCB9JaJs2ymHcHAT4qqnkZFz3NkNx50g21kzfflXxIGtw8GJrtmsV3mL4Uqc3jKl7BvhzXdg8prxvMDLtCb51KKDrSvQcU0hJBuemw973nIiP9SIBYz4BT39DoCfUiTdkApbZTvTp1aov9qbXwphQ5zoXmcuQMYAC66buTqYytlvJSmK3SG2w2qc5xTkWJYyKwvVlq6aPSMry7veN48KB-SDWIXYXa_bTOKvECb02-gnwinAw-PT1lemc8Q-OeEu6eyTb0gNyRbcB-8CQGu9zxSRbSIukPtoy0Ds9Fl60HOK-Y40v6HYUHQReB-gY4X8uFptpo6lOj4z_2uYR0b771AA955T-mJf-JhBKSuazTB1XmOUgGveWaL9R3acb1NrUvpbv9r0fmS8Hr1RWLoGyqifYM-8gudr-DZIDGP6WhvxPKKmb5XhxtTWvNy23PNfuhlM0jWTcsPKIatwwpnX3NN5wB-q3RdoagYd_ewgENw_4i-cCt8vFura43Hjq7ReY6WhPujaQkWf-65gmnDSc7NBqii-_3SP5odWve1srR8knl9IZ0y5OGrRx9Vio8WVFqBGhVtMssSdM05wKPGNSiWfD5YomUjAPdcF2LrXFOoB1q-nz5b9Yki_qe8xqP5ZwyJvDEolf7O2zpL4G3ooY5feIf6_-WXrq_JyrS5QWtxyaliCE.fICtrlw6Yp7A9LVBEllVXg' })
		await api.ensureAuth()
		const text = msg.replace('@chatgpt', '')
		const response = await api.sendMessage(text)
		send(response)
	}

	const handleSend = () => {
		const node = (document.getElementById('input-field') as HTMLInputElement)
		const msg = node.value
		if (msg.includes('@chatgpt')) {
			aichat(msg)
		} else {
			send(msg)
		}
		node.value = ''
	}

	const send = (msg:any) => {
		msg != '' ?
		addDoc(collection(db, 'global'), {
			user: name,
			uid: uid,
			message: msg,
			reacts: 0,
			timestamp: new Date(),
			replies: ''
		}) : console.log(msg)
	}

	const check = (event:any) =>{
		event.keyCode == 13 ? handleSend() : null
	}

	const messagesRef = query(collection(db, 'global'), orderBy('timestamp'))
	const [messages] = useCollectionData(messagesRef)

	useEffect(() => {
		checkAuthState()
	}, [name])

	useEffect(() => {
		const node = document.getElementById('messages')
		node!.scrollTop = node!.scrollHeight
	}, [messages])

	return (
		<main className="sticky top-0 left-0 w-full h-screen max-w-[800px] m-auto flex flex-col border-2 border-black bg-[rgba(50,50,50,0.5)]">
			<div className="p-4 flex justify-between bg-black text-white MontAlt relative">
				<span>FireChat</span>
				<span>{name}</span>
				<div className={`${drop ? 'hidden' : ''}`} onClick={() => setDrop(true)}>
					<i className={`fa-solid fa-bars`}></i>
				</div>
				<div className={`${drop ? '' : 'hidden'} relative`}>
					<i className={`fa-solid fa-circle-xmark`} onClick={() => setDrop(false)}></i>
				</div>
				<div className={`${drop ? 'h-40' : 'h-0'} absolute bottom-0 right-4 translate-y-full overflow-hidden duration-100 flex flex-col justify-around items-center z-50`}>
					<a href="https://github.com/WinterSunset95/FireChat" target="_blank">
						<i className="fa-brands fa-github fa-2x m-1"></i>
					</a>
					<a href="https://facebook.com/autumntowinter"  target="_blank">
						<i className="fa-brands fa-facebook fa-2x m-1"></i>
					</a>
					<a href="https://reddit.com/u/WallaceThiago95" target="_blank">
						<i className="fa-brands fa-reddit fa-2x m-1"></i>
					</a>
					<a href="https://wintersunset-portfolio.vercel.app" target="_blank">
						<i className="fa-solid fa-house fa-xl m-1"></i>
					</a>
				</div>
			</div>
			<section className="grow w-full flex flex-col overflow-y-scroll" id="messages">
				{
					messages && messages.map(msg => <Message key={msg.timestamp} message={msg.message} username={msg.user} pos={msg.uid == uid ? 'right' : 'left'}/>)
				}
			</section>
			<section className="flex justify-around items-center w-full p-2 bg-black">
				{
					state ? 
						<>
							<input type="text" className="h-10 rounded-full grow p-2 m-4" id="input-field" onKeyDown={(event) => check(event)}/>
							<div className="cursor-pointer" onClick={() => handleSend()}>
								<i className="fa-solid fa-xl fa-paper-plane mr-4 text-white"></i>
							</div> 
						</>
						:
						<div className="p-4 rounded-full bg-blue-400 text-white" onClick={() => signIn()}>Login to send messages</div>
				}
			</section>
		</main>
	)
}

export default Global
