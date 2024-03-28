// import React, { useEffect, useRef, useState } from 'react';


// export default function UploadVid({close}) {
//   const videoRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [isStreaming, setIsStreaming] = useState(false);

//   // Start the video stream
//   const startVideo = async () => {
//     try {
//         const constraints = {
//             video: {
//               facingMode: "environment" // Request the back camera
//             }
//           };
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       setStream(stream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//       setIsStreaming(true);
//     } catch (err) {
//       console.error('Error accessing the camera', err);
//     }
//   };

//   // Stop the video stream
//   const stopVideo = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setIsStreaming(false);
//       console.log("Close")
//       close(); 
//     }
//   };

//   useEffect(() => {
//     if (isStreaming) {
//       startVideo();
//     }

//     return () => {
//       if (stream) {
//         stopVideo();

//       }
//     };
//   // Ensure the effect runs when isStreaming changes
//   }, [isStreaming]);

//   return (
//     <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
//       <video ref={videoRef} autoPlay playsInline class="w-full h-[90%] object-cover border-2 border-[red]"/>
//       <button className='btn' onClick={() => setIsStreaming(!isStreaming)}>
//         {isStreaming ? 'Stop Video' : 'Start Video'}
//       </button>
//     </div>
//   );
// }

// import { useRecordWebcam } from 'react-record-webcam'
// "use client"
// import React, { useEffect, useRef, useState } from 'react';
// import { useRecordWebcam, CAMERA_STATUS } from 'react-record-webcam';
// export default function UploadVid(){
//   const recordWebcam = useRecordWebcam();
//   const [isRecording, setIsRecording] = useState(false);
//   // const { createRecording, openCamera, startRecording, stopRecording, downloadRecording } = useRecordWebcam()

//   useEffect(() => {
//     if (recordWebcam.status === CAMERA_STATUS.OPEN) {
//       // Auto start recording (optional)
//       recordWebcam.start();
//       setIsRecording(true);
//     }
//   }, [recordWebcam.status]);

//   const handleStartRecording = () => {
//     recordWebcam.open();
//   };

//   const handleStopRecording = () => {
//     recordWebcam.stop();
//     setIsRecording(false);
//   };

//   const handleDownload = () => {
//     recordWebcam.download();
//   };
//   // const recordVideo = async () => {
//   //   const recording = await createRecording();
//   //   await openCamera(recording.id);
//   //   await startRecording(recording.id);
//   //   await new Promise(resolve => setTimeout(resolve, 3000)); // Record for 3 seconds
//   //   await stopRecording(recording.id);
//   //   await downloadRecording(recording.id); // Download the recording
//   // };

//   return (
//     <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
//       <video ref={recordWebcam.webcamRef} autoPlay muted />
//       <div>
//         {isRecording ? (
//           <button onClick={handleStopRecording}>Stop Recording</button>
//         ) : (
//           <button onClick={handleStartRecording}>Start Recording</button>
//         )}
//         <button onClick={handleDownload} disabled={isRecording}>Download</button>
//       </div>
//     </div>
//   )
// };
