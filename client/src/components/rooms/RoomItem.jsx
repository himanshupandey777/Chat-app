import { useAuth } from "../../context/AuthContext";

const RoomItem = ({ room, isActive, onSelect, onDelete }) => {
  const { user } = useAuth();

  
  const canDelete = user.isAdmin || room.createdBy === user._id;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete room "${room.name}" and all its messages?`)) {
      onDelete(room._id);
    }
  };

  return (
    <div
      className={isActive ? "room-item active" : "room-item"}
      onClick={() => onSelect(room)}
    >
      <span>
        {room.isPrivate ? "🔒 " : "# "}
        {room.name}
      </span>
      {canDelete && (
        <button className="delete-btn" onClick={handleDelete}>
          x
        </button>
      )}
    </div>
  );
};

export default RoomItem;