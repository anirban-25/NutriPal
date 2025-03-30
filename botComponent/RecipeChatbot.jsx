import { app } from '@/firebase';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoIosExpand } from "react-icons/io";
import { BiCollapse } from "react-icons/bi";
const RecipeChatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userId, setUserId] = useState(null);
  const [proteinRange, setProteinRange] = useState('');
  const [caloriesRange, setCaloriesRange] = useState('');
  const router = useRouter();
  const [carbsRange, setCarbsRange] = useState('');
  const [dietType, setDietType] = useState('');
  const [recipe, setRecipe] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation check
    const hasRanges = proteinRange && caloriesRange && carbsRange;
    const hasDietType = dietType !== '';

    if (!hasRanges && !hasDietType) {
      setError('Please fill in either all ranges or select a diet type');
      return;
    }

    // Build prompt details array with only non-empty values
    const promptDetails = [
      proteinRange && `- Protein Range: ${proteinRange}g`,
      caloriesRange && `- Calories Range: ${caloriesRange}kcal`,
      carbsRange && `- Carbs Range: ${carbsRange}g`,
      dietType && `- Diet Type: ${dietType}`,
    ].filter(Boolean); // Remove falsy values

    const response = await fetch('/api/recipe-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        proteinRange: proteinRange || undefined,
        caloriesRange: caloriesRange || undefined,
        carbsRange: carbsRange || undefined,
        dietType: dietType || undefined,
        promptDetails: promptDetails.join('\n'),
      }),
    });
    const data = await response.json();
    setRecipe(data.response);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        💬
      </button>

      {isChatOpen && (
        <div className={`fixed bg-white rounded-lg shadow-xl transition-all duration-300 ${
          isExpanded 
            ? 'inset-4' 
            : 'bottom-20 right-4 w-96'
        }`}>
          <div className="flex justify-between items-center bg-red-600 p-4 rounded-t-lg">
            <h2 className="text-lg font-bold text-white">Recipe Assistant</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                {isExpanded ? <BiCollapse />: <IoIosExpand /> }
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={`${
            isExpanded 
              ? 'h-[calc(100vh-8rem)]' 
              : 'h-[500px]'
          } overflow-y-auto`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quick Diet Selection */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Diet Selection</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['cut', 'bulk', 'regular'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDietType(type)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        dietType === type 
                          ? 'bg-red-600 text-white shadow-lg scale-105' 
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Ranges */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Custom Macros</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Protein</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={proteinRange}
                          onChange={(e) => setProteinRange(e.target.value)}
                          className="w-full rounded-md border-gray-300 pl-3 pr-8 py-2 focus:border-red-500 focus:ring focus:ring-red-200"
                          min="0"
                          max="200"
                          placeholder="0-200"
                        />
                        <span className="absolute right-3 top-2 text-gray-500 text-sm">g</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={caloriesRange}
                          onChange={(e) => setCaloriesRange(e.target.value)}
                          className="w-full rounded-md border-gray-300 pl-3 pr-12 py-2 focus:border-red-500 focus:ring focus:ring-red-200"
                          min="100"
                          max="4000"
                          placeholder="100-4000"
                        />
                        <span className="absolute right-3 top-2 text-gray-500 text-sm">kcal</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Carbs</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={carbsRange}
                          onChange={(e) => setCarbsRange(e.target.value)}
                          className="w-full rounded-md border-gray-300 pl-3 pr-8 py-2 focus:border-red-500 focus:ring focus:ring-red-200"
                          min="0"
                          max="3000"
                          placeholder="0-3000"
                        />
                        <span className="absolute right-3 top-2 text-gray-500 text-sm">g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium shadow-md"
              >
                Generate Recipe
              </button>
            </form>

            {recipe && (
              <div className="mt-6 space-y-4">
                <div className="flex flex-col space-y-3 p-4">
                  <div className="self-end bg-red-600 text-white p-4 rounded-lg rounded-tr-none max-w-[80%] shadow-md">
                    <p className="font-medium mb-2">Your Preferences:</p>
                    <ul className="space-y-1">
                      <li>🥩 Protein: {proteinRange}g</li>
                      <li>🔥 Calories: {caloriesRange}kcal</li>
                      <li>🍚 Carbs: {carbsRange}g</li>
                      <li>📋 Diet Type: {dietType}</li>
                    </ul>
                  </div>
                  <div className="self-start bg text-black bg-gray-100 p-4 rounded-lg rounded-tl-none max-w-[80%] shadow-md">
                    <p className="whitespace-pre-wrap ">{recipe}</p>
                  </div>
                  <div className='bg-red-500 shadow-lg cursor-pointer w-[80%] rounded-lg text-center flex text-white p-2 font-bold hover:bg-red-600 transition-all duration-3 00'>
                  Place an order for this recipe
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeChatbot;