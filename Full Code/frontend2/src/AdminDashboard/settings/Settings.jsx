import React from 'react';

const Settings = () => {
    return (
        <div className="page-container">
            <h1>Dashboard Settings</h1>
            <p>This is the Settings page for the news website admin dashboard.</p>
            <div className="placeholder-content">
                <p>Here you will be able to configure:</p>
                <ul>
                    <li>Website general settings</li>
                    <li>User permissions and roles</li>
                    <li>Content moderation settings</li>
                    <li>Notification preferences</li>
                    <li>API integrations</li>
                </ul>
            </div>
        </div>
    );
};

export default Settings;