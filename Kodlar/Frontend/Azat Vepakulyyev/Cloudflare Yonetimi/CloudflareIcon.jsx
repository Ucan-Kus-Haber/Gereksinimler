import React from 'react';

// Simple Cloudflare icon component for the sidebar
const CloudflareIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 16c0 1.1.9 2 2 2h4l-4-8h-2c-1.1 0-2 .9-2 2v4z"/>
            <path d="M2 12a6 6 0 0 1 6-6c3.43 0 6.24 2.67 6.5 6.03.37-.38.87-.62 1.42-.63H16l4 8H6a2 2 0 0 1-2-2V12z"/>
        </svg>
    );
};

export default CloudflareIcon;