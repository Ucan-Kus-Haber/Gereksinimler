// routes/CategoryRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all category pages
import GundemPage from '../../pages/CategoryPages/GundemPage';
import DunyaPage from '../../pages/CategoryPages/DunyaPage';
import EkonomiPage from '../../pages/CategoryPages/EkonomiPage';
import SporPage from '../../pages/CategoryPages/SporPage';
import TeknolojiPage from '../../pages/CategoryPages/TeknolojiPage';
import MagazinPage from '../../pages/CategoryPages/MagazinPage';
import SaglikPage from '../../pages/CategoryPages/SaglikPage';
import EgitimPage from '../../pages/CategoryPages/EgitimPage';
import KulturSanatPage from '../../pages/CategoryPages/KulturSanatPage';
import HavaDurumuPage from '../../pages/CategoryPages/HavaDurumuPage';

const CategoryRoutes = () => {
    return (
        <Routes>
            <Route path="/gundem" element={<GundemPage />} />
            <Route path="/dunya" element={<DunyaPage />} />
            <Route path="/ekonomi" element={<EkonomiPage />} />
            <Route path="/spor" element={<SporPage />} />
            <Route path="/teknoloji" element={<TeknolojiPage />} />
            <Route path="/magazin" element={<MagazinPage />} />
            <Route path="/saglik" element={<SaglikPage />} />
            <Route path="/egitim" element={<EgitimPage />} />
            <Route path="/kultur-sanat" element={<KulturSanatPage />} />
            <Route path="/hava-durumu" element={<HavaDurumuPage />} />
        </Routes>
    );
};

export default CategoryRoutes;