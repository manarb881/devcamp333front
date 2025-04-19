import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, UserMe } from "@/contexts/DataContext"; // Assuming UserMe type is exported
import { Button } from "@/components/ui/button"; // Assuming Button component is used
import { toast, ToastContainer } from 'react-toastify'; // For better notifications
import 'react-toastify/dist/ReactToastify.css';

// --- Pricing Card Component (Assumed unchanged, ensure it's imported or defined) ---
interface PricingCardProps {
    title: string;
    price: string;
    features: string[];
    description: React.ReactNode;
    isPopular: boolean;
    isExpanded: boolean;
    onToggleDetails: () => void;
    onSelectPlan: (plan: { title: string }) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, description, isPopular, isExpanded, onToggleDetails, onSelectPlan }) => {
    return (
        <div
            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-gray-700 p-6 text-center transition-all duration-300 ease-in-out w-full max-w-md mx-auto ${
                isExpanded ? 'ring-2 ring-amber-500 dark:ring-amber-400 shadow-xl scale-[1.02]' : 'hover:shadow-lg' // Use amber for highlight
            } ${isPopular && !isExpanded ? 'border-2 border-amber-500 dark:border-amber-400' : ''}`} // Use amber for popular
        >
            {isPopular && !isExpanded && (
                <span className="absolute top-0 right-0 bg-amber-500 dark:bg-amber-400 text-white dark:text-gray-900 text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg z-10">
                    Most Popular
                </span>
            )}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {price}
                {/* Show /mo only if price starts with a number (or perhaps a currency symbol) */}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{/^[$\d]/.test(price.toString()) ? '/mo' : ''}</span>
            </p>
            {/* Ensure features list has minimum height even if empty */}
            <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2 min-h-[60px]">
                {features.map((feature, index) => (
                    <li key={index} className="text-sm">{feature}</li>
                ))}
            </ul>
            {isExpanded && (
                <div className="text-left text-sm text-gray-600 dark:text-gray-300 mb-6 border-t dark:border-gray-700 pt-4 mt-4 animate-fadeIn space-y-3">
                    {description}
                </div>
            )}
            <div className="flex flex-col space-y-3 mt-auto pt-4"> {/* Ensure buttons are at bottom */}
                <Button
                    variant="outline" // Use shadcn variant
                    onClick={(e) => { e.stopPropagation(); onToggleDetails(); }}
                    className="w-full text-sm" // Simplified classes
                >
                    {isExpanded ? 'Masquer les détails' : 'Afficher les détails'}
                </Button>
                {isExpanded && (
                    <Button
                        onClick={(e) => { e.stopPropagation(); onSelectPlan({ title }); }}
                        className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-gray-900 text-white text-sm" // Use theme colors
                    >
                        Choisir ce plan
                    </Button>
                )}
            </div>
        </div>
    );
};
// --- End Pricing Card Component ---

// --- Main Pricing Section ---
const PricingSection = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false); // For entry animation
    const [formVisible, setFormVisible] = useState(false); // Controls reliability form modal
    const [formData, setFormData] = useState({ // State for reliability form
        companyName: '',
        revenueGrowth: '',
        profitMargin: '',
        debtEquityRatio: '',
        stockVolatility: '',
        // Add post_sales_predicted_succes if it's needed by backend & model
        // postSalesPredictedSucces: '',
    });
    const [result, setResult] = useState<boolean | null>(null); // Stores API result (true/false)
    const [loading, setLoading] = useState(false); // Loading state for API call
    const [error, setError] = useState<string | null>(null); // Error state for API call

    // Use context safely
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    // Destructure only after checking context exists
    if (!authContext) {
        // Handle case where context is not available (e.g., component rendered outside provider)
        // This should ideally not happen if your app structure is correct.
        return <div>Error: AuthContext not found.</div>;
    }
    const { isAuthenticated, token, profile } = authContext;

    // Plan definitions
    const plans = [
        {
            title: 'Paiement par Royalties',
            price: '% des ventes',
            features: ["Payez uniquement sur les ventes additionnelles générées."],
            isPopular: false,
            description: ( /* ... Keep description JSX ... */ <></> )
        },
        {
            title: 'Paiement par Confiance',
            price: 'Prix Fixe Symbolique + % actions', // Shortened price
            features: ["Idéal pour startups.", "Validation requise."], // Added feature
            isPopular: true,
            description: ( /* ... Keep description JSX ... */ <></> )
        },
    ];

    // Entry animation effect
    useEffect(() => {
        const timer = setTimeout(() => { setIsVisible(true); }, 150);
        return () => clearTimeout(timer);
    }, []);

    // Handler to expand/collapse card details
    const handleToggleDetails = (index: number) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    };

    // Handler when "Choisir ce plan" is clicked
    const handleSelectPlan = (selectedPlan: { title: string }) => {
        console.log(`Attempting to select plan: ${selectedPlan.title}`);

        // --- CRITICAL CHECK 1: Authentication & Profile ---
        // Must check profile and profile.id here before deciding the action
        if (!isAuthenticated || !profile || !profile.id) {
            console.warn('User not authenticated or profile/ID missing. Redirecting to login...');
            toast.info("Veuillez vous connecter pour choisir un plan.");
            const destination = `/pricing?attemptedPlan=${encodeURIComponent(selectedPlan.title)}`; // Store attempted plan if needed
            navigate('/auth/login', { state: { from: destination } }); // Redirect to login
            return; // Stop execution
        }
        // ----------------------------------------------------

        console.log('User authenticated with Profile ID:', profile.id);

        // Check which plan was selected
        if (selectedPlan.title === 'Paiement par Confiance') {
            console.log("Opening Reliability Form for Paiement par Confiance.");
            setFormVisible(true); // Show the form modal
            setExpandedIndex(null); // Collapse card when form opens
        } else {
            // For other plans (e.g., Royalties), proceed to a generic checkout/contact page
            console.log('Proceeding to standard checkout/contact...');
            // Example: Navigate to a checkout page, passing plan info
            navigate(`/checkout?plan=${encodeURIComponent(selectedPlan.title)}`);
            // Or maybe a contact form: navigate('/contact?plan=...');
        }
    };

    // Handler for submitting the reliability form
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);   // Set loading state
        setError(null);     // Clear previous errors
        setResult(null);    // Clear previous results

        // --- CRITICAL CHECK 2: Authentication & Profile & Token ---
        // Re-check everything needed for the API call right before sending
        if (!isAuthenticated || !token || !profile || !profile.id) {
            setError('User authentication or profile data is missing. Please log in again.');
            console.error('Form Submission STOPPED: Missing auth/profile/id/token', { isAuthenticated, tokenExists: !!token, profileExists: !!profile, idExists: !!profile?.id });
            setLoading(false);
            toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
            // Optional: navigate('/login');
            return; // Stop submission
        }
        // ------------------------------------------------------------

        // Construct payload - ensure values are numbers
        const payload = {
            userId: profile.id, // Key is 'userId' (camelCase)
            companyName: formData.companyName, // Key is 'companyName' (camelCase)
            revenueGrowth: parseFloat(formData.revenueGrowth) || 0, // Key is 'revenueGrowth' (camelCase)
            profitMargin: parseFloat(formData.profitMargin) || 0,  // Key is 'profitMargin' (camelCase)
            debtEquityRatio: parseFloat(formData.debtEquityRatio) || 0, // Key is 'debtEquityRatio' (camelCase)
            stockVolatility: parseFloat(formData.stockVolatility) || 0, // Key is 'stockVolatility' (camelCase)
        };

        console.log('Submitting Reliability Payload:', payload);
        console.log('With Token:', token); // Verify token exists just before fetch

        // ** IMPORTANT: Verify this API Endpoint URL **
        const apiUrl = 'http://localhost:8000/api/reliability/evaluate/';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`, // Send the token
                },
                body: JSON.stringify(payload),
            });

            // Get response body regardless of status for better error info
            const responseBody = await response.text(); // Read as text first

            if (!response.ok) {
                 // Try parsing as JSON if possible, otherwise use text
                 let errorDetails = responseBody;
                 try {
                     const errorJson = JSON.parse(responseBody);
                     // Format JSON error nicely if available
                     errorDetails = Object.entries(errorJson)
                         .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                         .join('; ');
                 } catch (parseError) {
                     // Keep responseBody as is if not valid JSON
                 }
                console.error(`API Error ${response.status}: ${errorDetails}`);
                throw new Error(`Échec de l'évaluation (${response.status}): ${errorDetails || response.statusText}`);
            }

            // If response is OK, try parsing JSON
            let data;
            try {
                 data = JSON.parse(responseBody);
                 console.log('API Success Response:', data);
                 setResult(data.isTrustworthy); // Set result state (true or false)
            } catch (parseError) {
                 console.error("Failed to parse successful response JSON:", responseBody);
                 throw new Error("Réponse invalide reçue du serveur après succès.");
            }


        } catch (err) {
            console.error('Form Submission Fetch/Process Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
            setError(errorMessage); // Set error state to display in UI
            toast.error(`Erreur de soumission: ${errorMessage}`);
        } finally {
            setLoading(false); // Ensure loading state is turned off
        }
    };

    // Handler for form input changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Resets form, results, errors and hides modals
    const resetFormAndModals = () => {
        setFormVisible(false); // Hide form modal
        setResult(null);      // Hide result modal
        setError(null);       // Hide error modal
        setFormData({         // Reset form fields
            companyName: '',
            revenueGrowth: '',
            profitMargin: '',
            debtEquityRatio: '',
            stockVolatility: '',
            // postSalesPredictedSucces: '',
        });
    };

    // Determine which plans to show based on expansion state
    const displayedPlans = expandedIndex !== null ? [plans[expandedIndex]] : plans;

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 overflow-hidden">
             {/* Toast Container - place once in your main layout ideally */}
            <ToastContainer theme="colored" position="bottom-right" autoClose={5000} />

            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Nos Formules Flexibles</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    Choisissez le plan qui correspond le mieux à votre modèle économique. Nous proposons des options transparentes conçues pour le partenariat.
                </p>

                {/* Grid for Pricing Cards */}
                <div className={`grid gap-8 transition-all duration-300 ease-in-out ${
                    expandedIndex !== null ? 'md:grid-cols-1 place-items-center' : 'md:grid-cols-2'
                }`}>
                    {displayedPlans.map((plan, displayIndex) => {
                        // Determine the original index whether expanded or not
                        const originalIndex = expandedIndex !== null ? expandedIndex : displayIndex;
                        const isCurrentlyExpanded = expandedIndex === originalIndex;
                        const delayMs = expandedIndex !== null ? 0 : displayIndex * 150; // Stagger animation only in grid view

                        return (
                            <div
                                key={originalIndex}
                                // Entry animation with delay
                                className={`transition-all duration-700 ease-out ${
                                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
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
                                    onSelectPlan={handleSelectPlan} // Pass the handler
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Form Overlay/Modal for Paiement par Confiance */}
                {formVisible && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        {/* Form Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                                Demande pour Paiement par Confiance
                            </h3>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                {/* Company Name */}
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'entreprise</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                                {/* Revenue Growth */}
                                <div>
                                    <label htmlFor="revenueGrowth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Croissance Revenus (%)</label>
                                    <input
                                        type="number"
                                        step="0.1" // Allows decimals
                                        id="revenueGrowth"
                                        name="revenueGrowth"
                                        value={formData.revenueGrowth}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Ex: 5.0 pour 5%"
                                    />
                                </div>
                                 {/* Profit Margin */}
                                <div>
                                    <label htmlFor="profitMargin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marge Bénéficiaire (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        id="profitMargin"
                                        name="profitMargin"
                                        value={formData.profitMargin}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-amber-500 focus:border-green-400"
                                        placeholder="Ex: 10.0 pour 10%"
                                    />
                                </div>
                                {/* Debt-to-Equity Ratio */}
                                <div>
                                    <label htmlFor="debtEquityRatio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ratio Dette/Capitaux Propres</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id="debtEquityRatio"
                                        name="debtEquityRatio"
                                        value={formData.debtEquityRatio}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-green-4000 focus:border-green-400"
                                        placeholder="Ex: 1.5"
                                    />
                                </div>
                                 {/* Stock Volatility */}
                                <div>
                                    <label htmlFor="stockVolatility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volatilité Action (si applicable)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id="stockVolatility"
                                        name="stockVolatility"
                                        value={formData.stockVolatility}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Ex: 0.2 pour 20%"
                                    />
                                </div>
                                {/* Add postSalesPredictedSucces input if needed */}

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-gray-900 text-white"
                                    >
                                        {loading ? 'Soumission...' : 'Soumettre'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline" // Use outline variant
                                        onClick={resetFormAndModals}
                                        className="w-full"
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Result Message Overlay/Modal */}
                {result !== null && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[51] p-4 animate-fadeIn"> {/* Ensure higher z-index */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl text-center">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                {result ? 'Bienvenue !' : 'Statut de la demande'}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                {result
                                    ? 'Votre souscription est confirmée, bienvenue parmi nous !'
                                    : 'Désolé, vous n’êtes pas éligible pour cette formule.'}
                            </p>
                            <Button
                                onClick={resetFormAndModals} // Close modal
                                className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-gray-900 text-white px-6"
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                )}

                {/* Error Message Overlay/Modal */}
                {error && (
                     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[51] p-4 animate-fadeIn"> {/* Ensure higher z-index */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl text-center">
                            <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Erreur</h3>
                            {/* Display potentially long errors in a scrollable area */}
                            <div className="max-h-40 overflow-y-auto mb-6 text-left bg-red-50 dark:bg-gray-700 p-3 rounded border border-red-200 dark:border-red-600">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                            <Button
                                onClick={resetFormAndModals} // Close modal
                                variant="outline" // Use outline variant
                                className="px-6"
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PricingSection;