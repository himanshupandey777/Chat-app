import { useState, useRef } from "react";

const MessageInput = ({ onSend, onTyping, onStopTyping }) => {
  const [text, setText] = useState("");
  const timerRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping();
    
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onStopTyping, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
    clearTimeout(timerRef.current);
    onStopTyping();
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={handleChange}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;