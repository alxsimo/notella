import React from 'react';
import { useRecordingStore } from './store/recordingStore';
import { RecordingControls } from './components/RecordingControls';
import { RecordingsList } from './components/RecordingsList';

export const App: React.FC = () => {
  const { recordings, loadRecordings } = useRecordingStore();

  React.useEffect(() => {
    loadRecordings();
  }, [loadRecordings]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Notella</h1>
          <p className="text-sm text-gray-500">AI-powered meeting notes</p>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <RecordingControls />
          <div className="mt-8">
            <RecordingsList recordings={recordings} />
          </div>
        </div>
      </main>
    </div>
  );
};
