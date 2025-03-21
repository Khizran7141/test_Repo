import React, { useState, useEffect } from 'react';
import { callPingAPI } from './api/api.js';
import './App.css';

function App() {
  const [log, setLog] = useState([]);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(null);

  useEffect(() => {
    let timer;
    if (blockTimeRemaining > 0) {
      timer = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [blockTimeRemaining]);

  const handleApiCall = async () => {
    const { success, data, status, headers } = await callPingAPI();

    const remainingRequests = headers['x-ratelimit-remaining'] || data.remainingRequests || 0;

    setLog((prevLog) => [
      {
        status,
        message: data.message,
        remaining: remainingRequests
      },
      ...prevLog,
    ]);

    if (!success && status === 429 && data.blockTimeRemaining) {
      setBlockTimeRemaining(data.blockTimeRemaining);
    }
  };

  return (
    <div className="App">
      <h1>Rate Limit API Tester</h1>

      <button
        onClick={handleApiCall}
        disabled={blockTimeRemaining !== null && blockTimeRemaining > 0}
        className={blockTimeRemaining ? 'disabled' : ''}
      >
        Call API
      </button>

      {blockTimeRemaining !== null && blockTimeRemaining > 0 && (
        <div className="block-timer">
          <p>You are blocked. Try again in <strong>{blockTimeRemaining}</strong> seconds.</p>
        </div>
      )}

      <div className="log-section">
        <h2>Response Log</h2>
        {log.length === 0 && <p>No responses yet.</p>}

        {log.map((entry, index) => (
          <div key={index} className="log-entry">
            <p><strong>Status:</strong> {entry.status}</p>
            <p><strong>Message:</strong> {entry.message}</p>
            <p><strong>Remaining Requests:</strong> {entry.remaining}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
