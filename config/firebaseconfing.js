import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBon0fpPRf3JE9G0XJGQ2r9X2nioGicUYc",
    authDomain: "barberiag37.firebaseapp.com",
    projectId: "barberiag37",
    storageBucket: "barberiag37.appspot.com",
    messagingSenderId: "842566589488",
    appId: "1:842566589488:web:63ce3cc03e8cf4e5d8e1f5",
    measurementId: "G-0JNLFECC11"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const db = getFirestore(app); 
export {db}
 