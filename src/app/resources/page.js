'use client'

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMapMarkerAlt, faArrowLeft, faShieldAlt, faClinicMedical, 
    faLightbulb, faExclamationTriangle, faAmbulance, faHome, 
    faTimes, faCheckCircle, faClock, faPaw, faSearch 
} from '@fortawesome/free-solid-svg-icons';


// This component assumes you have Tailwind CSS and Font Awesome configured in your project.
// This is a REFINED version with styling that more closely matches the original CSS.

// --- PetClinics Sub-Component and Data ---

const clinicsData = [
    { name: "Indira Pet Clinic 24/7", location: "Bangalore", availability: "24/7", website: "https://www.indirapetclinic.com", services: "Emergency care, Surgery, Diagnostics" },
    { name: "Pets First Hospital", location: "Jayanagar", availability: "24/7", website: "https://petsfirst.health", services: "General care, Surgery, Wellness" },
    { name: "Sanchu Animal Hospital", location: "Koramangala", availability: "24/7", website: "https://veterinary-hospital.sanchuanimalhospital.com", services: "Emergency care, ICU, Surgery" },
    { name: "Jeeva Pet Hospital", location: "Bangalore", availability: "Regular hours", website: "http://www.jeevapethospital.in", services: "General care, Diagnostics" },
    { name: "Dr. Doodley Pet Hospital", location: "Jayanagar", availability: "24/7", website: "https://www.doodley.in", services: "Emergency care, Surgery, Grooming" },
    { name: "Healthy Pawz Pets Veterinary Hospital", location: "Bangalore", availability: "24/7", website: "https://thebowmeow.com", services: "Emergency care, Wellness, Surgery" },
    { name: "Crown Vet", location: "Koramangala", availability: "Regular hours", website: "https://crown.vet/clinic-koramangala-vet-clinic.html", services: "General care, Diagnostics" },
    { name: "Cessna Lifeline Veterinary Hospital", location: "Domlur", availability: "Regular hours", website: "https://www.cessnalifeline.com", services: "General care, Surgery, Emergency" },
    { name: "Vetic Animal Hospital", location: "Multiple locations", availability: "24/7", website: "https://vetic.in/animal-hospital-bengaluru", services: "Emergency care, Surgery, Diagnostics" },
];

const ClinicModal = ({ clinic, onClose }) => {
    if (!clinic) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-fast">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-10 relative shadow-2xl transform transition-transform duration-300 scale-95 animate-slide-up">
                <button onClick={onClose} className="absolute top-6 right-6 bg-orange-100 text-orange-600 w-10 h-10 rounded-full text-xl flex items-center justify-center hover:bg-orange-200 hover:rotate-90 transition-transform duration-300">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="border-b border-orange-100 pb-4 mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{clinic.name}</h2>
                    <p className="text-gray-600 flex items-center gap-2 text-lg"><FontAwesomeIcon icon={faMapMarkerAlt} />{clinic.location}</p>
                    {clinic.availability === "24/7" && <span className="mt-3 inline-block bg-gradient-to-r from-[#FF6B35] to-[#D84315] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">24/7</span>}
                </div>
                <div className="space-y-5 text-base">
                    <div><p className="font-bold text-orange-600 text-lg mb-1">Services Offered</p><p className="text-gray-700 leading-relaxed">{clinic.services}</p></div>
                    <div>
                        <p className="font-bold text-orange-600 text-lg mb-1">Availability</p>
                        <p className="text-gray-700 flex items-center gap-2">
                            {clinic.availability === "24/7" ? <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> : <FontAwesomeIcon icon={faClock} className="text-blue-500" />}
                            {clinic.availability === "24/7" ? "Open 24 hours a day, 7 days a week" : "Regular business hours"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 mt-8 pt-6 border-t border-orange-100">
                    {clinic.website && <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-gradient-to-r from-[#FF6B35] to-[#D84315] text-white font-bold py-3 px-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">Visit Website</a>}
                    <button onClick={onClose} className="flex-1 text-center bg-gray-200 text-gray-800 font-bold py-3 px-5 rounded-xl hover:bg-gray-300 transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};

const PetClinics = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('name');
    const [modalClinic, setModalClinic] = useState(null);

    const filteredAndSortedClinics = clinicsData
        .filter(clinic => {
            const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) || clinic.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = availabilityFilter === 'all' || clinic.availability === availabilityFilter;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortOrder === 'name') return a.name.localeCompare(b.name);
            if (sortOrder === 'location') return a.location.localeCompare(b.location);
            if (sortOrder === 'availability') {
                if (a.availability === '24/7' && b.availability !== '24/7') return -1;
                if (a.availability !== '24/7' && b.availability === '24/7') return 1;
            }
            return 0;
        });

    return (
        <div className="animate-fade-in bg-gradient-to-b from-orange-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Resources
                </button>
                <header className="text-center bg-gradient-to-br from-[#ff8a5b] to-[#ff6b35] text-white p-12 rounded-xl shadow-lg mb-10">
                    <h1 className="text-4xl font-bold mb-2 text-shadow"><FontAwesomeIcon icon={faPaw} /> Pet Clinics in Bangalore</h1>
                    <p className="text-lg opacity-95 text-shadow-sm">Find the best veterinary care for your pets</p>
                    <div className="max-w-xl mx-auto mt-6"><input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full py-3 px-6 rounded-full border-0 shadow-md focus:ring-4 focus:ring-orange-300 focus:outline-none text-gray-800" placeholder="Search by clinic name or location..." /></div>
                </header>
                <div className="flex flex-wrap gap-x-6 gap-y-4 items-center justify-center mb-8 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Availability:</span><button onClick={() => setAvailabilityFilter('all')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${availabilityFilter === 'all' ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All Clinics</button><button onClick={() => setAvailabilityFilter('24/7')} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${availabilityFilter === '24/7' ? 'bg-[#FF6B35] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>24/7 Only</button></div>
                    <div className="flex items-center gap-2"><label htmlFor="sortSelect" className="font-semibold text-gray-700">Sort by:</label><select id="sortSelect" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-white border-2 border-[#FF6B35] rounded-full px-4 py-2 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FF6B35' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat' }}><option value="name">Name (A-Z)</option><option value="location">Location (A-Z)</option><option value="availability">24/7 First</option></select></div>
                </div>
                <p className="text-center text-gray-600 mb-8">Showing {filteredAndSortedClinics.length} clinic(s)</p>
                {filteredAndSortedClinics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAndSortedClinics.map(clinic => (
                            <div key={clinic.name} onClick={() => setModalClinic(clinic)} className="bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-orange-200 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col">
                                <div className="p-7 flex-grow">
                                    <div className="flex justify-between items-start mb-3"><h3 className="text-xl font-bold text-gray-800 leading-tight">{clinic.name}</h3>{clinic.availability === "24/7" && <span className="bg-gradient-to-r from-[#FF6B35] to-[#D84315] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">24/7</span>}</div>
                                    <p className="text-gray-500 flex items-center gap-2 mb-4"><FontAwesomeIcon icon={faMapMarkerAlt} />{clinic.location}</p>
                                    <p className="text-sm text-gray-600 mb-5 flex-grow"><strong className="text-orange-600 block mb-1">Services:</strong> {clinic.services}</p>
                                </div>
                                <div className="p-5 bg-gray-50 rounded-b-2xl"><button onClick={(e) => { e.stopPropagation(); setModalClinic(clinic); }} className="w-full text-center bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">View Details</button></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16"><div className="text-6xl mb-4"><FontAwesomeIcon icon={faSearch} /></div><h3 className="text-2xl font-bold text-gray-800 mb-2">No clinics found</h3><p className="text-gray-600">Try adjusting your search or filters</p></div>
                )}
                <ClinicModal clinic={modalClinic} onClose={() => setModalClinic(null)} />
            </div>
        </div>
    );
};

// --- InsurancePartners Sub-Component and Data ---

const insuranceProviders = [
    { name: "Bajaj Allianz", url: "https://www.bajajallianz.co.in/pet-dog-insurance.html", offerings: "Surgery, hospitalization, OPD, mortality, terminal/long-term care, theft/lost, third-party liability. RFID discount.", pricing: "From ₹169/year" },
    { name: "HDFC ERGO Paws n Claws", url: "https://www.hdfcergo.com/pet-insurance", offerings: "Comprehensive illness/accident/surgery, OPD, tele-vet, third-party, travel cover. Up to 5 pets.", pricing: "Custom pricing; entry age 6m–5y" },
    { name: "Digit Insurance", url: "https://www.godigit.com/pet-insurance", offerings: "Accident, surgery, hospitalization, loss/theft, OPD, diagnostics. Fast online claims.", pricing: "Custom pricing per breed/plan" },
    { name: "New India Assurance", url: "https://www.newindia.co.in/portal/readMore/Dog-Insurance", offerings: "Death (illness/accident), theft/loss, third-party liability, basic veterinary costs.", pricing: "Premium ~5% of sum insured" },
    { name: "Universal Sompo", url: "https://www.universalsompo.com/health-insurance/pet-insurance", offerings: "Surgery, hospitalization, death cover, OPD, simple claim process.", pricing: "Contact for quote" },
    { name: "Future Generali", url: "https://general.futuregenerali.in/pet-insurance", offerings: "Illness, accident, surgery, OPD, long-term care, quick settlement.", pricing: "Age-based quote; contact online" },
];

const InsurancePartners = ({ onBack }) => (
    <div className="animate-fade-in">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Resources
        </button>
        <header className="text-center bg-gradient-to-br from-[#ff8a5b] to-[#ff6b35] text-white p-12 rounded-xl shadow-lg mb-10">
            <h1 className="text-4xl font-bold mb-2 text-shadow">Pet Insurance Providers</h1>
            <p className="text-lg opacity-95 text-shadow-sm">Compare Top Insurance Plans for Your Furry Friends</p>
        </header>
        <div className="max-w-4xl mx-auto bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg mb-12 flex items-center gap-6">
            <div className="text-5xl text-orange-500"><FontAwesomeIcon icon={faPaw} /></div>
            <p className="text-orange-800">Protect your beloved pets with comprehensive insurance coverage from trusted providers. Compare plans, pricing, and benefits to find the perfect protection for your furry family members.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insuranceProviders.map(provider => (
                <div key={provider.name} className="bg-white rounded-xl shadow-md border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transform hover:-translate-y-1.5 transition-all flex flex-col">
                    <div className="p-6 flex-grow flex flex-col">
                        <h2 className="text-2xl font-bold text-orange-600 mb-4 pb-4 border-b border-gray-100">{provider.name}</h2>
                        <p className="text-sm text-gray-600 mb-5 flex-grow">{provider.offerings}</p>
                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400 mt-auto">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing</p>
                            <p className="font-bold text-orange-600 text-lg">{provider.pricing}</p>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-b-xl"><a href={provider.url} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gradient-to-r from-[#FF6B35] to-[#ff8c42] text-white font-bold py-3 px-5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">Visit Website</a></div>
                </div>
            ))}
        </div>
    </div>
);

// --- PreventionTips Sub-Component ---

const PreventionTips = ({ onBack }) => (
    <div className="animate-fade-in">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Resources
        </button>
        <div className="bg-orange-50 p-10 rounded-lg my-10 text-center">
            <h2 className="text-orange-600 text-3xl font-bold mb-5">Pet Safety & Prevention Tips</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">Proactive steps are the best way to keep your pet safe. Here are essential tips to prevent them from getting lost and ensure a quick recovery if they do.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm"><h3 className="text-2xl font-bold text-orange-500 mb-3">Secure Your Home & Yard</h3><ul className="list-disc list-inside space-y-2 text-gray-700"><li>Regularly check fences and gates for holes or gaps.</li><li>Ensure window screens are secure.</li><li>Be cautious of open doors, especially with guests.</li></ul></div>
            <div className="bg-white p-8 rounded-lg shadow-sm"><h3 className="text-2xl font-bold text-orange-500 mb-3">Identification is Key</h3><ul className="list-disc list-inside space-y-2 text-gray-700"><li>Ensure your pet wears a collar with a clear, current ID tag.</li><li>Microchip your pet and keep the registry information updated.</li><li>Consider a GPS tracking collar for extra security.</li></ul></div>
            <div className="bg-white p-8 rounded-lg shadow-sm"><h3 className="text-2xl font-bold text-orange-500 mb-3">Training & Leash Safety</h3><ul className="list-disc list-inside space-y-2 text-gray-700"><li>Train your pet with reliable "come" and "stay" commands.</li><li>Always use a leash in unfenced areas.</li><li>Check collars and harnesses for proper fit to prevent slipping.</li></ul></div>
            <div className="bg-white p-8 rounded-lg shadow-sm"><h3 className="text-2xl font-bold text-orange-500 mb-3">Be Prepared for the Worst</h3><ul className="list-disc list-inside space-y-2 text-gray-700"><li>Keep recent, clear photos of your pet from all angles.</li><li>Have a list of emergency contacts: vet, local shelters, animal control.</li><li>Prepare a "lost pet" flyer template in advance.</li></ul></div>
        </div>
    </div>
);

// --- Main Grid Component ---

const MainResourcesGrid = ({ onNavigate }) => (
    <div className="animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Resources & Support</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-4xl text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Insurance Partners</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">Pet insurance benefits and coverage for rescued and reunited pets.</p>
                <button onClick={() => onNavigate('insurance')} className="mt-auto bg-orange-100 text-orange-600 font-semibold px-6 py-2 rounded-lg hover:bg-orange-200 transition-colors">Learn More</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center">
                <FontAwesomeIcon icon={faClinicMedical} className="text-4xl text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pet Clinics</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">Ensure your pets receive the very best veterinary care from trusted clinics.</p>
                <button onClick={() => onNavigate('clinics')} className="mt-auto bg-orange-100 text-orange-600 font-semibold px-6 py-2 rounded-lg hover:bg-orange-200 transition-colors">Find Clinics</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center">
                <FontAwesomeIcon icon={faLightbulb} className="text-4xl text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Prevention Tips</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">How to prevent pets from getting lost and ensure quick recovery.</p>
                <button onClick={() => onNavigate('prevention')} className="mt-auto bg-orange-100 text-orange-600 font-semibold px-6 py-2 rounded-lg hover:bg-orange-200 transition-colors">Read Tips</button>
            </div>
        </div>
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Emergency Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-r-lg">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-600 mb-3" />
                    <h4 className="font-bold text-lg text-red-800">Animal Emergency Helpline</h4>
                    <p className="text-red-700 font-semibold text-xl my-2">1-800-PET-HELP</p>
                    <p className="text-sm text-red-700">24/7 emergency support for injured or distressed animals.</p>
                </div>
                <div className="bg-blue-100 border-l-4 border-blue-500 p-6 rounded-r-lg">
                    <FontAwesomeIcon icon={faAmbulance} className="text-2xl text-blue-600 mb-3" />
                    <h4 className="font-bold text-lg text-blue-800">Mobile Veterinary Services</h4>
                    <p className="text-sm text-blue-700 my-2">On-site emergency veterinary care and transportation.</p>
                    <button className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-lg hover:bg-blue-600 transition-colors">Request Service</button>
                </div>
                <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded-r-lg">
                    <FontAwesomeIcon icon={faHome} className="text-2xl text-green-600 mb-3" />
                    <h4 className="font-bold text-lg text-green-800">Temporary Foster Network</h4>
                    <p className="text-sm text-green-700 my-2">Emergency foster care for rescued pets awaiting reunion.</p>
                    <button className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-lg hover:bg-green-600 transition-colors">Find Foster</button>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Resources Component ---

const Resources = () => {
    const [activeView, setActiveView] = useState('main');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeView]);

    const renderView = () => {
        switch(activeView) {
            case 'insurance': return <InsurancePartners onBack={() => setActiveView('main')} />;
            case 'clinics': return <PetClinics onBack={() => setActiveView('main')} />;
            case 'prevention': return <PreventionTips onBack={() => setActiveView('main')} />;
            case 'main':
            default:
                return <MainResourcesGrid onNavigate={setActiveView} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {renderView()}
            </div>
        </div>
    );
};

export default Resources;
