import React from 'react';

const PricingCard = ({ title, price, features, isPopular }) => {
    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 text-center transform transition duration-300 hover:scale-105 relative ${isPopular ? 'border-2 border-green-500' : ''}`}>
            {isPopular && (
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Most Popular
                </span>
            )}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
            <p className="text-4xl font-bold text-gray-900 mb-4">
                ${price}<span className="text-lg font-normal">/mo</span>
            </p>
            <ul className="text-gray-600 mb-6 space-y-2">
                {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                Get Started
            </button>
        </div>
    );
};

const PricingSection = () => {
    const plans = [
        {
            title: 'Basic',
            price: 9,
            features: ['5 Projects', '10 GB Storage', 'Email Support', 'Basic Analytics'],
            isPopular: false,
        },
        {
            title: 'Pro',
            price: 29,
            features: ['Unlimited Projects', '100 GB Storage', 'Priority Support', 'Advanced Analytics'],
            isPopular: true,
        },
        {
            title: 'Enterprise',
            price: 99,
            features: ['Unlimited Projects', '1 TB Storage', '24/7 Support', 'Custom Analytics'],
            isPopular: false,
        },
    ];

    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Pricing Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={index}
                            title={plan.title}
                            price={plan.price}
                            features={plan.features}
                            isPopular={plan.isPopular}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;