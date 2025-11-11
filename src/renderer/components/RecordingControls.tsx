import React, { useState } from 'react';
import { useRecordingStore } from '../store/recordingStore';

export const RecordingControls: React.FC = () => {
  const { isRecording, startRecording, stopRecording } = useRecordingStore();
  const [title, setTitle] = useState('');

  const handleStart = async (): Promise<void> => {
    if (!title.trim()) {
      alert('Please enter a title for the recording');
      return;
    }

    try {
      await startRecording(title);
      setTitle('');
    } catch (error) {
      alert(`Failed to start recording: ${error}`);
    }
  };

  const handleStop = async (): Promise<void> => {
    try {
      await stopRecording();
    } catch (error) {
      alert(`Failed to stop recording: ${error}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleStart}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Recording
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-gray-700 font-medium">Recording in progress...</span>
            </div>
            <button
              onClick={handleStop}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Stop Recording
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
