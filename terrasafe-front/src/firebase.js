// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD3nryG0OUz5ECd7iiRe0zkCEpQ-F_sW-c",
    authDomain: "terrasafe-a526c.firebaseapp.com",
    projectId: "terrasafe-a526c",
    storageBucket: "terrasafe-a526c.appspot.com",
    messagingSenderId: "785754992090",
    appId: "1:785754992090:web:e02045714a7002c75de4e3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the auth object

export { app, auth };
export default app; 