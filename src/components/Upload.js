import React from 'react'
import Webcam from "react-webcam";
import { useState, useRef, useCallback } from "react";
import { storage, db, getDownloadURL  } from '../lib/firebase-config'; // Adjust the import path as necessary
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

export default function Upload() {
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
  
    const videoConstraints = {
        facingMode: "environment" // Use "environment" for the back camera
    };

    const handleStartCaptureClick = React.useCallback(() => {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/mp4"
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);
  
    const handleDataAvailable = React.useCallback(
      ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
      },
      [setRecordedChunks]
    );

    const uploadVideo = async (videoBlob, uid) => {
        const uid = localStorage.getItem('uid');
        if (!videoBlob || !uid) {
            console.log("No video to upload or UID is missing.");
            return;
        }
    
        // Define storage path with UID as subfolder name
        const videoPath = `videos/${uid}/${new Date().getTime()}.mp4`;
        const storageRef = ref(storage, videoPath);
        
        try {
            // Upload video blob to Firebase Storage
            const snapshot = await uploadBytes(storageRef, videoBlob);
            alert('Uploaded a blob or file!', snapshot);
    
            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
    
            // Define Firestore document reference
            const docRef = doc(firestore, "videos", uid);
    
            // Data to store in Firestore
            const docData = {
                downloadURL: downloadURL,
                timestamp: new Date(), // Store current timestamp
            };
    
            // Store the download URL in Firestore
            await setDoc(docRef, {
                videos: arrayUnion(videoData)
            }, { merge: true });
            alert("Download URL saved in Firestore");
        } catch (error) {
            console.error("Upload failed", error);
        }
    };
  
    const handleStopCaptureClick = React.useCallback(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const videoPreview = recordedVideo ? (
        <video controls src={URL.createObjectURL(recordedVideo)} />
    ) : null;
  
    // const handleDownload = React.useCallback(() => {
    //   if (recordedChunks.length) {
    //     const blob = new Blob(recordedChunks, {
    //       type: "video/webm"
    //     });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     document.body.appendChild(a);
    //     a.style = "display: none";
    //     a.href = url;
    //     a.download = "react-webcam-stream-capture.webm";
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     setRecordedChunks([]);
    //   }
    // }, [recordedChunks]);

  return (
    <>
        <Webcam audio={false} ref={webcamRef} videoConstraints={videoConstraints} />
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {videoPreview}
        {/* {recordedChunks.length > 0 && (
          <button onClick={handleDownload}>Download</button>
        )} */}
      </>
  )
}
