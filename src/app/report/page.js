'use client';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ImageDropzone from "@/features/ai/ImageDropzone";
import Input from "@/shared/Input";
import Notification from "@/shared/Notification";
import { submitReport } from "@/lib/api-client";

export default function ReportPage() {
  const [reportType, setReportType] = useState('lost');
  const [currentStep, setCurrentStep] = useState(0);
  const [lostPetImage, setLostPetImage] = useState(null);
  const [foundPetImage, setFoundPetImage] = useState(null);
  const [lostPetDetection, setLostPetDetection] = useState(null);
  const [foundPetDetection, setFoundPetDetection] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const AIDetection = dynamic(() => import("@/features/ai/AIDetection"), { ssr: false });
  const [enableAI, setEnableAI] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [size, setSize] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [distinctiveFeature, setDistinctiveFeature] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [lastSeenDate, setLastSeenDate] = useState('');
  const [lastSeenTime, setLastSeenTime] = useState('');
  const [circumstances, setCircumstances] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [emergencyNo, setEmergencyNo] = useState('');
  const [isSMSChecked, setIsSMSChecked] = useState(true);
  const [isEmailChecked, setIsEmailChecked] = useState(true);
  const [isSocialChecked, setIsSocialChecked] = useState(true);
  const [isWPChecked, setIsWPChecked] = useState(true);
  const [microchipID, setMicrochipId] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const router = useRouter();

  const [foundLocation, setFoundLocation] = useState('');
  const [foundDate, setFoundDate] = useState('');
  const [petCondition, setPetCondition] = useState('');
  const [petDescription, setPetDescription] = useState('');
  const [foundersName, setFoundersName] = useState('');
  const [foundersPhoneNO, setFoundersPhoneNo] = useState('');
  const [foundersEmail, setFoundersEmail] = useState('');
  const [careArrangement, setCareArrangement] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const imageToSubmit = reportType === 'lost' ? lostPetImage : foundPetImage;
    const detectionData = reportType === 'lost' ? lostPetDetection : foundPetDetection;

    console.log('Form submitted with image:', imageToSubmit);
    console.log('AI Detection data:', detectionData);

    const formdata = new FormData();
    const lostPetJSON = {
      petName: petName,
      breed: breed,
      age: age,
      gender: gender,
      size: size,
      primaryColor: primaryColor,
      distinctiveFeatures: distinctiveFeature,
      reportType: reportType.toUpperCase(),
      lastSeenLocation: lastLocation,
      lastSeenDate: lastSeenDate,
      lastSeenTime: lastSeenTime,
      circumstances: circumstances,
      ownerName: contactName,
      ownerPhone: contactNo,
      ownerEmail: contactEmail,
      emergencyContact: emergencyNo,
      microchipId: microchipID,
      medicalConditions: medicalCondition,
      specialInstructions: specialInstructions,
    };

    const foundPetJSON = {
      petName: null,
      breed: null,
      age: null,
      gender: null,
      size: null,
      primaryColor: null,
      distinctiveFeatures: distinctiveFeature,
      reportType: reportType.toUpperCase(),
      lastSeenLocation: foundLocation,
      lastSeenDate: foundDate,
      lastSeenTime: null,
      circumstances: circumstances,
      ownerName: foundersName,
      ownerPhone: foundersPhoneNO,
      ownerEmail: foundersEmail,
      emergencyContact: null,
      microchipId: null,
      medicalConditions: null,
      specialInstructions: specialInstructions,
    };

    if (reportType === 'lost') {
      formdata.append('petDTO', new Blob([JSON.stringify(lostPetJSON)], { type: 'application/json' }));
      formdata.append('photo', lostPetImage, lostPetImage.name);
    }

    if (reportType === 'found') {
      formdata.append('petDTO', new Blob([JSON.stringify(foundPetJSON)], { type: 'application/json' }));
      formdata.append('photo', foundPetImage, foundPetImage.name);
    }

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    try {

      const result = await submitReport(requestOptions);

      if (result.response.ok) {
        console.log("report submitted")
        showNotification(`${reportType === 'lost' ? 'Lost' : 'Found'} pet report submitted successfully!`, 'success');
        setTimeout(() => {
          router.push('/');
        }, 2000)
      } else {
        showNotification(result.result.validationErrors, 'error');
      }
      console.log(formdata);
    } catch (error) {
      console.log("Pet Data Submission Failed", error);
      showNotification("Pet Data Submission Failed", 'error')
    } finally {
      setIsSubmitting(false)
    }
  };

  const runAIDetection = async (type) => {
    const file = type === 'lost' ? lostPetImage : foundPetImage;

    if (!file) {
      console.warn('No image selected');
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

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  }

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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



        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => handleTypeChange('lost')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${reportType === 'lost'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
          >
            Lost Pet
          </button>
          <button
            onClick={() => handleTypeChange('found')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${reportType === 'found'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
          >
            Found Pet
          </button>
        </div>

        {/* Lost Pet Form */}
        {reportType === 'lost' && (
            <form className="bg-white rounded-2xl shadow-xl p-8"
            onSubmit={(e) => e.preventDefault()}>
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
                    onAIDetect={() => setEnableAI(true)}
                    isAnalyzing={isAnalyzing}
                  />
                  {enableAI && reportType === 'lost' && (
                    <AIDetection
                      file={lostPetImage}
                      onResult={(result) => {
                        setLostPetDetection(result);
                        setPetType(result?.petType || '');
                        setEnableAI(false);
                      }}
                    />
                  )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-10">
                  <div>
                    <Input
                      id="petname"
                      label="Enter pet's name"
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pet Type {lostPetDetection?.detected && `(AI: ${lostPetDetection.petType})`}
                    </label>
                    <select
                      value={petType}
                      onChange={(e) => setPetType(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                    >
                      <option>Select type</option>
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Bird</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <Input
                      id="breed"
                      label="Enter pet's breed"
                      type="text"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pet Age
                    </label>
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                    >
                      <option>Select age</option>
                      <option>Puppy (0-1 year)</option>
                      <option>Young (1-3 years)</option>
                      <option>Adult (3-7 years)</option>
                      <option>Senior (7+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pet Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                    >
                      <option>Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Pet Size
                    </label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                    >
                      <option>Select size</option>
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                    </select>
                  </div>

                  <div>
                    <Input
                      id="primarycolor"
                      label="Primary Color"
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Distinctive Features
                    </label>
                    <textarea
                      className="w-full h-20 bg-gray-100 rounded-lg p-2"
                      placeholder="Collar, markings, scars, behavior, etc."
                      value={distinctiveFeature}
                      onChange={(e) => setDistinctiveFeature(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Location & Date</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <Input
                      id="lastlocation"
                      label="Enter Last Seen Location"
                      type="text"
                      value={lastLocation}
                      onChange={(e) => setLastLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="lastseendate"
                      label="Enter Last Seen Date"
                      type="date"
                      value={lastSeenDate}
                      onChange={(e) => setLastSeenDate(e.target.value)}
                      className="hide-date-time"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      id="lastseentime"
                      label="Enter Last Seen Time"
                      type="time"
                      value={lastSeenTime}
                      onChange={(e) => setLastSeenTime(e.target.value)}
                      className="hide-date-time"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Circumstances
                    </label>
                    <textarea
                      className="w-full h-20 bg-gray-100 rounded-lg p-2"
                      placeholder="How did your pet go missing? What were they doing?"
                      value={circumstances}
                      onChange={(e) => setCircumstances(e.target.value)}
                    />
                  </div>
                </div>
              </div>

            )}

            {currentStep === 2 && (
              <div>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Info</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <Input
                      id="contactname"
                      label="Your Name"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="contactno"
                      label="Contact Number"
                      type="text"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="contactemail"
                      label="Contact Email"
                      type="text"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="emergencyno"
                      label="Emergency Number"
                      type="text"
                      value={emergencyNo}
                      onChange={(e) => setEmergencyNo(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 mb-5">
                    <h4 className="text-xl font-semibold mb-5  mt-3 text-gray-700">Alert Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <label className="bg-gray-100 p-3 rounded-md"><input
                        id="smspreference"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={isSMSChecked}
                        onChange={(e) => setIsSMSChecked(e.target.checked)}
                      />&nbsp;&nbsp;SMS Alert</label>
                      <label className="w-full bg-gray-100 p-3 rounded-md"><input
                        id="emailpreference"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={isEmailChecked}
                        onChange={(e) => setIsEmailChecked(e.target.checked)}
                      />&nbsp;&nbsp;Email Notification</label>
                      <label className="w-full bg-gray-100 p-3 rounded-md"><input
                        id="smspreference"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={isSocialChecked}
                        onChange={(e) => setIsSocialChecked(e.target.checked)}
                      />&nbsp;&nbsp;Social Media Sharing</label>
                      <label className="w-full bg-gray-100 p-3 rounded-md"><input
                        id="smspreference"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={isWPChecked}
                        onChange={(e) => setIsWPChecked(e.target.checked)}
                      />&nbsp;&nbsp;Community WhatsApp Groups</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Medical Info</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <Input
                      id="microchipid"
                      label="Microchip ID"
                      type="text"
                      value={microchipID}
                      onChange={(e) => setMicrochipId(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="veterinarian"
                      label="Veterinarian"
                      type="text"
                      value={veterinarian}
                      onChange={(e) => setVeterinarian(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Medical Conditions & Medications
                    </label>
                    <textarea
                      className="w-full h-20 bg-gray-100 rounded-lg p-2"
                      placeholder="Any ongoing medical conditions, required medications, allergies, etc."
                      value={medicalCondition}
                      onChange={(e) => setMedicalCondition(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Special Instructions
                    </label>
                    <textarea
                      className="w-full h-20 bg-gray-100 rounded-lg p-2"
                      placeholder="Behavioral notes, approach instructions, etc."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

{/* Step Actions */}
<div className="flex justify-between items-center mt-10">

  {/* Previous — show only after step 0 */}
  {currentStep > 0 ? (
    <button
      type="button" 
      onClick={handlePrevStep}
      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
    >
      Previous
    </button>
  ) : (
    <div /> // keeps spacing
  )}

  {/* Next OR Submit */}
  {currentStep < 3 ? (
    <button
      type="button" 
      onClick={handleNextStep}
      className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
    >
      Next
    </button>
  ) : (
<button
  type="button"            // ⛔ NOT submit
  onClick={handleSubmit}   // ✅ submit ONLY when clicked
  disabled={isSubmitting}
  className={`px-8 py-3 bg-red-500 text-white rounded-lg font-semibold
  ${isSubmitting ? 'bg-red-300 cursor-not-allowed' : 'hover:bg-red-600'}
`}
>
  {isSubmitting ? 'Submitting...' : 'Submit Lost Pet Report'}
</button>

  )}

</div>

          </form>
        )}
        

        {reportType === 'found' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Found Pet Report</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Pet Photo 📸
              </label>
              <ImageDropzone
                onImageSelect={handleFoundImageSelect}
                selectedImage={foundPetImage}
                removeImage={removeFoundImage}
                onAIDetect={() => setEnableAI(true)}
                isAnalyzing={isAnalyzing}
              />
              {enableAI && reportType === 'found' && (
                <AIDetection
                  file={foundPetImage}
                  onResult={(result) => {
                    setFoundPetDetection(result);
                    setEnableAI(false);
                  }}
                />
              )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-10">
              <div>
                <Input
                  id="foundpetlocation"
                  label="Where did you found the pet?"
                  type="text"
                  value={foundLocation}
                  onChange={(e) => setFoundLocation(e.target.value)}
                />
              </div>
              <div>
                <Input
                  id="foundpetdate"
                  label="Date Found"
                  type="date"
                  value={foundDate}
                  onChange={(e) => setFoundDate(e.target.value)}
                  className="hide-date-time"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Pet Condition
                </label>
                <select
                  value={petCondition}
                  onChange={(e) => setPetCondition(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:ring-2 focus:ring-orange-primary focus:border-transparent"
                >
                  <option>Select Condition</option>
                  <option>Excellent Health</option>
                  <option>Good Health</option>
                  <option>Injured/Needs Care</option>
                  <option>Critical Condition</option>
                </select>
              </div>
              <div className="col-span-2">
                <label
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Pet Description
                </label>
                <textarea
                  className="w-full h-20 bg-gray-100 rounded-lg p-2"
                  placeholder="Breed, size, color, distinctive features, behavior..."
                  value={petDescription}
                  onChange={(e) => setPetDescription(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Current Care Arrangements
                </label>
                <textarea
                  className="w-full h-20 bg-gray-100 rounded-lg p-2"
                  placeholder="Where is the pet now? Can you provide temporary care?"
                  value={careArrangement}
                  onChange={(e) => setCareArrangement(e.target.value)}
                />
              </div>
              <div className="col-span-2 mb-5">
                <h4 className="text-xl font-semibold mb-2  mt-3 text-gray-600">Your Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <Input
                      id="foundercontactname"
                      label="Your Name"
                      type="text"
                      value={foundersName}
                      onChange={(e) => setFoundersName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="founderphone"
                      label="Your Phone Number"
                      type="text"
                      value={foundersPhoneNO}
                      onChange={(e) => setFoundersPhoneNo(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      id="foundersemail"
                      label="Your Email"
                      type="text"
                      value={foundersEmail}
                      onChange={(e) => setFoundersEmail(e.target.value)}
                    />
                  </div>
                </div>

              </div>

            </div>

            <button
              key="submit-button"
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg active:bg-green-500 hover:bg-green-700 font-semibold ${isSubmitting
                ? 'bg-green-300 cursor-not-allowed'
                : 'hover:bg-green-600'
                }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Found Pet Report"}
            </button>
          </form>
        )}
      </div>
      {/* Notification Render */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
