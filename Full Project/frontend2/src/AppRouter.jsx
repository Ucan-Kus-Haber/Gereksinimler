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
import Ads       from "./AdminDashboard/ads/Ads.jsx";
import Cloudflare from "./AdminDashboard/cloudflare/Cloudflare.jsx";
import ProfilePage from "./auth/profilPage/ProfilPage.jsx";
import Comment from "./pages/comment/Comment.jsx";
import CommentSection from "./pages/comment/CommentSection.jsx";
import Complaint from "./components/complaint/Complaint.jsx";

function AppRouter() {
    return (

<AuthProvider>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/rectangular" element={<RectangularNewsGrid />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/category/:categoryId/:subcategoryId" element={<Category />} />
            <Route path="/profilePage" element={<ProfilePage/>}/>
            <Route path="/comment" element={<Comment/>}/>
            <Route path="/commentSection" element={<CommentSection/>}/>
            <Route path="complaint" element={<Complaint/>}/>



            {/* Dashboard Routes inside DashboardLayout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Navigate to="news" replace />} />
                <Route path="news" element={<News />} />
                <Route path="articles" element={<Articles />} />
                <Route path="users" element={<Users />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="ads" element={<Ads/>}/>
                <Route path="*" element={<NotFound />} />
                <Route path="cloudflare" element={<Cloudflare/>}/>

            </Route>

            {/* Catch-All Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
</AuthProvider>
    );
}

export default AppRouter;
