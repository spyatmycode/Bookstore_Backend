// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage, ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhDnRIA3U3yPZdP66SZuXVU0lWe2XpcQ0",
  authDomain: "galeria-5a6e1.firebaseapp.com",
  databaseURL: "https://galeria-5a6e1-default-rtdb.firebaseio.com",
  projectId: "galeria-5a6e1",
  storageBucket: "galeria-5a6e1.appspot.com",
  messagingSenderId: "382848601380",
  appId: "1:382848601380:web:5640b8a9b52f21aaa137b1"
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
