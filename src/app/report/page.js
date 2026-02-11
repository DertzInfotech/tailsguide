'use client';

import { useState, useRef } from "react";
import ImageDropzone from "../../components/UI/dropzone";
import { useObjectDetection } from "../../utils/useObjectDetection";

export default function ReportPage() {
  const [reportType, setReportType] = useState('lost');
  const [currentStep, setCurrentStep] = useState(0);
  const [lostPetImage, setLostPetImage] = useState(null);
  const [foundPetImage, setFoundPetImage] = useState(null);
  const [lostPetDetection, setLostPetDetection] = useState(null);
  const [foundPetDetection, setFoundPetDetection] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { detectAndClassify, modelLoaded, isLoading, error } = useObjectDetection();

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
    const imageToSubmit = reportType === 'lost' ? lostPetImage : foundPetImage;
    const detectionData = reportType === 'lost' ? lostPetDetection : foundPetDetection;

    console.log('Form submitted with image:', imageToSubmit);
    console.log('AI Detection data:', detectionData);
  };

  const runAIDetection = async (type) => {
    const file = type === 'lost' ? lostPetImage : foundPetImage;
    
    if (!file) {
      console.warn('No image selected');
      return;
    }

    if (!modelLoaded) {
      alert('AI model is still loading. Please wait a moment and try again.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = async (e) => {
        img.onload = async () => {
          const result = await detectAndClassify(img);

          if (type === 'lost') {
            setLostPetDetection(result);
          } else {
            setFoundPetDetection(result);
          }

          setIsAnalyzing(false);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('AI detection error:', err);
      setIsAnalyzing(false);
    }
  };

  const handleLostImageSelect = (file) => {
    setLostPetImage(file);
    setLostPetDetection(null);
  };

  const handleFoundImageSelect = (file) => {
    setFoundPetImage(file);
    setFoundPetDetection(null);
  };

  const removeLostImage = () => {
    setLostPetImage(null);
    setLostPetDetection(null);
  };

  const removeFoundImage = () => {
    setFoundPetImage(null);
    setFoundPetDetection(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 py-12 px-4">

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Report Lost or Found Pet
          </h1>
          <p className="text-gray-600">
            Help reunite pets with their families
          </p>
        </div>
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-center">
            🔄 Loading AI model...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-center">
            ❌ {error}
          </div>
        )}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => handleTypeChange('lost')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${reportType === 'lost'
                ? 'bg-orange-primary text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            Lost Pet
          </button>
          <button
            onClick={() => handleTypeChange('found')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${reportType === 'found'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            Found Pet
          </button>
        </div>

        {/* Lost Pet Form */}
        {reportType === 'lost' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              {['Pet Details', 'Location & Date', 'Contact Info', 'Medical Info'].map(
                (label, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${index <= currentStep
                        ? 'text-orange-primary font-semibold'
                        : 'text-gray-400'
                      }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mr-2 ${index <= currentStep
                          ? 'bg-orange-50 border-orange-primary text-orange-secondary'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span className="hidden sm:inline">{label}</span>
                    {index < 3 && (
                      <div
                        className={`h-0.5 w-8 mx-2 ${index < currentStep ? 'bg-orange-primary' : 'bg-gray-300'
                          }`}
                      />
                    )}
                  </div>
                )
              )}
            </div>

            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pet Details</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Pet Photo 📸
                  </label>
                  <ImageDropzone
                    onImageSelect={handleLostImageSelect}
                    selectedImage={lostPetImage}
                    removeImage={removeLostImage}
                    onAIDetect={() => runAIDetection('lost')}
                    isAnalyzing={isAnalyzing}
                  />
                  {isAnalyzing && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-blue-700 font-medium">
                          🤖 AI is analyzing your image...
                        </span>
                      </div>
                    </div>
                  )}

                  {lostPetDetection && !isAnalyzing && (
                    <div
                      className={`mt-4 p-4 rounded-lg border-2 ${lostPetDetection.detected
                          ? 'bg-green-50 border-green-200'
                          : 'bg-yellow-50 border-yellow-200'
                        }`}
                    >
                      {lostPetDetection.detected ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">✅</span>
                            <span className="text-lg font-bold text-green-800">
                              Pet Detected!
                            </span>
                          </div>
                          <div className="space-y-1 text-green-700">
                            <p>
                              <strong>Type:</strong> {lostPetDetection.petType.toUpperCase()}
                            </p>
                            <p>
                              <strong>Confidence:</strong> {lostPetDetection.confidence}%
                            </p>
                          </div>
                        </div>
                      ) : (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">⚠️</span>
                            <span className="text-lg font-bold text-yellow-800">
                              No Pet Detected
                            </span>
                          </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Other form fields... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                      placeholder="Enter pet's name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Type {lostPetDetection?.detected && `(AI: ${lostPetDetection.petType})`}
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent">
                      <option value="">Select type</option>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Breed
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                      placeholder="Enter breed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                      placeholder="e.g., 3 years"
                    />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Location & Date</h2>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Info</h2>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Medical Info</h2>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-orange-primary text-white rounded-lg hover:bg-orange-600 font-semibold"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-primary text-white rounded-lg hover:bg-orange-600 font-semibold"
                >
                  Submit Report
                </button>
              )}
            </div>
          </form>
        )}

        {reportType === 'found' && (
          <form
            className="bg-white rounded-2xl shadow-xl p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Found Pet Report</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Pet Photo 📸
              </label>
              <ImageDropzone
                onImageSelect={handleFoundImageSelect}
                selectedImage={foundPetImage}
                removeImage={removeFoundImage}
                onAIDetect={() => runAIDetection('found')}
                isAnalyzing={isAnalyzing}
              />

              {isAnalyzing && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 font-medium">
                      🤖 AI is analyzing your image...
                    </span>
                  </div>
                </div>
              )}

              {foundPetDetection && !isAnalyzing && (
                <div
                  className={`mt-4 p-4 rounded-lg border-2 ${foundPetDetection.detected
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200'
                    }`}
                >
                  {foundPetDetection.detected ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✅</span>
                        <span className="text-lg font-bold text-green-800">
                          Pet Detected!
                        </span>
                      </div>

                      {foundPetDetection.breeds && foundPetDetection.breeds.length > 0 && (
                        <div className="mt-3">
                          <p className="font-semibold text-green-800 mb-2">🏷️ AI Breed Predictions:</p>
                          <div className="space-y-2">
                            {foundPetDetection.breeds.map((breed, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm bg-white rounded-lg p-2">
                                <span className={idx === 0 ? 'font-semibold text-green-900' : 'text-green-700'}>
                                  {idx + 1}. {breed.breed}
                                </span>
                                <span className={`${idx === 0 ? 'font-bold' : ''} text-green-600`}>
                                  {breed.confidence}%
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-green-600 mt-2">
                            💡 This information can help identify the owner!
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⚠️</span>
                        <span className="text-lg font-bold text-yellow-800">
                          No Pet Detected
                        </span>
                      </div>
                        <p className="text-yellow-700 text-sm mb-2">
                          The AI could not identify a pet in this image. Please upload a clear photo of a dog, cat, bird, rabbit, or other pet.
                        </p>
                        <p className="text-xs text-yellow-600">
                          💡 Tip: Make sure the pet is clearly visible and well-lit in the photo.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where did you find this pet?
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Contact Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Submit Found Pet Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
