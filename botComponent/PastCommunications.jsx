import React from 'react';
import styled from 'styled-components';
import Message from './Message';

const Container = styled.div`
  padding: 10px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  height: 100%;
`;

const DateHeader = styled.div`
  font-weight: bold;
  margin: 10px 0;
  color: #4CAF50;
`;

const PastCommunications = ({ messages }) => {
  const groupedMessages = messages.reduce((acc, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {});

  return (
    <Container>
      {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          <DateHeader>{date}</DateHeader>
          {groupedMessages[date].map((msg, index) => (
            <Message key={index} text={msg.text} sender={msg.sender} timestamp={msg.timestamp} />
          ))}
        </div>
      ))}
    </Container>
  );
};

export default PastCommunications;
