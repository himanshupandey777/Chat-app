const TypingIndicator = ({ name }) => {
  return <div className="typing">{name ? `${name} is typing...` : ""}</div>;
};

export default TypingIndicator;