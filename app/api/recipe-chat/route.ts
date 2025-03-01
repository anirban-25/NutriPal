// app/api/recipe-chat/route.ts
import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
});

export async function POST(request: Request) {
  const { userId, proteinRange, caloriesRange, carbsRange, dietType } = await request.json();

  // Fetch user's medical data
  const medicalFormsRef = collection(db, 'users', userId, 'medicalForms');
  const q = query(medicalFormsRef);
  const querySnapshot = await getDocs(q);
  const medicalData = querySnapshot.docs[0]?.data();

  // Prepare the prompt for Groq
  const prompt = `
    Create a recipe based on the following details:
    - Protein Range: ${proteinRange}g
    - Calories Range: ${caloriesRange}kcal
    - Carbs Range: ${carbsRange}g
    - Diet Type: ${dietType}
    - Allergies: ${medicalData?.allergies || 'None'}
    - Medical History: ${medicalData?.medicalHistory || 'None'}
    - Current Medications: ${medicalData?.currentMedications || 'None'}
    - Gender: ${medicalData?.gender || 'Not specified'}
    - Height: ${medicalData?.height || 'Not specified'}
    - Weight: ${medicalData?.weight || 'Not specified'}
  `;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
    max_tokens: 1024,
  });

  return NextResponse.json({ 
    response: completion.choices[0]?.message?.content || '' 
  });
}