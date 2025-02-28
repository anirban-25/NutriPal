"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { getAuth, onAuthStateChanged, User } from "@firebase/auth";
import { app, db } from "@/firebase";
import { doc, getDoc, setDoc, collection, orderBy, query, getDocs } from "firebase/firestore";
import UserInfo from "@/botComponent/UserInfo";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

interface MedicalRecord {
  allergies: string;
  currentMedications: string;
  dateOfBirth: string;
  fileURLs: string[];
  gender: string;
  weight: number;
  height: number;
  medicalHistory: string;
  timestamp: string;
}

export default function ChatWindow() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), setUser);
    return () => unsubscribe();
  }, []);

  // Fetch medical records and conversation history when user logs in
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch medical records
        const medicalDocRef = doc(db, "users", user.uid, "medicalForms", "userdata");
        const medicalSnapshot = await getDoc(medicalDocRef);
        const medicalData = medicalSnapshot.data() as MedicalRecord;

        // Fetch conversation history
        const conversationsRef = collection(db, "users", user.uid, "conversations");
        const q = query(conversationsRef, orderBy("timestamp"));
        const conversationSnapshot = await getDocs(q);
        
        let conversationHistory: Message[] = [];
        
        if (medicalData) {
          const systemMessage = createSystemMessage(medicalData);
          conversationHistory.push(systemMessage);
        }

        if (!conversationSnapshot.empty) {
          conversationSnapshot.forEach((doc) => {
            conversationHistory.push(doc.data() as Message);
          });
        } else if (medicalData) {
          // If no conversation history exists, add greeting
          const greeting: Message = {
            role: "assistant",
            content: "Hello! I'm your medical assistant. How can I help you today?",
            timestamp: Date.now()
          };
          conversationHistory.push(greeting);
          
          // Store the greeting in Firestore
          await setDoc(doc(conversationsRef, Date.now().toString()), greeting);
        }

        setMessages(conversationHistory);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createSystemMessage = (record: MedicalRecord): Message => {
    const dob = new Date((record.dateOfBirth as any).seconds * 1000);
    const age = Math.floor((Date.now() - dob.getTime()) / (31557600000));

    return {
      role: "system",
      content: `Medical Context:
        Patient Information:
        - Age: ${age} years
        - Gender: ${record.gender}
        - Weight: ${record.weight}
        - Height: ${record.height}
        - Allergies: ${record.allergies}
        - Current Medications: ${record.currentMedications}
        - Medical History: ${record.medicalHistory}`,
      timestamp: Date.now()
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now()
    };

    setInput("");
    setIsLoading(true);
    setMessages(prev => [...prev, userMessage]);

    try {
      // Store user message in Firestore
      const conversationsRef = collection(db, "users", user.uid, "conversations");
      await setDoc(doc(conversationsRef, userMessage.timestamp.toString()), userMessage);

      // Get chatbot response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Groq');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: Date.now()
      };

      // Store assistant message in Firestore
      await setDoc(doc(conversationsRef, assistantMessage.timestamp.toString()), assistantMessage);

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex bg-[#171717]">
      {/* Sidebar */}
      <div className="w-1/4 h-full border-r border-gray-800 shadow-sm overflow-x-scroll">
        <div className="p-4 h-full overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Patient Profile</h2>
            <UserInfo user={user} onLogout={() => setUser(null)} />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-black bg-[#323232] p-4 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-100">Medical Assistant Chat</h1>
          <p className="text-sm text-gray-300">Get personalized medical assistance and information</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-sm ${
                message.role === "user" ? "bg-red-600 text-gray-200" : " border text-gray-300 border-gray-800"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-black bg-[#323232] p-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-full"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 bg-red-600 text-white rounded-full disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}