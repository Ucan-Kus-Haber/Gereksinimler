
// pages/EkonomiPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const EkonomiPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.EKONOMI}
            pageTitle="Ekonomi Haberleri - Piyasalar ve Finansal Gelişmeler"
            metaDescription="Piyasalar, döviz kurları, altın fiyatları, borsa haberleri ve ekonomik analizler. Ekonomiden son gelişmeler."
        />
    );
};

export default EkonomiPage;