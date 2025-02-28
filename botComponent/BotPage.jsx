"use client";
import React, { useState, useEffect } from 'react';
import { onAuthStateChangedListener } from './auth';
import UserInfo from './UserInfo';
import ChatBotIcon from '../botComponent/ChatBotIcon';
const BotPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      console.log("Auth state changed:", user);
      setUser(user);
    });

    return () => {
      console.log("Unsubscribing from auth listener");
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <UserInfo user={user} onLogout={handleLogout} />
      <ChatBotIcon />
        
    </div>
  );
};

export default BotPage;
