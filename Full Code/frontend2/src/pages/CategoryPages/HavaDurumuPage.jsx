


// pages/HavaDurumuPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const HavaDurumuPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.HAVA_DURUMU}
            pageTitle="Hava Durumu - Günlük ve Haftalık Tahminler"
            metaDescription="Günlük ve haftalık hava tahminleri, meteoroloji uyarıları ve iklim haberleri. Hava durumu takibi."
        />
    );
};

export default HavaDurumuPage;