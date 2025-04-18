// src/components/PricingSection.tsx

import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// === IMPORT YOUR AUTH CONTEXT ===
import { AuthContext } from "@/contexts/DataContext";// Adjust path as needed

// --- PricingCard Component (MODIFIED PROPS) ---
// Add 'onSelectPlan' prop
const PricingCard = ({ title, price, features, description, isPopular, isExpanded, onToggleDetails, onSelectPlan }) => {
    return (
        <div
            // Added dark:bg-gray-800 and borders for better theme alignment
            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-gray-700 p-6 text-center transition-all duration-300 ease-in-out w-full max-w-md mx-auto ${
                isExpanded ? 'ring-2 border-green-500 dark:border-green-500 shadow-xl scale-[1.02]' : 'hover:shadow-lg' // Use ring for expansion highlight
            } ${isPopular && !isExpanded ? 'border-2 border-green-500 dark:border-green-500' : ''}`} // Use amber for popular highlight
        >
            {/* Popular Banner - Use amber */}
            {isPopular && !isExpanded && ( // Only show banner if not expanded
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg z-10">
                    Most Popular
                </span>
            )}

            {/* Card Content */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {price}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{ /^\d/.test(price.toString()) ? '/mo' : ''}</span>
            </p>
            <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2 min-h-[50px]">
                {features.map((feature, index) => (
                    <li key={index} className="text-sm">{feature}</li>
                ))}
            </ul>

            {/* === EXPANDED DETAILS SECTION === */}
            {isExpanded && (
                 // Added animate-fadeIn - ensure you have this animation defined in your CSS/Tailwind config
                <div className="text-left text-sm text-gray-600 dark:text-gray-300 mb-6 border-t dark:border-gray-700 pt-4 mt-4 animate-fadeIn space-y-3">
                    {description}
                </div>
            )}
             {/* === END EXPANDED DETAILS === */}


            {/* Buttons Container */}
            <div className="flex flex-col space-y-3 mt-6">
                {/* "Afficher/Masquer" Button - Use amber/dark theme */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleDetails(); }}
                    className="w-full bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-100 px-6 py-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-200 text-sm font-medium"
                >
                    {isExpanded ? 'Masquer les détails' : 'Afficher les détails'}
                </button>
                {/* "Choisir ce plan" Button - MODIFIED onClick */}
                {isExpanded && (
                    <button
                        // Call the onSelectPlan prop passed down from PricingSection
                        onClick={(e) => { e.stopPropagation(); onSelectPlan({ title }); }} // Pass plan identifier
                        // Use primary theme colors (amber/dark)
                        className="w-full bg-amber-500 text-white dark:bg-amber-400 dark:text-gray-900 px-6 py-2 rounded-full hover:bg-amber-600 dark:hover:bg-amber-300 transition duration-200 text-sm font-medium"
                    >
                        Choisir ce plan
                    </button>
                )}
            </div>
        </div>
    );
};


// --- PricingSection Component (MODIFIED LOGIC) ---
const PricingSection = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // === ACCESS AUTH STATE AND NAVIGATION ===
    const { isAuthenticated } = useContext(AuthContext); // Use your custom hook or useContext directly
    const navigate = useNavigate();
    // =======================================

    // Define plans data (no changes needed here)
    const plans = [
         // ... (Keep your existing plans array) ...
         {
            title: 'Paiement par Royalties', // Matched title
            price: '% des ventes',
            features: ["Payez uniquement sur les ventes additionnelles générées."],
            isPopular: false,
            description: ( // Use JSX for formatting
                <>
                    <p>Vous préférez un modèle plus souple, sans coût d’entrée important ? Notre formule “paiement par royalties” est faite pour vous.</p>
                    <p className="mt-2">Avec cette offre vous bénéficiez de nos prédictions intelligentes en échange d’un pourcentage sur les ventes générées grâce à notre plateforme. Vous ne payez que si vous vendez.</p>
                    <p className="mt-2">Le pourcentage de royalties est déterminé selon :</p>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-xs pl-4">
                        <li>le volume estimé de vos ventes</li>
                        <li>la fréquence d’utilisation de nos services</li>
                        <li>la catégorie de produits que vous commercialisez</li>
                    </ul>
                     <p className="mt-2">le tout défini par nos experts financiers.</p>
                    <p className="mt-2">Ce modèle vous permet de profiter de la puissance de l’IA sans grever votre trésorerie, tout en maintenant un alignement d’intérêt entre vous et nous.</p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">Note : en cas d’absence de résultats significatifs au-delà d’une période d’essai d’une semaine, nous nous réservons le droit de réviser ou de suspendre l’accès à nos services et de vous réorienter vers notre seconde option.</p>
                    <p className="mt-3 font-semibold">agRoyalties grandit avec vous : plus vous réussissez, plus nous partageons ce succès.</p>
                    <p className="mt-3">Alors, prêts à optimiser vos ventes sans prise de risque ? Rejoignez-nous !</p>
                </>
            ),
        },
        {
            title: 'Paiement par Confiance',
            price: 'Prix Fixe Symbolique + %  de Vos actions',
            features: [ "Idéal pour startups."],
            isPopular: true,
            description: ( // Use JSX for formatting
                <>
                    <p>Vous êtes une petite entreprise qui ne dispose pas encore des moyens pour investir pleinement dans une solution d’IA ? agRoyalties est là pour vous.</p>
                    <p className="mt-2">Grâce à notre offre "paiement par confiance", vous pouvez accéder à nos services de prédiction avancée en échange :</p>
                     <ul className="list-disc list-inside mt-1 space-y-1 text-xs pl-4">
                        <li>d’un prix fixe symbolique</li>
                        <li>et d’un petit pourcentage de vos actions</li>
                     </ul>
                     <p className="mt-2">Le pourcentage ainsi que le montant fixe seront définis après une étude de votre entreprise et du cours de vos actions par des experts financiers.</p>
                     <p className="mt-2">C’est notre manière à nous de croire en votre potentiel, tout en vous aidant à grandir.</p>
                     <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">Important : pour garantir une collaboration saine, si aucune dynamique de vente significative n’est observée dans les premières semaines, le contrat pourra être réévalué ou résilié automatiquement.</p>
                    <p className="mt-3 font-semibold">Alors, qu’attendez-vous ? Rejoignez la famille agRoyalties et prenez une longueur d’avance sur votre marché !</p>
                </>
            ),
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 150);
        return () => clearTimeout(timer);
    }, []);

    const handleToggleDetails = (index: number) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    };

    // === HANDLE PLAN SELECTION ===
    const handleSelectPlan = (selectedPlan: { title: string }) => {
        console.log(`Attempting to select plan: ${selectedPlan.title}`);
        if (isAuthenticated) {
            console.log('User is authenticated. Proceeding to checkout...');
            // Navigate to your checkout page, passing plan info if needed
            // Example: pass plan title as query parameter
            navigate(`/checkout?plan=${encodeURIComponent(selectedPlan.title)}`);
        } else {
            console.log('User is not authenticated. Redirecting to login...');
            // Navigate to the login page
            // Optional: Pass the intended destination in state so you can redirect back after login
            const destination = `/checkout?plan=${encodeURIComponent(selectedPlan.title)}`;
            navigate('/login', { state: { from: destination } });
        }
    };
    // ============================

    const displayedPlans = expandedIndex !== null
        ? [plans[expandedIndex]]
        : plans;

    return (
         // Adjusted background gradient
        <section className="py-16 md:py-24 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 overflow-hidden">
            <div className="container mx-auto px-4">
                 {/* Adjusted text colors for theme */}
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Nos Formules Flexibles</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    Choisissez le plan qui correspond le mieux à votre modèle économique. Nous proposons des options transparentes conçues pour le partenariat.
                </p>

                <div className={`grid gap-8 transition-all duration-300 ease-in-out ${
                        expandedIndex !== null
                            ? 'md:grid-cols-1 place-items-center'
                            : 'md:grid-cols-2'
                    }`
                }>
                    {displayedPlans.map((plan, displayIndex) => {
                         const originalIndex = expandedIndex !== null ? expandedIndex : displayIndex;
                         const isCurrentlyExpanded = expandedIndex === originalIndex;
                         const delayMs = expandedIndex !== null ? 0 : displayIndex * 150;

                         return (
                             <div
                                key={originalIndex}
                                className={`
                                    transition-all duration-700 ease-out
                                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                `}
                                style={{ transitionDelay: `${delayMs}ms` }}
                             >
                                 <PricingCard
                                    title={plan.title}
                                    price={plan.price}
                                    features={plan.features}
                                    description={plan.description}
                                    isPopular={plan.isPopular}
                                    isExpanded={isCurrentlyExpanded}
                                    onToggleDetails={() => handleToggleDetails(originalIndex)}
                                    // === PASS THE HANDLER DOWN ===
                                    onSelectPlan={handleSelectPlan}
                                    // =============================
                                />
                             </div>
                         );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;