import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXvWLBuyGdYYO3H2XuEtjY69mJcbFnZ88",
  authDomain: "lord-gantulu.firebaseapp.com",
  projectId: "lord-gantulu",
  storageBucket: "lord-gantulu.firebasestorage.app",
  messagingSenderId: "426957603683",
  appId: "1:426957603683:web:cbd8fa1972012355a54956"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
