import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // your config
  apiKey: "AIzaSyBwXx4mESnsUrggajWzxfEu47daCz0CbR4",
  authDomain: "chat-app-d4d5b.firebaseapp.com",
  projectId: "chat-app-d4d5b",
  storageBucket: "chat-app-d4d5b.appspot.com",
  messagingSenderId: "215067635258",
  appId: "1:215067635258:web:b73ee5c12fc5dd0df28f03",
  measurementId: "G-724LH7GSE4"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <span role='img' aria-label=''>Superchat 💬</span>
        <SignOut />
      </header>

      {/* User authentication if he's logged in or not, if not logged in redirects to the SignIn page */}
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      {/* <p>Do not violate the community guidelines or you will be banned for life!</p> */}
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>
        <span role='img' aria-label=''>SEND</span>
      </button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img alt='' src={photoURL || 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngegg.com%2Fen%2Fpng-nvboa&psig=AOvVaw0zYLzlRN24ryzPQAMp-s7M&ust=1666767521052000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCIiEgILn-voCFQAAAAAdAAAAABAK'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
