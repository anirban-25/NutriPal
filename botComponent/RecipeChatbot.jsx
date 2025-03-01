import { app } from '@/firebase';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const RecipeChatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
    const [userId, setUserId] = useState(null);
  const [proteinRange, setProteinRange] = useState('');
  const [caloriesRange, setCaloriesRange] = useState('');
  const router = useRouter();
  const [carbsRange, setCarbsRange] = useState('');
  const [dietType, setDietType] = useState('');
  const [recipe, setRecipe] = useState('');
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
  const handleSubmit = async () => {
    e.preventDefault();
    const response = await fetch('/api/recipe-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        proteinRange,
        caloriesRange,
        carbsRange,
        dietType,
      }),
    });
    const data = await response.json();
    setRecipe(data.response);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        💬
      </button>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-lg w-96 p-6">
          <h2 className="text-lg font-bold mb-4">Chatbot</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Protein Range (0-200g)</label>
              <input
                type="number"
                value={proteinRange}
                onChange={(e) => setProteinRange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
                max="200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Calories Range (100-4000kcal)</label>
              <input
                type="number"
                value={caloriesRange}
                onChange={(e) => setCaloriesRange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="100"
                max="4000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Carbs Range (0-3000g)</label>
              <input
                type="number"
                value={carbsRange}
                onChange={(e) => setCarbsRange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
                max="3000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Surprise Me?</label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select</option>
                <option value="cut">Cut</option>
                <option value="bulk">Bulk</option>
                <option value="regular">Regular</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              Submit
            </button>
          </form>
          {recipe && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold">Generated Recipe:</h3>
              <p>{recipe}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeChatbot;