import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  padding: 10px;
  border-left: 1px solid #ccc;
  width: 20%;
  overflow-y: auto;
`;

const ChatItem = styled.div`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ccc;

  &:hover {
    background-color: #f0f9f0;
  }
`;

const ChatList = ({ chats, onSelectChat }) => (
  <ListContainer>
    {chats.map((chat, index) => (
      <ChatItem key={index} onClick={() => onSelectChat(chat)}>
        {chat.name}
      </ChatItem>
    ))}
  </ListContainer>
);

export default ChatList;
