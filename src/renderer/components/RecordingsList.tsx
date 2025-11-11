import React from 'react';

interface Recording {
  id: { value: string };
  title: string;
  startedAt: string;
  endedAt?: string;
  duration: number;
  status: string;
}

interface RecordingsListProps {
  recordings: Recording[];
}

export const RecordingsList: React.FC<RecordingsListProps> = ({ recordings }) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (recordings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No recordings yet. Start your first recording above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recordings</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {recordings.map((recording) => (
          <li key={recording.id.value} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{recording.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(recording.startedAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {formatDuration(recording.duration)}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    recording.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : recording.status === 'recording'
                      ? 'bg-blue-100 text-blue-800'
                      : recording.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {recording.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
