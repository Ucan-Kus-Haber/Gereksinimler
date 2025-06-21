// pages/MagazinPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const MagazinPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.MAGAZIN}
            pageTitle="Magazin Haberleri - Ünlüler ve Eğlence Dünyası"
            metaDescription="Ünlüler, dizi-film dünyası, sosyal medya gündemi ve eğlence haberleri. Magazin dünyasından gelişmeler."
        />
    );
};

export default MagazinPage;