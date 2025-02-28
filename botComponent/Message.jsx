import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  ${({ sender }) => sender === 'user' && `justify-content: flex-end;`}
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px;
  border-radius: 20px;
  background-color: ${({ sender }) => (sender === 'user' ? '#4CAF50' : '#e0e0e0')};
  color: ${({ sender }) => (sender === 'user' ? 'white' : 'black')};
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Message = ({ text, sender, timestamp, photoURL }) => {
  return (
    <Container sender={sender}>
      {sender === 'bot' && photoURL && <ProfileImage src={photoURL} alt="Profile" />}
      <MessageBubble sender={sender}>
        {text}
        <br />
        <small>{new Date(timestamp).toLocaleTimeString()}</small>
      </MessageBubble>
      {sender === 'user' && photoURL && <ProfileImage src={photoURL} alt="Profile" />}
    </Container>
  );
};

export default Message;
