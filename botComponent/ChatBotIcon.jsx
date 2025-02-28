"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { getAuth } from 'firebase/auth';
import { app } from '@/firebase';
import styled from 'styled-components';

const IconButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  border: none;
  border-radius: 50%;
  padding: 15px;
  cursor: pointer;
  background: radial-gradient(circle at top left, #ffffff, #e0f7fa);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2), inset 0 6px 12px rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  opacity: 0.9;

  &:hover {
    background: radial-gradient(circle at top left, #ffffff, #b3e5fc);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2), inset 0 8px 16px rgba(255, 255, 255, 0.4);
    transform: translateY(-4px);
    opacity: 1;
  }
`;

const ChatBotIcon = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleClick = () => {
    if (isLoggedIn) {
      router.push('/ChatWindow');
    } else {
      router.push('/login');
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 cursor-pointer rounded-full"
      onClick={handleClick}
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
    >
      <IconButton>
        <img
          src="https://easuk.co.uk/wp-content/uploads/2023/05/healthcare-01.png"
          alt="Chatbot Icon"
          width="40"
          height="40"
        />
      </IconButton>
    </div>
  );
};

export default ChatBotIcon;
