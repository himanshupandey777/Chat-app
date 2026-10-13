import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { useAuth } from "../../context/AuthContext";

const MessageList = ({ messages, canDelete, onDelete }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <MessageItem
          key={msg._id}
          message={msg}
          isMine={msg.sender._id === user._id}
          canDelete={canDelete(msg)}
          onDelete={onDelete}
        />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default MessageList;