// pages/EgitimPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const EgitimPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.EGITIM}
            pageTitle="Eğitim Haberleri - Okullar ve Sınavlar"
            metaDescription="Okullar, sınavlar, eğitim sistemine dair haberler, üniversite ve öğrenci haberleri. Eğitim dünyası."
        />
    );
};

export default EgitimPage;
