// pages/SporPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const SporPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.SPOR}
            pageTitle="Spor Haberleri - Futbol, Basketbol ve Tüm Sporlar"
            metaDescription="Futbol, basketbol ve tüm spor branşlarından gelişmeler. Süper Lig, milli takım ve spor dünyasından haberler."
        />
    );
};

export default SporPage;