import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { db } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "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"
});

// Maximum number of previous messages to include for context
const MAX_CONTEXT_MESSAGES = 10;

// Define interfaces for type safety
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  userId?: string;
}

// Helper function to clean messages for Groq API
function cleanMessageForGroq(message: Message): GroqMessage {
  const { role, content } = message;
  return { role, content };
}

export async function POST(req: Request) {
  try {
    const { messages, userId }: ChatRequest = await req.json();

    // If no userId is provided, proceed with just the current messages
    if (!userId) {
      const cleanedMessages = messages.map(cleanMessageForGroq);
      const completion = await groq.chat.completions.create({
        messages: cleanedMessages,
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 1024,
      });

      return NextResponse.json({ 
        response: completion.choices[0]?.message?.content || '' 
      });
    }

    // Fetch recent conversation history from Firestore
    const conversationsRef = collection(db, "users", userId, "conversations");
    const q = query(conversationsRef, orderBy("timestamp", "desc"));
    const conversationSnapshot = await getDocs(q);

    let conversationHistory: Message[] = [];
    
    // Extract messages from Firestore
    conversationSnapshot.forEach(doc => {
      const message = doc.data() as Message;
      // Only include user and assistant messages, not system messages
      if (message.role !== 'system') {
        conversationHistory.unshift({
          role: message.role,
          content: message.content
        });
      }
    });

    // Find the system message (medical context) from the current messages
    const systemMessage = messages.find(msg => msg.role === 'system');
    
    // Construct the context for the AI
    let contextMessages: Message[] = [];
    
    // Always include system message first if it exists
    if (systemMessage) {
      contextMessages.push(systemMessage);
    }
    
    // Add recent conversation history (limited to MAX_CONTEXT_MESSAGES)
    // We're getting the most recent messages before the current one
    const recentHistory = conversationHistory.slice(-MAX_CONTEXT_MESSAGES);
    contextMessages = [...contextMessages, ...recentHistory];

    // Add the current message
    const currentMessage = messages[messages.length - 1];
    contextMessages.push(currentMessage);

    // Clean messages before sending to Groq
    const cleanedMessages = contextMessages.map(cleanMessageForGroq);

    // Create the completion with the full context
    const completion = await groq.chat.completions.create({
      messages: cleanedMessages,
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}