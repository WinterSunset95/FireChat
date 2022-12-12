



import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'
import { db } from '../firebase/Firebase'
import { collection, getDoc, doc, query, orderBy, addDoc } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faXmarkCircle, faBars, faHouse } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faFacebook, faReddit } from '@fortawesome/free-brands-svg-icons'

const User = ({usernav, setUsernav}:any) => {
	// getting the users
	const usersRef = query(collection(db, 'users'))
	const users = useCollectionData(usersRef)[0]
	return (
				<section className={`flex flex-col ${styles.usersList} h-full bg-[rgba(50,50,50,1)] ${styles.users} ${usernav ? 'p-4 w-full' : 'p-0 w-0'} md:w-full md:p-4 outline outline-2 outline-black`}>
					<div>
						<div className={`md:hidden ${usernav ? '' : 'hidden'} flex w-full flex-row justify-end`}>
							<FontAwesomeIcon icon={faXmarkCircle} onClick={() => setUsernav(false)} className="md:hidden fa-xl"/>
						</div>
						{
							users && users.map((user) => {
								return (
									<div key={user.id} className="flex flex-row justify-center items-center w-fit mb-1">
										<img src={user.picture} alt="" className="rounded-full mr-1 w-12"/>
										<div className="p-2 mb-1 rounded-md bg-[rgba(100,100,100,0.5)] hover:bg-white w-fit h-fit text-white">
											<a href={`/chat/${user.uid}`}>{user.name}</a>
										</div>
									</div>
								)
							})
						}
					</div>
					<div className="px-4 py-2 bg-blue-400">Log Out</div>
				</section>
	)
}

export default User
