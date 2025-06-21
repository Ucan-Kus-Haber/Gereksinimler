// src/data/categories.js

// A helper function to create URL-friendly slugs from Turkish names
const slugify = (text) => {
    const a = 'üşıöçğÜŞİÖÇĞ·/_,:;'
    const b = 'usiocgUSIOCG------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

// Updated category data to match your database exactly
const categoryData = [
    {
        _id: "680255b18aa3b810760120da",
        name: "Gündem",
        description: "Güncel olaylar ve gelişmeler"
    },
    {
        _id: "680255d38aa3b810760120db",
        name: "Dünya",
        description: "Uluslararası haberler ve küresel gelişmeler"
    },
    {
        _id: "680255d88aa3b810760120dc",
        name: "Ekonomi",
        description: "Piyasalar, döviz, altın ve ekonomik analizler"
    },
    {
        _id: "680255dd8aa3b810760120dd",
        name: "Spor",
        description: "Futbol, basketbol ve tüm spor branşlarından gelişmeler"
    },
    {
        _id: "680255e18aa3b810760120de",
        name: "Teknoloji",
        description: "Yazılım, donanım, mobil cihazlar ve bilimsel gelişmeler"
    },
    {
        _id: "680255e68aa3b810760120df",
        name: "Magazin",
        description: "Ünlüler, dizi-film dünyası ve sosyal medya gündemi"
    },
    {
        _id: "680255ea8aa3b810760120e0",
        name: "Sağlık",
        description: "Hastalıklar, tedaviler, sağlıklı yaşam ipuçları"
    },
    {
        _id: "680255ed8aa3b810760120e1",
        name: "Eğitim",
        description: "Okullar, sınavlar ve eğitim sistemine dair haberler"
    },
    {
        _id: "680255f38aa3b810760120e2",
        name: "Kültür ve Sanat",
        description: "Tiyatro, sergi, kitap ve sanat etkinlikleri"
    },
    {
        _id: "680255f68aa3b810760120e3",
        name: "Hava Durumu",
        description: "Günlük ve haftalık hava tahminleri"
    }
];

// Add a slug to each category object for use in URLs
export const categories = categoryData.map(cat => ({
    ...cat,
    slug: slugify(cat.name)
}));

// Function to find a category by its slug
export const getCategoryBySlug = (slug) => {
    return categories.find(cat => cat.slug === slug);
};

// Function to find a category by its database ID
export const getCategoryById = (id) => {
    return categories.find(cat => cat._id === id);
};

// Function to get all category slugs (useful for routing)
export const getAllCategorySlugs = () => {
    return categories.map(cat => cat.slug);
};

// Function to get category name by slug
export const getCategoryNameBySlug = (slug) => {
    const category = getCategoryBySlug(slug);
    return category ? category.name : null;
};

// Export individual categories for easy access
export const CATEGORIES = {
    GUNDEM: categories.find(cat => cat.name === "Gündem"),
    DUNYA: categories.find(cat => cat.name === "Dünya"),
    EKONOMI: categories.find(cat => cat.name === "Ekonomi"),
    SPOR: categories.find(cat => cat.name === "Spor"),
    TEKNOLOJI: categories.find(cat => cat.name === "Teknoloji"),
    MAGAZIN: categories.find(cat => cat.name === "Magazin"),
    SAGLIK: categories.find(cat => cat.name === "Sağlık"),
    EGITIM: categories.find(cat => cat.name === "Eğitim"),
    KULTUR_SANAT: categories.find(cat => cat.name === "Kültür ve Sanat"),
    HAVA_DURUMU: categories.find(cat => cat.name === "Hava Durumu")
};