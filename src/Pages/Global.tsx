




import {useState, useEffect} from 'react'
import User from '../Components/User'
import Message from '../Components/Message'
import { db } from '../Firebase'
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
		const api = new ChatGPTAPI({ sessionToken: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..bpwPTBIl2pnP-9CG.quZKU_NIFzWVfWn2DKJ8-0THw4aJbKHe5Vk6RTBwL3a2tQ3dvGQ2WTsyEr4PENdLxGL1CYA9T8AHAjEuLCF-Kb2wyJxzosi9XiDl1HG5aJGJAE7aT3TIMUxTLZFz5fJvDt6aF9wTknYnhXnFwIKLDt_79Ot4Rhvq3-yMyFOLWgkEbHXWJUsXMupxAVrI7a2qfZ9S5yhrNU3YZKkCjLh80Ux_Tj3qDNyyxhnWpkyQ56p-x55ewM18F3qBkUBNgKYU6RYawcEmQw18ntfc6MOehbgDw-ZxxIykDy0uQD_WSxal7Lxl47laJ90LB79i3-ytid9OwvXKuXDDKxGu_lwbCUX3m5Eh3C66aqie3aCr_fiRGKgGUl3vfRgj68LWn-pkOiXz6v96wmaiMLiIOKceQZR5004LCtv6LIlRVHAo9Cq-QlvR3c66BVMFO6ebcBhEb7jmdXkfLhuHHiHVM5UKmth1spMCL2xCA57G883fWag-pceZ0ijy3OId2JEt-tMG6cs2h5vfPKepo3lk7Ia-ffo0dhic3djsYCr0cpEydcmK8N9V2y65FZth7i65N690GtPJUhIdliPIO1ZTku6oqoF2AgIqo1vvPZJxsDidyIIbiYjqLnNsgew4VsZyDrdV2eLbrl42kevIaitKGibBUPc0Aarh8guZ8ivDg5tUsHVYucg6YJobw9DH2HeO3zvt2mauaKY-t0MCMhAvzfjljst9sWMe3-1Dw1fhtOwKbfGKFzndFonDZtZ5nRfu_JIlk7u7Ce2f1Q5DzsXjgsgwnlL5XtzEfjCjtldwY1RQXpyJbwcVApnHnNIRuRemS8ChzrCHXe7jZm_B06mLl9obIy-a02NGCOcVPML0mmjmHc_0GWbLgjCfuPeAyz7HdZA0XxBxkFOCyxfpTkZQrgqMRUILYTn4ctRvKp8V-mdS4bkfGWNzwNvvlw7kQGOV-R6fFJQ6_E6h2k2Z-0Db1vAiROpYGRXkus8LNFF77ufTw4oBc02NdLAVCdwNLSadDa8twGiygXxVA4ojkadzFsBVSDVjyhI_U3BZz7jV9gzgDFIWkaLOpRCamPmAozYY9wzITs0sIqGp1FOKLIEA7mbAt_BMU6rkBi5AZEqEYeDMqko3BBKFus-eyEqKXybwR1HqIZ0g4Kf1VvvLoc8m8fzkiCw_jHDgcSNZQblHLLSE6ZoyY2Z7-SnROk2QOLhbcjMmaAdnmSqRS-xPe-2AwMJD_OnJEuS7FlBwaQ5LDZZC3tbUQUu1ZC--WSNXuxr1Eifo7M6JQrhwIa25-Xd_IKD3MkozUCZEb002mmx59UPRu-g6FHIjfoQsEu2NeewraWX8248vDGcfuomoEMLaWWFFoNhLkJItb8g2FyaPPjgwXz47swj1rfHD3i9n9M_Yxjm1f-meYBiLPZeEFtqpNcPf7B4QQA8ZyddsOea4SghnOQMMGE1bfJ1sVQFOpO5-7jmPweQiilvptKY5WyYOxAGICTkVQPe5Bmqc49VxAztuYq-Viq5J2af4jtCIlWP1OxYJHkcVQF-HpJbq6tYr7E7X3m1irIRUyHkM3h9Wi9vkf_rSSzvrTxZQA71iGwZEqDDyMf1Q5mrrWf_U-cOXQNrbI7wyR5tx4rPbCOe_LVHkm5PUhzGlJUi22WdvDyCT2s0LuzkxAQBWUbxPG6zufAdvEt8c2b0cWS8ueGSN1usCd7s7V5Nr8ZIZEuNVfMtomiB21DxKUWZs95O9CbX4iFLNG5jG1USr9QAgqGXQkr5XiZIU00LfWMdRWFAQAOvPCkAmxj913rHbRGvG4XkdZkpddcxTkArsXoeTC2XhpfKhDR80RUww7APnwESK12dMeNmsszzSl-y5zuaFYj0LLlKXpgmA80SLN1jAqLyUtFDF8Q5wciYxZwI8Ywi68cyJzZmS9F2h2CkqbQdRpejvwo65eHHHcaqNVEdIPiQTpVQB2atRcYDkRWzV8ZZw6E0dQYKGgDO9KJhzxXN_ZAKmPGUEJ3XmDri4B2_tv8OPqmlfoj7EmXcRjB4d5mq_T1Sz4SbdxXSKogd-7i9bd3C5GHD8tm6OeyCpsoTslrzCnhHEjdditfZp-C8M-jKpJ9cxsZY7A9pBQ4gAhNMd892z8MqxQIBCRWu-JcHi5BbrSTgeZOlHyBZrftoTI-7pTXPvs-lCHD9JrMsA4KPdXLWpEOaUJmx3YGrL6VyGN4LjylJ8w-i4OC6e9ykVM9q8g4AOaAicmN8XZ4dKqQ-kCrc5eCbHtMFlwDM.WiyhaLJT67Ojn_whQFY3cg' })
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
