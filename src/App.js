import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppBar, Button, Card, TextField, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: "#49c77f"
    },
    secondary: {
      main: "#494c7d"
    }
  }
});

firebase.initializeApp({
  apiKey: "AIzaSyANWLCSrIXK9HZRNPk99rsRoaprNTHzxWo",
  authDomain: "ecobridge-5fba0.firebaseapp.com",
  projectId: "ecobridge-5fba0",
  storageBucket: "ecobridge-5fba0.appspot.com",
  messagingSenderId: "92490643934",
  appId: "1:92490643934:web:a526cb3f7130014136454f",
  measurementId: "G-6P7VR4BE47"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth)
   
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <header className="App-header">
      <Typography variant='h1'color='primary'>Ecobridge</Typography>
      <section>
        {user ? <Chatroom/> : <SignIn/> }
      </section>
      </header>
    </div>
  </ThemeProvider>
  );
}

function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  
  return(
    <Button onClick={ signInWithGoogle }>Sign in with Google</Button>
  )
}

function SignOut(){

  return auth.currentUser && (
    <Button variant='contained' onClick={()=> auth.signOut()}>Sign Out</Button>
  )
}

function Chatroom(){

  const dummy = useRef( ) 

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, {idField : 'id'})
  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e)=> {
    e.preventDefault()
    const {uid} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    })
    
    setFormValue('')
  }
   
  return (
    <>
    <div>
      <SignOut/>
      {messages && messages.map((msg)=>(
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={dummy}></div>
    </div>

    <form onSubmit={sendMessage}>
      <TextField value={formValue} onChange={(e) => 
      setFormValue(e.target.value)}/>
      <Button variant='contained' type='submit'>send</Button>
    </form>
    </>
  )
}

function ChatMessage(props){
  const { text, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  return(
    <div className={`message${messageClass}`}>
    <Card>{text}</Card>
    </div>
  )


}

export default App;
