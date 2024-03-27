import React, { useEffect, useRef, useState } from 'react';

export default function UploadVid({Vid}) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Start the video stream
  const startVideo = async () => {
    try {
        const constraints = {
            video: {
              facingMode: "environment" // Request the back camera
            }
          };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
    } catch (err) {
      console.error('Error accessing the camera', err);
    }
  };

  // Stop the video stream
  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
      Vid(false); 
    }
  };

  useEffect(() => {
    if (isStreaming) {
      startVideo();
    }

    return () => {
      if (stream) {
        stopVideo();

      }
    };
  // Ensure the effect runs when isStreaming changes
  }, [isStreaming]);

  return (
    <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <video ref={videoRef} autoPlay playsInline class="w-full h-[90%] object-cover border-2 border-[red]"/>
      <button className='btn' onClick={() => setIsStreaming(!isStreaming)}>
        {isStreaming ? 'Stop Video' : 'Start Video'}
      </button>
    </div>
  );
}
