import { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        articles: 0,
        pendingArticles: 0,
        publishedToday: 0,
        activeUsers: 0
    });

    const [recentArticles, setRecentArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setStats({
                articles: 2456,
                pendingArticles: 18,
                publishedToday: 12,
                activeUsers: 1847
            });

            setRecentArticles([
                { id: 1, title: "Breaking: Major Tech Company Announces New AI Features", author: "Jane Smith", date: "2025-04-10", status: "published" },
                { id: 2, title: "Global Climate Summit Reaches New Agreement", author: "John Doe", date: "2025-04-10", status: "published" },
                { id: 3, title: "Financial Markets Show Signs of Recovery", author: "Michael Brown", date: "2025-04-09", status: "published" },
                { id: 4, title: "Sports Team Wins Championship After 10-Year Drought", author: "Sarah Johnson", date: "2025-04-09", status: "published" },
                { id: 5, title: "New Research Reveals Health Benefits of Mediterranean Diet", author: "Robert Lee", date: "2025-04-08", status: "pending" }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="dashboard-page">
            <h1>Dashboard</h1>

            {loading ? (
                <div className="loading">Loading dashboard data...</div>
            ) : (
                <>
                    <div className="stats-container">
                        <div className="stat-card">
                            <h3>Total Articles</h3>
                            <p className="stat-value">{stats.articles}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Pending Review</h3>
                            <p className="stat-value">{stats.pendingArticles}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Published Today</h3>
                            <p className="stat-value">{stats.publishedToday}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Active Users</h3>
                            <p className="stat-value">{stats.activeUsers}</p>
                        </div>
                    </div>

                    <div className="dashboard-content">
                        <div className="recent-articles">
                            <div className="section-header">
                                <h2>Recent Articles</h2>
                                <button className="view-all-btn">View All</button>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recentArticles.map(article => (
                                        <tr key={article.id}>
                                            <td>{article.title}</td>
                                            <td>{article.author}</td>
                                            <td>{article.date}</td>
                                            <td>
                          <span className={`status-badge ${article.status}`}>
                            {article.status}
                          </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="edit-btn">Edit</button>
                                                    <button className="view-btn">View</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="action-cards">
                                <div className="action-card">
                                    <h3>Add New Article</h3>
                                    <p>Create and publish a new article to your news website.</p>
                                    <button className="action-btn">Create Article</button>
                                </div>
                                <div className="action-card">
                                    <h3>Moderate Comments</h3>
                                    <p>Review and approve pending user comments.</p>
                                    <button className="action-btn">View Comments</button>
                                </div>
                                <div className="action-card">
                                    <h3>Update Featured News</h3>
                                    <p>Change the featured articles on your homepage.</p>
                                    <button className="action-btn">Update Featured</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;