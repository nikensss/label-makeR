import firebase from 'firebase/app';
import 'firebase/firestore';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyD4SrmTd-3FFHy6JLU0PX4z8RHu-doIZdk',
  authDomain: 'label-maker-app.firebaseapp.com',
  projectId: 'label-maker-app',
  storageBucket: 'label-maker-app.appspot.com',
  messagingSenderId: '547286920217',
  appId: '1:547286920217:web:a2aa7d58bec6d24922ce88',
  measurementId: 'G-FK9K9PL6CH'
});

console.log({ app });
const db = app.firestore();

export { app, db };
