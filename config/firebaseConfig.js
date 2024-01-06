// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage, ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


export const addImageToFirebase = async (file, fileName) => {
  try {
    const imageStorageRef = ref(storage, `images/${fileName}`);
    
    // I'm using uploadBytes to upload the file
    await uploadBytes(imageStorageRef, file);

    // Getting the download URL from firebase as should
    const downloadUrl = await getDownloadURL(ref(storage, `images/${fileName}`));

    // Returning the download URL or handle it as needed
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw error; // Propagate or send the error to the caller
  }
};

export const deleteImageFromFirebase =async(fileName)=>{

    const imageStorageRef = ref(storage, `images/${fileName}`);

    const deleteImage = await deleteObject(imageStorageRef)

}
