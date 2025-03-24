"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  limit,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, auth, storage, app } from "@/firebase";
import { Textarea, Input, Button } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { InboxIcon } from "@heroicons/react/solid";
import Link from "next/link";

const FillForm = () => {

  const [user, setUser] = useState(null);
  const router = useRouter();
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [weight, setWeight] = useState("");
  
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormState, setInitialFormState] = useState(null);
  const auth = getAuth(app);

  const options = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "trans", label: "Transgender" },
    { value: "intersex", label: "Intersex" },
  ];

  const isFormValid = () => {
    return (
      dateOfBirth &&
      weight.trim() !== "" &&
      gender.trim() !== "" &&
      symptoms.trim() !== "" &&
      isFormChanged() 
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    if (user) {
      const loadFormData = async () => {
        const docRef = doc(db, "users", user.uid, "medicalForms", "userdata");
        try {
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const formattedData = {
              // dateOfBirth: data.dateOfBirth?.toDate() || new Date(), m r
              weight: data.weight || "",
              height: data.height || "",
              gender: data.gender || "",
              medicalHistory: data.medicalHistory || "",
              currentMedications: data.currentMedications || "",
              allergies: data.allergies || "",
              symptoms: data.symptoms || "",
              fileURL: data.fileURL || null,
            };
  
            setDateOfBirth(formattedData.dateOfBirth);
            setWeight(formattedData.weight);
            setHeight(formattedData.height);
            setGender(formattedData.gender);
            setMedicalHistory(formattedData.medicalHistory);
            setCurrentMedications(formattedData.currentMedications);
            setAllergies(formattedData.allergies);
            setSymptoms(formattedData.symptoms);
            if (data.fileURL) {
              setFile({ name: 'Previous Upload', url: data.fileURL });
            }
            setInitialFormState(formattedData);
          }
        } catch (error) {
          console.error("Error loading form data: ", error);
        }
      };
      loadFormData();
    }
  }, [user]);
  const isFormChanged = () => {
    if (!initialFormState) return true; // Allow submit if initial state isn't set yet
  
    return (
      initialFormState.dateOfBirth?.toISOString() !== dateOfBirth?.toISOString() ||
      initialFormState.weight !== weight ||
      initialFormState.height !== height ||
      initialFormState.gender !== gender ||
      initialFormState.medicalHistory !== medicalHistory ||
      initialFormState.currentMedications !== currentMedications ||
      initialFormState.allergies !== allergies ||
      initialFormState.symptoms !== symptoms ||
      (file && !file.url) // If a new file is uploaded
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const processFile = async (file) => {
    try {
      const fileRef = ref(storage, `reports/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      
      const response = await fetch('https://genmedai-backend.onrender.com/med-ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: fileUrl,
          user_id: user.uid
        })
      });

      const data = await response.json();
      return {
        url: fileUrl,
        status: data.status === 'success' ? 'success' : 'fail'
      };
    } catch (error) {
      console.error("Error processing file:", error);
      return {
        url: null,
        status: 'fail'
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !isFormValid()) {
      return;
    }
  
    setIsLoading(true);
    try {
      const docRef = doc(db, "users", user.uid, "medicalForms", "userdata");
      const docSnapshot = await getDoc(docRef);
  
      let fileData = null;
      if (file && !file.url) {
        fileData = await processFile(file);
      }
  
      const newFormData = {
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        weight: weight || null,
        height: height || null,
        symptoms: symptoms || null,
        medicalHistory: medicalHistory || null,
        currentMedications: currentMedications || null,
        allergies: allergies || null,
        ...(fileData ? { fileURL: fileData.url, fileStatus: fileData.status } : {}),
        timestamp: serverTimestamp(),
      };
  
      if (docSnapshot.exists()) {
        await updateDoc(docRef, newFormData);
      } else {
        await setDoc(docRef, newFormData);
      }
  
      router.push("/ChatWindow");
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasChanges = () => {
    return (
      dateOfBirth !== (existingData?.dateOfBirth || null) ||
      gender !== (existingData?.gender || null) ||
      weight !== (existingData?.weight || null) ||
      height !== (existingData?.height || null) ||
      symptoms !== (existingData?.symptoms || null) ||
      medicalHistory !== (existingData?.medicalHistory || null) ||
      currentMedications !== (existingData?.currentMedications || null) ||
      allergies !== (existingData?.allergies || null) ||
      (file && !file.url)
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-red-600 to-red-700">
          <h2 className="text-3xl font-bold text-white mb-8">
            Medical Information Form
          </h2>

          <div className="flex justify-between items-center mt-8 relative">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className="flex flex-col items-center w-1/3 cursor-pointer"
                onClick={() => setStep(stepNumber)}
              >
                <div
                  className={`z-10 flex items-center justify-center w-10 h-10 rounded-full 
                  ${
                    step === stepNumber
                      ? "bg-white text-red-600"
                      : step > stepNumber
                      ? "bg-green-500 text-white"
                      : "bg-white/50 text-white"
                  } font-bold text-lg transition-all duration-200`}
                >
                  {step > stepNumber ? "✓" : stepNumber}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    step === stepNumber ? "text-white" : "text-white/70"
                  }`}
                >
                  {stepNumber === 1
                    ? "Basic Info"
                    : stepNumber === 2
                    ? "Medical History"
                    : "Documents"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-8 mt-6">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-2 rounded-lg text-white transition-all duration-200 
      ${
        step === 1
          ? "opacity-50 cursor-not-allowed"
          : "bg-white/20 hover:bg-white/30"
      }`}
              disabled={step === 1}
            >
              Previous
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 z-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid() || isLoading}
                className={`px-6 py-2 ${
                  isFormValid() && !isLoading
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white rounded-lg transition-all duration-200 flex items-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">
                    Date of Birth <br />
                  </label>
                  <DatePicker
                    selected={dateOfBirth}
                    onChange={(date) => setDateOfBirth(date)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">
                    Height (inches)
                  </label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-semibold">
                  Current Symptoms
                </label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-red-500 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-semibold">
                  Medical History
                </label>
                <Textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-red-500 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-semibold">
                  Current Medications
                </label>
                <Textarea
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-red-500 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-semibold">
                  Allergies
                </label>
                <Textarea
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-red-500 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {!file ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="p-4 bg-red-50 rounded-full">
                        <InboxIcon className="w-12 h-12 text-red-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-700">
                          Upload Medical Report
                        </p>
                        <p className="text-sm text-gray-500">
                          Click to select a file (PDF, DOC, DOCX, JPG, JPEG, PNG)
                        </p>
                      </div>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Uploaded File
                    </h4>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove File
                    </button>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-600 font-medium">
                      {file.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FillForm;