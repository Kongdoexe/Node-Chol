import express from "express";
import multer from "multer";
import path from "path";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

export const router = express.Router();

// 1. connect firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3R36rOd-q0PFpM4smva1RpL7oc9wbHNg",
  authDomain: "uploadproj-c725e.firebaseapp.com",
  projectId: "uploadproj-c725e",
  storageBucket: "uploadproj-c725e.appspot.com",
  messagingSenderId: "869157966578",
  appId: "1:869157966578:web:2a3be3626340cebf77366b",
  measurementId: "G-3164STF7PT"
};

initializeApp(firebaseConfig);
const storage = getStorage();

// upload to firebase
class FileMiddleware {
  filename = "";
  public readonly diskLoader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 67108864, // 64 MByte
    },
  });
}

// PUT
const fileUpload = new FileMiddleware();
router.post("/", fileUpload.diskLoader.single("file"), async (req, res) => {
  let uid = "Image";

  const filename = Date.now() + "-" + Math.round(Math.random() * 100);

  const storageRef = ref(storage, "/images/" + uid + "/" + filename);
  
  const metadata = {
    contentType: req.file!.mimetype,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    req.file!.buffer,
    metadata
  );

  const url = await getDownloadURL(snapshot.ref);
  res.status(200).json({
    file: url
  });
});
