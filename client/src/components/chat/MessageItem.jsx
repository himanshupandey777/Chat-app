const MessageItem = ({ message, isMine, canDelete, onDelete }) => {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={isMine ? "message mine" : "message"}>
      <div className="message-meta">
        {isMine ? "You" : message.sender.username} · {time}
        {canDelete && (
          <button className="delete-btn" onClick={() => onDelete(message._id)}>
            delete
          </button>
        )}
      </div>
      <div className="bubble">{message.text}</div>
    </div>
  );
};

export default MessageItem;