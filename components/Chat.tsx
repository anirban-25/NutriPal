import React, { useEffect, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import Link from "next/link";
interface Message {
  text: string;
  type: "user" | "bot";
}
interface ChatProps {
  message: string;
}
import { MenuAlt4Icon } from "@heroicons/react/solid";
const Chat: React.FC<ChatProps> = ({ message }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [pythonResult, setPythonResult] = useState(null);

  const handleSendMessage = (): void => {
    if (inputText.trim() === "") {
      return;
    }

    // Simulate sending a message to the bot
    const newMessages: Message[] = [
      ...messages,
      { text: inputText, type: "user" },
    ];
    setMessages(newMessages);
    setInputText("");

    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await fetch("http://localhost:7000/run-python-code");
    //       const data = await response.json();
    //       setPythonResult(data.result);
    //       console.log(setPythonResult);
    //     } catch (error) {
    //       console.error("Error:", error);
    //     }
    //   };

    //   fetchData();
    // }, []);

    // Simulate the bot's response (you can replace this with actual bot logic)
    setTimeout(() => {
      const botResponse: Message = {
        text: "Hi! I am a chatbot. How can I help you?",
        type: "bot",
      };
      setMessages([...newMessages, botResponse]);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-col md:h-screen h-[90vh] justify-between bg-black bg-opacity-80 md:border-black md:border-l-8">
        <p className=" justify-center p-2 font-bold hidden md:flex md:text-2xl text-slate-50">
          START CONVERSATION WITH OUR CHATBOT
        </p>

        <div className="md:hidden flex justify-center font-semibold text-base text-gray-200">
          START CONVERSATION WITH OUR CHATBOT
        </div>
        
        <div className=" p-4 h-5/6 overflow-y-scroll " dir="ltr">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`my-2 ${
                message.type === "bot" ? "text-left" : "text-right"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.type === "bot"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-slate-900 text-white"
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <div className="p-2 border-dashed border-2 border-slate-200 flex justify-between items-center  rounded-md m-2">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className=" mr-2  rounded shadow-sm bg-transparent text-white  flex-1 outline-none"
          />
          <PaperAirplaneIcon
            className="w-10 h-8 rotate-90 cursor-pointer text-slate-200"
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
