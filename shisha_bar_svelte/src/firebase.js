import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Inițializarea aplicației Firebase
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBJplYgQ1HA5G5UqVVIGe7Dn5EMh5MIS-0',
  authDomain: 'licenta-567d2.firebaseapp.com',
  projectId: 'licenta-567d2',
  storageBucket: 'licenta-567d2.appspot.com',
  messagingSenderId: '647929130528',
  appId: '1:647929130528:web:33f917b87aa050e1ca5645'
})

// Obținerea instanței de autentificare
const auth = getAuth(firebaseApp)

// Obținerea instanței de Firestore
const db = getFirestore(firebaseApp)

// Inițializarea Firebase App Check doar în browser
if (typeof window !== 'undefined') {
  const appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider('6LcEXOopAAAAAIB51Q9EXk0B0EFyil9U1AvxSS6z'),
    isTokenAutoRefreshEnabled: true
  });
}

export  { auth, db }