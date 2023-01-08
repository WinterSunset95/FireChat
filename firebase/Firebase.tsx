//
//
//
//
//
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

//const firebaseConfig = {
//  apiKey: "AIzaSyBMAZdqFhpEHLBkh9CiwgimEyyy5vIzpWI",
//  authDomain: "fir-chat-7b237.firebaseapp.com",
//  projectId: "fir-chat-7b237",
//  storageBucket: "fir-chat-7b237.appspot.com",
//  messagingSenderId: "871132674840",
//  appId: "1:871132674840:web:2ae2287e32d902bcc2bc6d"
//};

const firebaseConfig = {
	apiKey: "AIzaSyAkQ3m218l2V04nNST11rZ537qfdTxUn_g",
	authDomain: "chatapp-next-43499.firebaseapp.com",
	//databaseURL: "https://chatapp-next-43499-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "chatapp-next-43499",
	storageBucket: "chatapp-next-43499.appspot.com",
	messagingSenderId: "1068927886270",
	appId: "1:1068927886270:web:af73d0935d1e72080b0fef",
	//measurementId: "G-4LGLDQ9X9C"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
