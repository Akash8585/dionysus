// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDChrJvbEr8okAy5BO__uXh5kgoKom68rU",
  authDomain: "dionysus-a160d.firebaseapp.com",
  projectId: "dionysus-a160d",
  storageBucket: "dionysus-a160d.firebasestorage.app",
  messagingSenderId: "677347338086",
  appId: "1:677347338086:web:311d18e0ebd34d63470aa7",
  measurementId: "G-ERFTXB2FQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const  storage = getStorage(app)


export async function uploadFile(file: File, setProgress?: (progress: number) => void) {
    return new Promise((resolve, reject) => {
      try {
        const storageRef = ref(storage, file.name)
        const uploadTask = uploadBytesResumable(storageRef, file)
  
        uploadTask.on('state_changed', snapshot => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          if (setProgress) setProgress(progress)
          switch (snapshot.state) {
            case 'paused':
              console.log('upload is paused'); break;
            case 'running':
              console.log('upload is running'); break;
          }
        }, error => {
          reject(error)
          
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
                resolve(downloadUrl as string)
            })
        })
  
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
  