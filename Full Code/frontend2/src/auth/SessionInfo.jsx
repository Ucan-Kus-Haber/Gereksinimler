import React from 'react';
import { useAuth } from './AuthContext';

const SessionInfo = () => {
    const { sessionData, refreshSession } = useAuth();

    if (!sessionData) {
        return null;
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div style={{
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            margin: '16px 0',
            backgroundColor: '#f9f9f9'
        }}>
            <h3>Session Information</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
                <div><strong>User:</strong> {sessionData.name} ({sessionData.email})</div>
                <div><strong>Login Time:</strong> {formatDate(sessionData.loginTime)}</div>
                <div><strong>Last Activity:</strong> {formatDate(sessionData.lastActivity)}</div>
                <div><strong>IP Address:</strong> {sessionData.ipAddress}</div>
                <div><strong>Device:</strong> {sessionData.deviceInfo}</div>
                <div><strong>Roles:</strong> {sessionData.roles?.join(', ')}</div>
            </div>
            <button
                onClick={refreshSession}
                style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Refresh Session
            </button>
        </div>
    );
};

export default SessionInfo;