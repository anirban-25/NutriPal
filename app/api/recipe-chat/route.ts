// app/api/recipe-chat/route.ts
import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
});

export async function POST(request: Request) {
  const { userId, promptDetails } = await request.json();

  // Fetch user's medical data
  const medicalFormsRef = collection(db, 'users', userId, 'medicalForms');
  const q = query(medicalFormsRef);
  const querySnapshot = await getDocs(q);
  const medicalData = querySnapshot.docs[0]?.data();

  // Prepare the prompt for Groq
  const prompt = `
    Create a recipe based on the following details:
    ${promptDetails}
    - Allergies: ${medicalData?.allergies || 'None'}
    - Medical History: ${medicalData?.medicalHistory || 'None'}
    - Current Medications: ${medicalData?.currentMedications || 'None'}
    - Gender: ${medicalData?.gender || 'Not specified'}
    - Height: ${medicalData?.height || 'Not specified'}
    - Weight: ${medicalData?.weight || 'Not specified'}
    
    make sure the recipe you create does not include any ingredients that the user is allergic to or any ingredients that are not good for the user's health according to the user's medical history and current medications
    make sure the recipe is healthy and nutritious and easy to make and not too complicated , also you must state the macros in the end. STATE THE MACROS YOUR RECIPE INCLUDES, NOT THE ONE YOU HAVE BEEN GIVEN AS PROMPT
  `;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
  });

  return NextResponse.json({ 
    response: completion.choices[0]?.message?.content || '' 
  });
}