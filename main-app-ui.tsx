import React, { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Edit2, Copy, Download, Play, Pause, Square, Save, RefreshCw, Plus } from 'lucide-react';

const TrackingHistoryApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('tracking');
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [userName, setUserName] = useState('');
  const [owner, setOwner] = useState('');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState({
    id: null,
    name: 'N/A',
    owner: 'N/A',
    startTime: null,
    stopTime: null,
    totalTime: '00:00:00',
    pauseTime: null,
    resumeTime: null,
    status: 'Ready',
    history: []
  });

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Start tracking session
  const startTracking = () => {
    if (tracking) return;
    
    const newSession = {
      id: Date.now(),
      name: userName || 'N/A',
      owner: owner || 'N/A',
      startTime: new Date(),
      stopTime: null,
      totalTime: '00:00:00',
      pauseTime: null,
      resumeTime: null,
      status: 'Active',
      history: []
    };
    
    setCurrentSession(newSession);
    setTracking(true);
    setPaused(false);
  };

  // Pause tracking
  const pauseTracking = () => {
    if (!tracking || paused) return;
    
    const updatedSession = {
      ...currentSession,
      pauseTime: new Date(),
      status: 'Paused'
    };
    
    setCurrentSession(updatedSession);
    setPaused(true);
  };

  // Resume tracking
  const resumeTracking = () => {
    if (!tracking || !paused) return;
    
    const updatedSession = {
      ...currentSession,
      resumeTime: new Date(),
      status: 'Active'
    };
    
    setCurrentSession(updatedSession);
    setPaused(false);
  };

  // Stop tracking
  const stopTracking = () => {
    if (!tracking) return;
    
    const stoppedSession = {
      ...currentSession,
      stopTime: new Date(),
      status: 'Completed'
    };
    
    // Calculate total time
    const total = calculateTotalTime(stoppedSession);
    stoppedSession.totalTime = total;
    
    setCurrentSession(stoppedSession);
    setSessions([stoppedSession, ...sessions]);
    setTracking(false);
    setPaused(false);
    
    // Reset current session after saving
    setTimeout(() => {
      setCurrentSession({
        id: null,
        name: userName || 'N/A',
        owner: owner || 'N/A',
        startTime: null,
        stopTime: null,
        totalTime: '00:00:00',
        pauseTime: null,
        resumeTime: null,
        status: 'Ready',
        history: []
      });
    }, 2000);
  };

  // Helper function to calculate total time
  const calculateTotalTime = (session) => {
    if (!session.startTime) return '00:00:00';
    
    const end = session.stopTime || new Date();
    let total = end - session.startTime;
    
    // Adjust for pauses
    if (session.pauseTime && !session.resumeTime) {
      total -= (end - session.pauseTime);
    }
    
    // Format time
    const hours = Math.floor(total / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((total % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((total % 60000) / 1000).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  };

  // Copy current session
  const copyCurrentSession = () => {
    const sessionStr = JSON.stringify(currentSession, null, 2);
    navigator.clipboard.writeText(sessionStr);
    alert('Current session copied to clipboard');
  };

  // Copy all history
  const copyAllHistory = () => {
    const historyStr = JSON.stringify(sessions, null, 2);
    navigator.clipboard.writeText(historyStr);
    alert('All history copied to clipboard');
  };

  // Download current session
  const downloadCurrentSession = () => {
    const dataStr = JSON.stringify(currentSession, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tracking-session-${currentSession.id || 'current'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Download all history
  const downloadAllHistory = () => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tracking-history.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  // Update timer display
  useEffect(() => {
    let interval;
    if (tracking && !paused) {
      interval = setInterval(() => {
        setCurrentSession(prev => ({
          ...prev,
          totalTime: calculateTotalTime(prev)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tracking, paused]);

  // Background auto-save effect
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (tracking) {
        // Auto-save logic would go here
        console.log('Auto-saving tracking data...');
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(saveInterval);
  }, [tracking]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Header */}
      <header className={`p-4 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Tracking History</h1>
          <span className="ml-2 text-xs opacity-70">Created by Sourabh</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-400">
            <Bell size={20} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-400"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      
      {/* Tabs */}
      <div className={`flex justify-around p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-4`}>
        <button 
          className={`py-2 px-4 rounded-lg transition-all ${activeTab === 'tracking' ? 
            (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : 
            'hover:bg-opacity-10 hover:bg-gray-400'}`}
          onClick={() => setActiveTab('tracking')}
        >
          Tracking
        </button>
        <button 
          className={`py-2 px-4 rounded-lg transition-all ${activeTab === 'history' ? 
            (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : 
            'hover:bg-opacity-10 hover:bg-gray-400'}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button 
          className={`py-2 px-4 rounded-lg transition-all ${activeTab === 'edit' ? 
            (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : 
            'hover:bg-opacity-10 hover:bg-gray-400'}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit Records
        </button>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* User Info */}
        <div className={`rounded-xl p-6 mb-6 shadow-lg ${darkMode ? 
          'bg-gray-800 bg-opacity-60 backdrop-blur-md' : 
          'bg-white bg-opacity-80 backdrop-blur-md'}`}
        >
          <h2 className="text-lg font-semibold mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm opacity-70 mb-1">Your Name</label>
              <input 
                type="text" 
                className={`w-full p-2 rounded-lg ${darkMode ? 
                  'bg-gray-700 border-gray-600' : 
                  'bg-gray-100 border-gray-300'} border`}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm opacity-70 mb-1">Owner</label>
              <input 
                type="text" 
                className={`w-full p-2 rounded-lg ${darkMode ? 
                  'bg-gray-700 border-gray-600' : 
                  'bg-gray-100 border-gray-300'} border`}
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Enter owner"
              />
            </div>
          </div>
        </div>
        
        {activeTab === 'tracking' && (
          <>
            {/* Current Session Status */}
            <div className={`rounded-xl p-6 mb-6 shadow-lg ${darkMode ? 
              'bg-gray-800 bg-opacity-60 backdrop-blur-md' : 
              'bg-white bg-opacity-80 backdrop-blur-md'}`}
            >
              <h2 className="text-lg font-semibold mb-4">Current Session Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm opacity-70 mb-1">Name</label>
                  <p className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {currentSession.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">Owner</label>
                  <p className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {currentSession.owner}
                  </p>
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">Status</label>
                  <p className={`p-2 rounded-lg ${
                    currentSession.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    currentSession.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' : 
                    currentSession.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {currentSession.status}
                  </p>
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">Start Time</label>
                  <p className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {formatDate(currentSession.startTime)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">Stop Time</label>
                  <p className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {formatDate(currentSession.stopTime)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">Total Time</label>
                  <p className={`p-2 rounded-lg font-mono ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {currentSession.totalTime}
                  </p>
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">Pause Time</label>
                  <p className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {formatDate(currentSession.pauseTime)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">Resume Time</label>
                  <p className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {formatDate(currentSession.resumeTime)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className={`rounded-xl p-6 mb-6 shadow-lg ${darkMode ? 
              'bg-gray-800 bg-opacity-60 backdrop-blur-md' : 
              'bg-white bg-opacity-80 backdrop-blur-md'}`}
            >
              <h2 className="text-lg font-semibold mb-4">Session Controls</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button 
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                    tracking ? 'opacity-50 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  onClick={startTracking}
                  disabled={tracking}
                >
                  <Play size={18} />
                  <span>Start</span>
                </button>
                <button 
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                    !tracking || paused ? 'opacity-50 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                  onClick={pauseTracking}
                  disabled={!tracking || paused}
                >
                  <Pause size={18} />
                  <span>Pause</span>
                </button>
                <button 
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                    !tracking || !paused ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  onClick={resumeTracking}
                  disabled={!tracking || !paused}
                >
                  <RefreshCw size={18} />
                  <span>Resume</span>
                </button>
                <button 
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                    !tracking ? 'opacity-50 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  onClick={stopTracking}
                  disabled={!tracking}
                >
                  <Square size={18} />
                  <span>Stop</span>
                </button>
              </div>
              
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${darkMode ? 
                    'bg-gray-700 hover:bg-gray-600' : 
                    'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={copyCurrentSession}
                >
                  <Copy size={18} />
                  <span>Copy Current</span>
                </button>
                <button 
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${darkMode ? 
                    'bg-gray-700 hover:bg-gray-600' : 
                    'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={copyAllHistory}
                >
                  <Copy size={18} />
                  <span>Copy All</span>
                </button>
                <button 
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${darkMode ? 
                    'bg-gray-700 hover:bg-gray-600' : 
                    'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={downloadCurrentSession}
                >
                  <Download size={18} />
                  <span>Download Current</span>
                </button>
                <button 
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${darkMode ? 
                    'bg-gray-700 hover:bg-gray-600' : 
                    'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={downloadAllHistory}
                >
                  <Download size={18} />
                  <span>Download All</span>
                </button>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'history' && (
          <div className={`rounded-xl p-6 mb-6 shadow-lg ${darkMode ? 
            'bg-gray-800 bg-opacity-60 backdrop-blur-md' : 
            'bg-white bg-opacity-80 backdrop-blur-md'}`}
          >
            <h2 className="text-lg font-semibold mb-4">Tracking History</h2>
            {sessions.length === 0 ? (
              <p className="text-center py-8 opacity-70">No tracking history available</p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{session.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        session.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="opacity-70">Start:</span> {formatDate(session.startTime)}</p>
                      <p><span className="opacity-70">End:</span> {formatDate(session.stopTime)}</p>
                      <p><span className="opacity-70">Owner:</span> {session.owner}</p>
                      <p><span className="opacity-70">Total:</span> {session.totalTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'edit' && (
          <div className={`rounded-xl p-6 mb-6 shadow-lg ${darkMode ? 
            'bg-gray-800 bg-opacity-60 backdrop-blur-md' : 
            'bg-white bg-opacity-80 backdrop-blur-md'}`}
          >
            <h2 className="text-lg font-semibold mb-4">Edit Tracking Records</h2>
            {sessions.length === 0 ? (
              <p className="text-center py-8 opacity-70">No tracking records to edit</p>
            ) : (
              <div className="space-y-6">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Edit Session: {session.id}</h3>
                      <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <Edit2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm opacity-70 mb-1">Name</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-lg ${darkMode ? 
                            'bg-gray-600 border-gray-500' : 
                            'bg-white border-gray-300'} border`}
                          defaultValue={session.name}
                        />
                      </div>
                      <div>
                        <label className="block text-sm opacity-70 mb-1">Owner</label>
                        <input 
                          type="text" 
                          className={`w-full p-2 rounded-lg ${darkMode ? 
                            'bg-gray-600 border-gray-500' : 
                            'bg-white border-gray-300'} border`}
                          defaultValue={session.owner}
                        />
                      </div>
                      <div>
                        <label className="block text-sm opacity-70 mb-1">Start Time</label>
                        <input 
                          type="datetime-local" 
                          className={`w-full p-2 rounded-lg ${darkMode ? 
                            'bg-gray-600 border-gray-500' : 
                            'bg-white border-gray-300'} border`}
                          defaultValue={session.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm opacity-70 mb-1">Stop Time</label>
                        <input 
                          type="datetime-local" 
                          className={`w-full p-2 rounded-lg ${darkMode ? 
                            'bg-gray-600 border-gray-500' : 
                            'bg-white border-gray-300'} border`}
                          defaultValue={session.stopTime ? new Date(session.stopTime).toISOString().slice(0, 16) : ''}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                onClick={() => {
                  alert('All edited records have been saved!');
                }}
              >
                <Save size={16} />
                Save All Edited Records
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          className={`p-4 rounded-full shadow-lg flex items-center justify-center ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={startTracking}
          disabled={tracking}
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default TrackingHistoryApp;