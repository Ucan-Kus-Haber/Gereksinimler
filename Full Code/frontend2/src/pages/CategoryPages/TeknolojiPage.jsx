// pages/TeknolojiPage.jsx
import React from 'react';
import CategoryPageTemplate from '../../components/CategoryPageTemplate';
import { CATEGORIES } from '../../data/categories';

const TeknolojiPage = () => {
    return (
        <CategoryPageTemplate
            category={CATEGORIES.TEKNOLOJI}
            pageTitle="Teknoloji Haberleri - Yazılım, Donanım ve Bilim"
            metaDescription="Yazılım, donanım, mobil cihazlar, yapay zeka ve bilimsel gelişmeler. Teknoloji dünyasından son haberler."
        />
    );
};

export default TeknolojiPage;