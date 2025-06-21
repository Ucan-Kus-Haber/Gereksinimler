

// pages/KulturSanatPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const KulturSanatPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.KULTUR_SANAT}
            pageTitle="Kültür ve Sanat Haberleri - Etkinlikler ve Sergiler"
            metaDescription="Tiyatro, sergi, kitap, müze ve sanat etkinlikleri. Kültür ve sanat dünyasından gelişmeler."
        />
    );
};

export default KulturSanatPage;