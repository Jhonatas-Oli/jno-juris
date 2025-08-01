import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 🔐 Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDP9r6hxJ5ewZIaFhSKfKu1EK9UFsjrC5E',
  authDomain: 'jno-juris.firebaseapp.com',
  projectId: 'jno-juris',
  storageBucket: 'jno-juris.appspot.com',
  messagingSenderId: '956349740423',
  appId: '1:956349740423:web:0d4b2d39696f6767c24f22',
  measurementId: 'G-XNNLHR33P8',
};

// 🔄 Inicializa Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORTAÇÕES necessárias
export const auth = getAuth(app);
export const db = getFirestore(app);
