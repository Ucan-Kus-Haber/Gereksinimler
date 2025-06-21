
// pages/SaglikPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const SaglikPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.SAGLIK}
            pageTitle="Sağlık Haberleri - Sağlıklı Yaşam İpuçları"
            metaDescription="Hastalıklar, tedaviler, sağlıklı yaşam ipuçları ve tıp dünyasından gelişmeler. Sağlık haberleri."
        />
    );
};

export default SaglikPage;