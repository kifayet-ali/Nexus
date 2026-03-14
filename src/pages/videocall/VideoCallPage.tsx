import React, { useState } from 'react';
import {
  FiVideo, FiVideoOff, FiMic, FiMicOff,
  FiPhoneOff, FiMonitor, FiPhone
} from 'react-icons/fi';

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

const VideoCallPage: React.FC = () => {
  const [callActive, setCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  const participants: Participant[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Entrepreneur',
      avatar: 'SJ',
      isMuted: false,
      isVideoOff: false,
    },
    {
      id: '2',
      name: 'Ali Khan',
      role: 'Investor',
      avatar: 'AK',
      isMuted: true,
      isVideoOff: false,
    },
  ];

  const upcomingCalls = [
    {
      id: '1',
      name: 'Ali Khan',
      role: 'Investor',
      time: 'Today, 3:00 PM',
      topic: 'Series A Discussion',
    },
    {
      id: '2',
      name: 'Sara Ahmed',
      role: 'Entrepreneur',
      time: 'Tomorrow, 11:00 AM',
      topic: 'Pitch Review',
    },
    {
      id: '3',
      name: 'Nexus Team',
      role: 'Team Meeting',
      time: 'Mar 20, 9:00 AM',
      topic: 'Deal Discussion',
    },
  ];

  // Start Call
  const handleStartCall = () => {
    setCallActive(true);
    setCallDuration(0);
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // End Call
  const handleEndCall = () => {
    setCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    if (timerInterval) clearInterval(timerInterval);
    setCallDuration(0);
  };

  // Format Duration
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📹 Video Calls</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Video Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Video Screen */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden relative"
            style={{ minHeight: '380px' }}>

            {callActive ? (
              <>
                {/* Remote Video (Main) */}
                <div className="w-full h-full flex items-center justify-center"
                  style={{ minHeight: '340px' }}>
                  {isVideoOff ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                        AK
                      </div>
                      <p className="text-white text-lg">Ali Khan</p>
                      <p className="text-gray-400 text-sm">Camera is off</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-24 h-24 rounded-full bg-secondary-600 flex items-center justify-center text-white text-3xl font-bold animate-pulse">
                        AK
                      </div>
                      <p className="text-white text-lg">Ali Khan</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-green-400 text-sm">Live</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Call Duration */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  🔴 {formatDuration(callDuration)}
                </div>

                {/* Screen Share Badge */}
                {isScreenSharing && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    📺 Screen Sharing
                  </div>
                )}

                {/* Self Video (Picture in Picture) */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-xl flex items-center justify-center border-2 border-gray-600">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                      SJ
                    </div>
                    <p className="text-white text-xs">You</p>
                  </div>
                </div>
              </>
            ) : (
              /* Idle State */
              <div className="flex flex-col items-center justify-center gap-4"
                style={{ minHeight: '340px' }}>
                <div className="w-20 h-20 rounded-full bg-primary-600 bg-opacity-20 flex items-center justify-center">
                  <FiVideo size={40} className="text-primary-400" />
                </div>
                <p className="text-gray-300 text-lg font-medium">Ready to Connect</p>
                <p className="text-gray-500 text-sm">Start a call with your contact</p>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-center gap-4 flex-wrap">

              {/* Mute Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                disabled={!callActive}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  !callActive ? 'opacity-40 cursor-not-allowed' :
                  isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isMuted ? <FiMicOff size={22} /> : <FiMic size={22} />}
                <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              {/* Video Button */}
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                disabled={!callActive}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  !callActive ? 'opacity-40 cursor-not-allowed' :
                  isVideoOff ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isVideoOff ? <FiVideoOff size={22} /> : <FiVideo size={22} />}
                <span className="text-xs">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
              </button>

              {/* Start / End Call Button */}
              {!callActive ? (
                <button
                  onClick={handleStartCall}
                  className="flex flex-col items-center gap-1 p-3 px-6 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all"
                >
                  <FiPhone size={22} />
                  <span className="text-xs">Start Call</span>
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="flex flex-col items-center gap-1 p-3 px-6 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  <FiPhoneOff size={22} />
                  <span className="text-xs">End Call</span>
                </button>
              )}

              {/* Screen Share Button */}
              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                disabled={!callActive}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  !callActive ? 'opacity-40 cursor-not-allowed' :
                  isScreenSharing ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiMonitor size={22} />
                <span className="text-xs">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
              </button>

            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">

          {/* Participants */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-700 mb-3">
              👥 Participants ({participants.length})
            </h2>
            {participants.map(p => (
              <div key={p.id} className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                  {p.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.role}</p>
                </div>
                <div className="flex gap-1">
                  {p.isMuted && <FiMicOff size={14} className="text-red-400" />}
                  {p.isVideoOff && <FiVideoOff size={14} className="text-red-400" />}
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Calls */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-700 mb-3">
              📅 Upcoming Calls
            </h2>
            {upcomingCalls.map(call => (
              <div key={call.id} className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                    {call.name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-gray-700">{call.name}</p>
                </div>
                <p className="text-xs text-gray-500">{call.topic}</p>
                <p className="text-xs text-primary-600 mt-1">🕐 {call.time}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;