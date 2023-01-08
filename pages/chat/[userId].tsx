




import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Message from '../../components/Message'
import User from '../../components/User'
import YouTube from 'react-youtube'
import { useState, useEffect, useContext, useRef } from 'react'
import AppContext from '../../AppContext'
import { useRouter } from 'next/router'
import { db } from '../../firebase/Firebase'
import { collection, getDoc, doc, query, orderBy, addDoc } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faXmarkCircle, faBars, faHouse, faVideo } from '@fortawesome/free-solid-svg-icons'

const ChatPage = () => {
	const [uri, setUri] = useState('')
	const video = useRef(null)
	const [vidstate, setVidstate] = useState(true)

	const router = useRouter()
	const { userId } = router.query

	const { name, uid, state, signIn } = useContext(AppContext)

	let nameArr = [uid, userId]
	nameArr = nameArr.sort()

	const chat = nameArr[0] + nameArr[1]

	// messages
	const messagesRef = query(collection(db, chat), orderBy('timestamp'))
	const messages = useCollectionData(messagesRef)[0]

	// video
	const vidRef = query(collection(db, 'video' + chat), orderBy('timestamp'))
	const videos = useCollectionData(vidRef)[0]

	const [usernav, setUsernav] = useState(false)

	const aichat = async (msg:any) => {
		send(msg)
		const text = msg.replace('@chatgpt', '')
		const response = await fetch('/api/chatgpt?message=' + text)
		const res = await response.text()
		text != '' ?
		addDoc(collection(db, chat), {
			user: 'ChatGPT',
			uid: 'chatgpt@firechat',
			message: res,
			reacts: 0,
			timestamp: new Date(),
			replies: ''
		}) : console.log(msg)
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
		addDoc(collection(db, chat), {
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

	const VidMode = (props:any) => {
		return (
			<video src={uri}></video>
		)
	}

	const vidUpdate = (event:any, time:any, uri:any) => {
		let id
		if (uri.includes('youtu.be')) {
			id = uri
		} else {
			id = uri.split("&v=")[1]
			id = 'https://youtu.be/' + id
		}
		addDoc(collection(db, 'video' + chat), {
			action: event,
			user: name,
			uid: uid,
			seek: time,
			timestamp: new Date(),
			uri: id,
		})
	}

	const handleVidClick = () => {
		const node = (document.getElementById('input-field') as HTMLInputElement)
		const msg = node.value
		let id = msg.split('youtu.be/')[1]
		if (uri != id) {
			console.log(msg)
			console.log(id)
			vidUpdate('set', 0, msg)
		}
	}


	const stateChange = (event:any, state:any) => {
		if (video.current) {
			if (event == 'pause') {
				vidUpdate(event, state.target.getCurrentTime(), state.target.getVideoUrl())
			} else if (event == 'play') {
				vidUpdate(event, state.target.getCurrentTime(), state.target.getVideoUrl())
			}
		}
	}

	useEffect(() => {
		const node = document.getElementById('messages')
		node!.scrollTop = node!.scrollHeight
	}, [messages])
	useEffect(() => {
		if (videos && videos.length > 1) {
			let data = videos[videos.length - 1]
			let id = data.uri.split('youtu.be/')[1]
			console.log(id)
			console.log(data)
			if (id != 'undefined' && uri != id) {
				setUri(id)
			}
			if (data.action == 'play') {
				video.current.internalPlayer.playVideo()
				video.current.internalPlayer.seekTo(data.seek)
			}
		}
	}, [videos])

	return (
		<div>
			<div className={`${styles.gridContainer} h-screen`}>
				<nav className={`MontAlt flex flex-row justify-between items-center p-4 bg-[#000] text-white ${styles.navbar}`}>
					<div >FireChat</div>
					<div className={`md:hidden ${usernav ? 'hidden' : ''}`}>
						<FontAwesomeIcon icon={faBars} onClick={() => setUsernav(true)}/>
					</div>
				</nav>
				<User usernav={usernav} setUsernav={setUsernav}/>
				<div className={`${vidstate ? '' : 'hidden'} ${styles.iframe}`}>
					<YouTube
						ref={video}
						width={500}
						height={500}
						videoId={uri != '' ? uri :'2g811Eo7K8U' }
						onPlay={(state) => stateChange('play', state)}
						onPause={(state) => stateChange('pause', state)}
					/>
				</div>
				<div className={`flex flex-col overflow-y-scroll ${styles.messages}`} id="messages">
					{
						messages && messages.map(msg => <Message key={msg.timestamp} message={msg.message} username={msg.user} pos={msg.uid == uid ? 'right' : 'left'}/>)
					}
				</div>
				<div className={`flex justify-around items-center w-full p-2 bg-black ${styles.footer}`}>
					{
						state ? 
							<>
								<div className="cursor-pointer" onClick={() => handleVidClick()}>
									<FontAwesomeIcon icon={faVideo} className="text-white fa-xl ml-4"/>
								</div> 
								<input type="text" className="h-10 rounded-full grow p-2 m-4" id="input-field" onKeyDown={(event) => check(event)}/>
								<div className="cursor-pointer" onClick={() => handleSend()}>
									<FontAwesomeIcon icon={faPaperPlane} className="text-white fa-xl mr-4"/>
								</div> 
							</>
							:
							<div className="p-4 rounded-full bg-blue-400 text-white" onClick={() => signIn()}>Login to send messages</div>
					}
				</div>
			</div>
		</div>
	)
}

export default ChatPage
