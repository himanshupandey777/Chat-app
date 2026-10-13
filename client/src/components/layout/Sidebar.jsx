import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import RoomList from "../rooms/RoomList";
import CreateRoomModal from "../rooms/CreateRoomModal";

const Sidebar = ({
  rooms,
  currentRoom,
  onSelectRoom,
  onAddRoom,
  onJoinRoom,
  onDeleteRoom,
}) => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [joinPasscode, setJoinPasscode] = useState("");
  const [joinError, setJoinError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const room = await onJoinRoom(joinName, joinPasscode);
      setJoinName("");
      setJoinPasscode("");
      setJoinError("");
      onSelectRoom(room); 
    } catch (err) {
      setJoinError(err.response?.data?.message || "Could not join");
    }
  };

  return (
    <div className="sidebar">
      <h2>Chatty</h2>

      <div className="rooms-header">
        <span>Rooms</span>
        <button onClick={() => setShowModal(true)}>+</button>
      </div>

      <RoomList
        rooms={rooms}
        currentRoom={currentRoom}
        onSelectRoom={onSelectRoom}
        onDeleteRoom={onDeleteRoom}
      />

      <form className="join-form" onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="Search and join private room"
          value={joinName}
          onChange={(e) => setJoinName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passcode"
          value={joinPasscode}
          onChange={(e) => setJoinPasscode(e.target.value)}
          required
        />
        <button type="submit">Join</button>
        {joinError && <p className="error">{joinError}</p>}
      </form>

      <div className="sidebar-bottom">
        <span>
          {user.username}
          {user.isAdmin && " (admin)"}
        </span>
        <button onClick={logout}>Logout</button>
      </div>

      {showModal && (
        <CreateRoomModal
          onAddRoom={onAddRoom}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;