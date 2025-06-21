

// Updated AppRouter.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import RectangularNewsGrid from "./components/grid/SmallRectangleGrid/RectangularNewsGrid.jsx";
import Category from "./components/Category/Category.jsx";
import NotFound from "./pages/404/404.jsx";
import Login from "./auth/authComponent/Login.jsx";
import SignUp from "./auth/authComponent/SignUp.jsx";
import Articles from "./AdminDashboard/article/Articles.jsx";
import News from "./AdminDashboard/news/News.jsx";
import DashboardLayout from "./AdminDashboard/layout/DashboardLayout.jsx";
import Users from "./AdminDashboard/users/Users.jsx";
import Analytics from "./AdminDashboard/analytics/Analytics.jsx";
import Settings from "./AdminDashboard/settings/Settings.jsx";
import {AuthProvider} from "./auth/AuthContext.jsx";
import Cloudflare from "./AdminDashboard/cloudflare/Cloudflare.jsx";
import ProfilePage from "./auth/profilPage/ProfilPage.jsx";
import Comment from "./pages/comment/Comment.jsx";
import CommentSection from "./pages/comment/CommentSection.jsx";
import Complaint from "./components/complaint/Complaint.jsx";

// Import all category pages
import GundemPage from './pages/CategoryPages/GundemPage';
import DunyaPage from './pages/CategoryPages/DunyaPage';
import EkonomiPage from './pages/CategoryPages/EkonomiPage';
import SporPage from './pages/CategoryPages/SporPage';
import TeknolojiPage from './pages/CategoryPages/TeknolojiPage';
import MagazinPage from './pages/CategoryPages/MagazinPage';
import SaglikPage from './pages/CategoryPages/SaglikPage';
import EgitimPage from './pages/CategoryPages/EgitimPage';
import KulturSanatPage from './pages/CategoryPages/KulturSanatPage';
import HavaDurumuPage from './pages/CategoryPages/HavaDurumuPage';
import NewsDetail from "./components/grid/NewsDetail.jsx";

function AppRouter() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/rectangular" element={<RectangularNewsGrid />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />

                {/* Individual Category Pages - SEO friendly URLs */}
                <Route path="/gundem" element={<GundemPage />} />
                <Route path="/dunya" element={<DunyaPage />} />
                <Route path="/ekonomi" element={<EkonomiPage />} />
                <Route path="/spor" element={<SporPage />} />
                <Route path="/teknoloji" element={<TeknolojiPage />} />
                <Route path="/magazin" element={<MagazinPage />} />
                <Route path="/saglik" element={<SaglikPage />} />
                <Route path="/egitim" element={<EgitimPage />} />
                <Route path="/kultur-ve-sanat" element={<KulturSanatPage />} />
                <Route path="/hava-durumu" element={<HavaDurumuPage />} />

                {/* Generic Category Routes - for backwards compatibility */}
                <Route path="/category/:categorySlug" element={<Category />} />
                <Route path="/category/:categorySlug/:subcategoryId" element={<Category />} />
                <Route path="/category/id/:categoryId" element={<Category />} />

                {/* Alternative routes for database IDs - redirect to friendly URLs */}
                <Route path="/category/680255b18aa3b810760120da" element={<Navigate to="/gundem" replace />} />
                <Route path="/category/680255d38aa3b810760120db" element={<Navigate to="/dunya" replace />} />
                <Route path="/category/680255d88aa3b810760120dc" element={<Navigate to="/ekonomi" replace />} />
                <Route path="/category/680255dd8aa3b810760120dd" element={<Navigate to="/spor" replace />} />
                <Route path="/category/680255e18aa3b810760120de" element={<Navigate to="/teknoloji" replace />} />
                <Route path="/category/680255e68aa3b810760120df" element={<Navigate to="/magazin" replace />} />
                <Route path="/category/680255ea8aa3b810760120e0" element={<Navigate to="/saglik" replace />} />
                <Route path="/category/680255ed8aa3b810760120e1" element={<Navigate to="/egitim" replace />} />
                <Route path="/category/680255f38aa3b810760120e2" element={<Navigate to="/kultur-ve-sanat" replace />} />
                <Route path="/category/680255f68aa3b810760120e3" element={<Navigate to="/hava-durumu" replace />} />

                {/* User Profile and Comment Routes */}
                <Route path="/profilePage" element={<ProfilePage/>}/>
                <Route path="/comment" element={<Comment/>}/>
                <Route path="/commentSection" element={<CommentSection/>}/>
                <Route path="/complaint" element={<Complaint/>}/>
                <Route path="/news/:slugOrId" element={<NewsDetail />} />

                {/* Dashboard Routes inside DashboardLayout */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="news" replace />} />
                    <Route path="news" element={<News />} />
                    <Route path="articles" element={<Articles />} />
                    <Route path="users" element={<Users />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="cloudflare" element={<Cloudflare/>}/>
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/* Catch-All Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default AppRouter;