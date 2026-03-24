import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Meeting {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'pending' | 'accepted' | 'declined';
  color?: string;
}

const CalendarPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Investor Meeting - Ali Khan',
      start: '2026-03-15T10:00:00',
      end: '2026-03-15T11:00:00',
      status: 'accepted',
      color: '#22C55E',
    },
    {
      id: '2',
      title: 'Pitch Review - Sara Ahmed',
      start: '2026-03-17T14:00:00',
      end: '2026-03-17T15:00:00',
      status: 'pending',
      color: '#F59E0B',
    },
    {
      id: '3',
      title: 'Deal Discussion - Nexus Team',
      start: '2026-03-20T09:00:00',
      end: '2026-03-20T10:00:00',
      status: 'pending',
      color: '#F59E0B',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    start: '',
    end: '',
  });

  // Jab calendar pe date click ho
  const handleDateClick = (arg: any) => {
    setNewMeeting({ title: '', start: arg.dateStr + 'T09:00', end: arg.dateStr + 'T10:00' });
    setShowModal(true);
  };

  // Naya meeting add karo
  const handleAddMeeting = () => {
    if (!newMeeting.title) return;
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      start: newMeeting.start,
      end: newMeeting.end,
      status: 'pending',
      color: '#F59E0B',
    };
    setMeetings([...meetings, meeting]);
    setShowModal(false);
  };

  // Accept/Decline meeting
  const handleStatus = (id: string, status: 'accepted' | 'declined') => {
    setMeetings(meetings.map(m =>
      m.id === id
        ? { ...m, status, color: status === 'accepted' ? '#22C55E' : '#EF4444' }
        : m
    ));
  };

  const pendingMeetings = meetings.filter(m => m.status === 'pending');
  const confirmedMeetings = meetings.filter(m => m.status === 'accepted');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📅 Meeting Scheduler</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={meetings}
            dateClick={handleDateClick}
            editable={true}
            selectable={true}
            height="auto"
          />
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">

          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-700 mb-3">
              ⏳ Pending Requests ({pendingMeetings.length})
            </h2>
            {pendingMeetings.length === 0 && (
              <p className="text-sm text-gray-400">No pending requests</p>
            )}
            {pendingMeetings.map(m => (
              <div key={m.id} className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-gray-700">{m.title}</p>
                <p className="text-xs text-gray-400 mb-2">{m.start}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatus(m.id, 'accepted')}
                    className="flex-1 bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600"
                  >
                    ✅ Accept
                  </button>
                  <button
                    onClick={() => handleStatus(m.id, 'declined')}
                    className="flex-1 bg-red-500 text-white text-xs py-1 rounded hover:bg-red-600"
                  >
                    ❌ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Confirmed Meetings */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-700 mb-3">
              ✅ Confirmed Meetings ({confirmedMeetings.length})
            </h2>
            {confirmedMeetings.length === 0 && (
              <p className="text-sm text-gray-400">No confirmed meetings</p>
            )}
            {confirmedMeetings.map(m => (
              <div key={m.id} className="mb-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-gray-700">{m.title}</p>
                <p className="text-xs text-gray-400">{m.start}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Add Meeting Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-lg font-bold mb-4">➕ New Meeting Request</h2>

            <input
              type="text"
              placeholder="Meeting Title"
              value={newMeeting.title}
              onChange={e => setNewMeeting({ ...newMeeting, title: e.target.value })}
              className="w-full border rounded-lg p-2 mb-3 text-sm"
            />

            <label className="text-xs text-gray-500">Start Time</label>
            <input
              type="datetime-local"
              value={newMeeting.start}
              onChange={e => setNewMeeting({ ...newMeeting, start: e.target.value })}
              className="w-full border rounded-lg p-2 mb-3 text-sm"
            />

            <label className="text-xs text-gray-500">End Time</label>
            <input
              type="datetime-local"
              value={newMeeting.end}
              onChange={e => setNewMeeting({ ...newMeeting, end: e.target.value })}
              className="w-full border rounded-lg p-2 mb-4 text-sm"
            />

            <div className="flex gap-3">
              <button
                onClick={handleAddMeeting}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;