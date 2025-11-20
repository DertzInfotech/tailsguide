'use client';

import { useState } from 'react';

export default function ReportPage() {
  const [reportType, setReportType] = useState('lost');
  const [currentStep, setCurrentStep] = useState(0);

  const handleTypeChange = (type) => {
    setReportType(type);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-start md:items-center justify-center px-4 py-10">
      <section
        id="report"
        className="w-full max-w-4xl bg-white rounded-2xl shadow-md md:shadow-lg px-5 py-8 md:px-10 md:py-10"
      >
        <header className="text-center mb-8 md:mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-primary mb-2">
            Lost & Found
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Report Lost or Found Pet
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Help the community reunite pets with their families by sharing clear details and a recent photo.
          </p>
        </header>

        {/* Report type selector */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8">
          <button
            className={`type-btn flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all border
              ${
                reportType === 'lost'
                  ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            onClick={() => handleTypeChange('lost')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <span>Lost Pet</span>
          </button>

          <button
            className={`type-btn flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all border
              ${
                reportType === 'found'
                  ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            onClick={() => handleTypeChange('found')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Found Pet</span>
          </button>
        </div>

        {/* Lost Pet Form */}
        {reportType === 'lost' && (
          <div id="lost-pet-form" className="report-form">
            {/* Progress */}
            <div className="form-progress flex items-center justify-between gap-2 mb-8 text-xs md:text-sm">
              {['Pet Details', 'Location & Date', 'Contact Info', 'Medical Info'].map(
                (label, index) => (
                  <div key={label} className="flex-1 flex items-center">
                    <div
                      className={`flex flex-col items-center gap-1 ${
                        currentStep >= index
                          ? 'text-orange-primary font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border text-xs md:text-sm
                          ${
                            currentStep >= index
                              ? 'bg-orange-50 border-orange-primary text-orange-secondary'
                              : 'bg-gray-100 border-gray-300 text-gray-400'
                          }`}
                      >
                        {index + 1}
                      </div>
                      <span className="whitespace-nowrap">{label}</span>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block flex-1 h-px bg-gray-200 mx-2" />
                    )}
                  </div>
                )
              )}
            </div>

            <form className="pet-form" onSubmit={handleSubmit}>
              {/* Step 1: Pet Details */}
              {currentStep === 0 && (
                <div className="form-step space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    Pet Details
                  </h3>

                  <div className="photo-upload">
                    <div className="upload-area border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center bg-gray-50">
                      <svg
                        className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <p className="text-gray-700 font-medium mb-1">
                        Upload pet photo
                      </p>
                      <p className="text-gray-500 text-xs md:text-sm mb-3">
                        Clear, well‑lit photos help more people recognize your pet.
                      </p>
                      <input
                        type="file"
                        id="lost-pet-image"
                        accept="image/*"
                        className="hidden"
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        type="button"
                        className="flex-1 w-full px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M13 3C9.23 3 6.19 5.95 6 9.66l-1.92 2.88c-.3.47-.48 1-.48 1.57V17c0 1.1.9 2 2 2h2v-4h8v4h2c1.1 0 2-.9 2-2v-2.89c0-.57-.18-1.1-.48-1.57L17.99 9.66C17.81 5.95 14.77 3 13 3z" />
                        </svg>
                        AI Breed Detection
                      </button>

                      <button
                        type="button"
                        className="flex-1 w-full px-4 py-2.5 bg-orange-primary text-white rounded-lg hover:bg-orange-secondary text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>

                  <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* inputs unchanged, just ensure consistent spacing classes */}
                    {/* ... keep all your existing form-group blocks here ... */}
                  </div>

                  <div className="form-group">
                    <label className="form-label block mb-2 text-sm font-semibold text-gray-800">
                      Distinctive Features
                    </label>
                    <textarea
                      className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-light focus:border-orange-light"
                      id="lost-pet-distinctive-feature"
                      rows={3}
                      placeholder="Collar, markings, scars, behavior, etc."
                    />
                  </div>
                </div>
              )}

              {/* Step 2, 3, 4: keep your fields, just wrap each step in `space-y-6` and ensure labels use text-sm and headings text-xl */}
              {/* ... your existing JSX for steps 1–4, only adjusting spacing/typography classes similarly ... */}

              <div className="form-navigation flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                    onClick={handlePrevStep}
                  >
                    Previous
                  </button>
                ) : (
                  <span />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-orange-primary text-white hover:bg-orange-secondary shadow-sm"
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-orange-primary text-white hover:bg-orange-secondary shadow-sm"
                  >
                    Submit Report
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Found Pet Form */}
        {reportType === 'found' && (
          <div id="found-pet-form" className="report-form">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
              Found Pet Report
            </h3>

            <form className="pet-form space-y-6" onSubmit={handleSubmit}>
              <div className="photo-upload">
                <div className="upload-area border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center bg-gray-50">
                  <svg
                    className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <p className="text-gray-700 font-medium mb-1">
                    Upload photo of the found pet
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm mb-3">
                    A clear photo helps match with existing lost reports.
                  </p>
                  <input
                    type="file"
                    id="found-pet-image"
                    accept="image/*"
                    className="hidden"
                    required
                  />
                </div>

                <div className="ai-matching mt-4">
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 bg-orange-primary text-white rounded-lg hover:bg-orange-secondary text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 3C9.23 3 6.19 5.95 6 9.66l-1.92 2.88c-.3.47-.48 1-.48 1.57V17c0 1.1.9 2 2 2h2v-4h8v4h2c1.1 0 2-.9 2-2v-2.89c0-.57-.18-1.1-.48-1.57L17.99 9.66C17.81 5.95 14.77 3 13 3z" />
                    </svg>
                    AI Match Against Lost Pets
                  </button>
                </div>
              </div>

              {/* keep your existing found‑form fields, just ensure grid gap-4, labels text-sm, inputs text-sm, etc. */}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-orange-primary text-white rounded-lg hover:bg-orange-secondary font-semibold text-sm md:text-base shadow-sm"
              >
                Submit Found Pet Report
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
