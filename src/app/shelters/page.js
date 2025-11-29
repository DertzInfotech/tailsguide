'use client'

import React, { useState } from 'react';

// This component assumes you have Tailwind CSS and Font Awesome configured in your project.
// You can add Font Awesome via a CDN in your index.html or by installing the React package.

const Shelters = () => {
    const [activeTab, setActiveTab] = useState('intake');

    const shelterData = [
        {
            name: 'Delhi Animal Welfare Society',
            capacity: '127/150 capacity',
            location: 'Lajpat Nagar, Delhi',
            phone: '+91-9123456789',
            volunteers: '45 active volunteers',
            successRate: '89% success rate',
            services: ['Emergency Care', 'Adoption', 'Vaccination', 'Spay/Neuter']
        },
        {
            name: 'Mumbai Pet Rescue Centre',
            capacity: '156/200 capacity',
            location: 'Bandra, Mumbai',
            phone: '+91-8234567890',
            volunteers: '67 active volunteers',
            successRate: '92% success rate',
            services: ['24/7 Emergency', 'Medical Care', 'Rehabilitation', 'Training']
        }
    ];

    return (
        <div className="bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-5">
                <h1 className="mb-8 text-3xl md:text-4xl font-bold text-gray-800">Partner Shelters & Animal Care Centers</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <i className="fas fa-building text-4xl text-orange-500 mb-4"></i>
                        <span className="block text-4xl font-bold text-gray-800 mb-2">89</span>
                        <span className="text-gray-600 font-medium">Partner Shelters</span>
                    </div>
                    <div className="bg-white p-6 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <i className="fas fa-paw text-4xl text-orange-500 mb-4"></i>
                        <span className="block text-4xl font-bold text-gray-800 mb-2">283</span>
                        <span className="text-gray-600 font-medium">Animals in Care</span>
                    </div>
                    <div className="bg-white p-6 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <i className="fas fa-heart text-4xl text-orange-500 mb-4"></i>
                        <span className="block text-4xl font-bold text-gray-800 mb-2">92%</span>
                        <span className="text-gray-600 font-medium">Avg Success Rate</span>
                    </div>
                </div>

                <div className="grid gap-8">
                    {shelterData.map((shelter, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800">{shelter.name}</h3>
                                <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">{shelter.capacity}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <p className="flex items-center gap-2 text-gray-600"><i className="fas fa-map-marker-alt text-orange-500"></i> {shelter.location}</p>
                                <p className="flex items-center gap-2 text-gray-600"><i className="fas fa-phone text-orange-500"></i> {shelter.phone}</p>
                                <p className="flex items-center gap-2 text-gray-600"><i className="fas fa-users text-orange-500"></i> {shelter.volunteers}</p>
                                <p className="flex items-center gap-2 text-gray-600"><i className="fas fa-chart-line text-orange-500"></i> {shelter.successRate}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {shelter.services.map((service, sIndex) => (
                                    <span key={sIndex} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{service}</span>
                                ))}
                            </div>
                            <div className="flex gap-4 flex-wrap">
                                <button className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors">View Animals</button>
                                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 font-semibold hover:bg-gray-200 transition-colors">Contact Shelter</button>
                                <button className="px-4 py-2 rounded-lg bg-transparent text-orange-500 border-2 border-orange-500 font-semibold hover:bg-orange-500 hover:text-white transition-colors">Volunteer</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Shelter Management Dashboard</h2>
                    <div className="flex gap-4 mb-8 border-b border-gray-200">
                        <button onClick={() => setActiveTab('intake')} className={`px-6 py-3 bg-transparent border-0 text-gray-600 cursor-pointer transition-all duration-300 border-b-4 ${activeTab === 'intake' ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>Animal Intake</button>
                        <button onClick={() => setActiveTab('care')} className={`px-6 py-3 bg-transparent border-0 text-gray-600 cursor-pointer transition-all duration-300 border-b-4 ${activeTab === 'care' ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>Care Management</button>
                        <button onClick={() => setActiveTab('volunteers')} className={`px-6 py-3 bg-transparent border-0 text-gray-600 cursor-pointer transition-all duration-300 border-b-4 ${activeTab === 'volunteers' ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>Volunteers</button>
                        <button onClick={() => setActiveTab('inventory')} className={`px-6 py-3 bg-transparent border-0 text-gray-600 cursor-pointer transition-all duration-300 border-b-4 ${activeTab === 'inventory' ? 'text-orange-500 border-orange-500' : 'border-transparent'}`}>Inventory</button>
                    </div>

                    <div className={activeTab === 'intake' ? 'block' : 'hidden'}>
                        <div>
                            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors">
                                <i className="fas fa-plus"></i> New Animal Intake
                            </button>
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4">Recent Intakes</h4>
                                <div>
                                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg mb-4">
                                        <img src="https://via.placeholder.com/60x60/FF6B35/FFFFFF?text=🐕" alt="Dog" className="w-14 h-14 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <h5 className="mb-1 text-md font-semibold text-gray-800">German Shepherd Mix</h5>
                                            <p className="text-sm text-gray-600 mb-1">Intake Date: Aug 30, 2025</p>
                                            <p className="text-sm text-gray-600">Condition: Good, needs vaccination</p>
                                        </div>
                                        <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 font-semibold hover:bg-gray-200 transition-colors text-sm">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={activeTab === 'care' ? 'block' : 'hidden'}>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-4">Today's Care Schedule</h4>
                            <div className="mt-4">
                                <div className="flex items-center gap-4 p-4 border border-red-300 bg-red-50 rounded-lg mb-4">
                                    <i className="fas fa-syringe text-2xl text-red-500"></i>
                                    <div className="flex-1">
                                        <h5 className="mb-1 text-md font-semibold text-gray-800">Medication Due</h5>
                                        <p className="text-gray-600 text-sm">Max (Kennel A-12) - Insulin shot at 2:00 PM</p>
                                    </div>
                                    <button className="px-3 py-1 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors text-sm">Mark Done</button>
                                </div>
                                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg mb-4">
                                    <i className="fas fa-utensils text-2xl text-orange-500"></i>
                                    <div className="flex-1">
                                        <h5 className="mb-1 text-md font-semibold text-gray-800">Feeding Schedule</h5>
                                        <p className="text-gray-600 text-sm">Section B - Evening feeding at 6:00 PM</p>
                                    </div>
                                    <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 font-semibold hover:bg-gray-200 transition-colors text-sm">Schedule</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={activeTab === 'volunteers' ? 'block' : 'hidden'}>
                        <p className="text-gray-500">Volunteer management interface will be here.</p>
                    </div>

                    <div className={activeTab === 'inventory' ? 'block' : 'hidden'}>
                        <p className="text-gray-500">Inventory management interface will be here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shelters;