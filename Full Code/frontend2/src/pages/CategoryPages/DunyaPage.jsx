// pages/DunyaPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const DunyaPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.DUNYA}
            pageTitle="Dünya Haberleri - Uluslararası Gelişmeler"
            metaDescription="Uluslararası haberler, küresel gelişmeler ve dünya gündeminden son dakika haberleri. Dünyada olup bitenler."
        />
    );
};

export default DunyaPage;