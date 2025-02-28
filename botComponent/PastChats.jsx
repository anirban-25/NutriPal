import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 25%;
  background: linear-gradient(to top right, #d0f0c0, #ffffff); 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
`;

const ChatItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    background-color: #e6f7e6;
  }
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const PastChats = ({ chats, onSelectChat, onStartNewChat }) => {
  return (
    <Container>
      <Button onClick={onStartNewChat}>Start New Chat</Button>
      <h3>Past Chats</h3>
      {chats.map((chat, index) => (
        <ChatItem key={index} onClick={() => onSelectChat(chat)}>
          {chat.messages[0] ? chat.messages[0].text.substring(0, 30) + '...' : 'New Chat'}
          <br />
          <small>{formatDate(chat.date)}</small>
        </ChatItem>
      ))}
    </Container>
  );
};

export default PastChats;