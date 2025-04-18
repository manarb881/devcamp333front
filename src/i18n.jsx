// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: { // "translation" is the default namespace
      // Navbar
      navHome: "Home",
      navPricing: "Pricing",
      navSettings: "Settings",
      navDashboard: "Dashboard",
      // Hero Section
      heroSubtitle: "Pure & Predictable",
      heroTitlePart1: "Quality Dairy,",
      heroTitlePart2: "Predicted", // The highlighted word
      heroTitlePart3: "Perfectly",
      heroDescription: "Leverage AI insights to optimize your dairy stock levels, ensuring freshness and reducing waste with unparalleled accuracy.",
      heroCta: "Explore Predictions",
      // Pricing Section
      pricingTitle: "Our Flexible Plans",
      pricingDescription: "Choose the plan that best suits your business model. We offer transparent options designed for partnership.",
      pricingCardDetailsShow: "Show Details",
      pricingCardDetailsHide: "Hide Details",
      pricingCardSelectPlan: "Choose this Plan",
      // Add keys for your Royalties/Confidence plan details here...
      // Settings Page
      settingsTitle: "Settings",
      settingsLanguageLabel: "Language",
      settingsThemeLabel: "Theme",
      settingsThemeLight: "Light",
      settingsThemeDark: "Dark",
      // Add other keys as needed...
    }
  },
  fr: {
    translation: {
      // Navbar
      navHome: "Accueil",
      navPricing: "Tarifs",
      navSettings: "Paramètres",
      navDashboard: "Tableau de bord",
      // Hero Section
      heroSubtitle: "Pur & Prévisible",
      heroTitlePart1: "Produits Laitiers de Qualité,",
      heroTitlePart2: "Prédits", // The highlighted word
      heroTitlePart3: "Parfaitement",
      heroDescription: "Tirez parti de l'IA pour optimiser vos stocks laitiers, garantir la fraîcheur et réduire le gaspillage avec une précision inégalée.",
      heroCta: "Explorer les Prédictions",
      // Pricing Section
      pricingTitle: "Nos Formules Flexibles",
      pricingDescription: "Choisissez le plan qui correspond le mieux à votre modèle économique. Nous proposons des options transparentes conçues pour le partenariat.",
      pricingCardDetailsShow: "Afficher les détails",
      pricingCardDetailsHide: "Masquer les détails",
      pricingCardSelectPlan: "Choisir ce plan",
       // Add keys for your Royalties/Confidence plan details here...
       // Settings Page
      settingsTitle: "Paramètres",
      settingsLanguageLabel: "Langue",
      settingsThemeLabel: "Thème",
      settingsThemeLight: "Clair",
      settingsThemeDark: "Sombre",
      // Add other keys as needed...
    }
  }
};

i18n
  // Detect user language
  // Learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  // Learn more: https://www.i18next.com/overview/configuration-options
  .init({
    debug: import.meta.env.DEV, // Only log in development
    fallbackLng: "en", // Use English if detected language is not available
    //lng: "en", // You can force a language, but detector is usually better
    interpolation: {
      escapeValue: false // React already safes from xss
    },
    resources: resources, // Load translations
    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language selection in localStorage
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng', // Key to use in localStorage
    }
  });

export default i18n;