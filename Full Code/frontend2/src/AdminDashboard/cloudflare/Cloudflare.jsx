import React, { useState } from 'react';
import './Cloudflare.css';

// Mock data that would be stored in data folder
const mockData = {
    codeSnippets: [
        {
            id: 1,
            language: "React",
            title: "Mongo db, JWT  and all other configurations on application.properties on backend ",
            code: `spring.application.name=backend


spring.docker.compose.enabled=false
spring.data.mongodb.uri=mongodb: # Mongo db Atlas url
spring.data.mongodb.database=MyNews

cloudflare.r2.endpoint=https://54eb6ae1a1a84e1cd954ea58de90762d.r2.cloudflarestorage.com/my-data
cloudflare.r2.bucket=my-data
cloudflare.r2.accessKey=6c854d195b7ba08865c3f93f03e1b702
cloudflare.r2.secretKey=eda2fad8ef000be7fed7c14be2021e74d9147488b846dffc4adfbf38b29a7907


# Multipart File Upload Configuration
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB


# CORS Configuration (adjust for your frontend URL)
spring.web.cors.allowed-origins= http://localhost:5173,http://localhost:5174
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE
spring.web.cors.allowed-headers=*

#JWT configuration
jwt.secret=yourVeryLongAndSecureSecretKeyHereAtLeast32Characters
jwt.expiration=86400000`
        },
        {
            id: 2,
            language: "Java",
            title: "Cloudflare configuration component on java ",
            code: `package sdu.backend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
public class AwsConfig {

    @Bean
    @Primary
    public S3Client s3Client() {
        return S3Client.builder()
                .endpointOverride(URI.create("<<Account id >>"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create("<< Acces key >>", "<< Default acces key >>")))
                .region(Region.of("auto"))
                .build();
    }
}`
        }
    ],
    images :[
        {
            id: 1,
            title: "Cloudflare Workers",
            description: "Edge functions executed using Cloudflare Workers",
            src: "/cloudflare-workers.png"
        },
        {
            id: 2,
            title: "Page Deployment",
            description: "Deployment interface for Cloudflare Pages",
            src: "/deployment-to-Cloudlfare.png"
        },
        {
            id: 3,
            title: "R2 Database",
            description: "Object storage using Cloudflare's R2 service",
            src: "/cloudflare-bucket.png"
        },
        {
            id: 4,
            title: "MongoDB Atlas",
            description: "Cloud-hosted NoSQL database solution",
            src: "/Atlas.png"
        }
    ]
};

// Image Modal Component
const ImageModal = ({ image, onClose }) => {
    if (!image) return null;

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content">
                <button className="modal-close-button" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <img
                    src={image.src}
                    alt={image.title}
                    className="modal-image"
                />
                <div className="modal-caption">
                    <h3>{image.title}</h3>
                    <p>{image.description}</p>
                </div>
            </div>
        </div>
    );
};

const Cloudflare = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const openImageModal = (image) => {
        setSelectedImage(image);
        // Prevent scrolling on the body when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        // Restore scrolling when modal is closed
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="admin-container">
            <div className="admin-content">
                <header className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage your application</p>
                </header>

                {/* Code Snippets Box */}
                <div className="code-repository-box">
                    <div className="box-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 18 22 12 16 6"></path>
                            <path d="M8 6 2 12 8 18"></path>
                        </svg>
                        <h2>Code Repository</h2>
                    </div>

                    <div className="snippets-container">
                        {mockData.codeSnippets.map((snippet) => (
                            <div key={snippet.id} className="code-snippet">
                                <div className="snippet-header">
                                    <h3>{snippet.title}</h3>
                                    <span className="language-tag">
                                        {snippet.language}
                                    </span>
                                </div>
                                <pre className="code-block">
                                    {snippet.code}
                                </pre>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images Box */}
                <div className="resources-box">
                    <h2>Project Resources</h2>

                    <div className="resources-grid">
                        {mockData.images.map((image) => (
                            <div key={image.id} className="resource-card">
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    className="resource-image"
                                    onClick={() => openImageModal(image)}
                                />
                                <div className="resource-info">
                                    <h3>{image.title}</h3>
                                    <p>{image.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal image={selectedImage} onClose={closeImageModal} />
        </div>
    );
};

export default Cloudflare;