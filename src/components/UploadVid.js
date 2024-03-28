import { useRecordWebcam } from 'react-record-webcam'

export default App = () => {
  const { createRecording, openCamera, startRecording, stopRecording, downloadRecording } = useRecordWebcam()

  const recordVideo = async () => {
    const recording = await createRecording();
    await openCamera(recording.id);
    await startRecording(recording.id);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Record for 3 seconds
    await stopRecording(recording.id);
    await downloadRecording(recording.id); // Download the recording
  };

  return <button onClick={recordVideo}>Record Video</button>;
};