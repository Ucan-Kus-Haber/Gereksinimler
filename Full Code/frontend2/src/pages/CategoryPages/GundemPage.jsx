// pages/GundemPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const GundemPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.GUNDEM}
            pageTitle="Gündem Haberleri - Son Dakika Gelişmeleri"
            metaDescription="Türkiye'nin en güncel haberleri, son dakika gelişmeleri ve gündem konuları. En önemli olayları kaçırmayın."
        />
    );
};

export default GundemPage;