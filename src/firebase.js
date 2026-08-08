import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAh-wIZ8bag2rB2_kJ7gzsBURT48rpQrAc",
  authDomain: "ap-cs-a-adaptive-system.firebaseapp.com",
  projectId: "ap-cs-a-adaptive-system",
  storageBucket: "ap-cs-a-adaptive-system.firebasestorage.app",
  messagingSenderId: "583658215718",
  appId: "1:583658215718:web:152bbfa09783c864b249e7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
