import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import TypingIndicator from "../components/chat/TypingIndicator";
import { useRooms } from "../hooks/useRooms";
import { useMessages } from "../hooks/useMessages";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";
import { deleteRoom, deleteMessage } from "../services/roomService";

const Chat = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const { rooms, addRoom, joinRoomByName } = useRooms();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showOnline, setShowOnline] = useState(false);

  const {
    messages,
    onlineUsers,
    typingUser,
    sendMessage,
    startTyping,
    stopTyping,
  } = useMessages(currentRoom ? currentRoom._id : null);


  useEffect(() => {
    if (!socket) return;
    const handleRoomDeleted = (roomId) => {
      if (currentRoom && currentRoom._id === roomId) setCurrentRoom(null);
    };
    socket.on("roomDeleted", handleRoomDeleted);
    return () => socket.off("roomDeleted", handleRoomDeleted);
  }, [socket, currentRoom]);

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteRoom(roomId);
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete room");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete message");
    }
  };
    useEffect(() => {
    setShowOnline(false);
  }, [currentRoom]);

  
  const isRoomOwner =
    currentRoom && currentRoom.isPrivate && currentRoom.createdBy === user._id;
  const canDeleteMessage = (msg) =>
    user.isAdmin || isRoomOwner || msg.sender._id === user._id;

  

  return (
     <div className={currentRoom ? "chat-layout in-room" : "chat-layout"}>
      <Sidebar
        rooms={rooms}
        currentRoom={currentRoom}
        onSelectRoom={setCurrentRoom}
        onAddRoom={addRoom}
        onJoinRoom={joinRoomByName}
        onDeleteRoom={handleDeleteRoom}
      />

      <div className="chat-main">
        {currentRoom ? (
          <>
              <div className="chat-header">
              <button className="back-btn" onClick={() => setCurrentRoom(null)}>
                ←
              </button>
              <h3>
                {currentRoom.isPrivate ? "🔒 " : "# "}
                {currentRoom.name}
              </h3>
              <button
                className="online-toggle"
                onClick={() => setShowOnline(!showOnline)}
              >
                {onlineUsers.length} online
              </button>
            </div>
            <MessageList
              messages={messages}
              canDelete={canDeleteMessage}
              onDelete={handleDeleteMessage}
            />
            <TypingIndicator name={typingUser} />
            <MessageInput
              onSend={sendMessage}
              onTyping={startTyping}
              onStopTyping={stopTyping}
            />
          </>
        ) : (
          <p className="empty">Select a room to start chatting</p>
        )}
      </div>

      {currentRoom && (
         <div className={showOnline ? "online-panel open" : "online-panel"}>
          <h4>Online</h4>
          {onlineUsers.map((name, index) => (
            <div key={index} className="online-user">
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chat;