import RoomItem from "./RoomItem";

const RoomList = ({ rooms, currentRoom, onSelectRoom, onDeleteRoom }) => {
  return (
    <div>
      {rooms.map((room) => (
        <RoomItem
          key={room._id}
          room={room}
          isActive={currentRoom && currentRoom._id === room._id}
          onSelect={onSelectRoom}
          onDelete={onDeleteRoom}
        />
      ))}
    </div>
  );
};

export default RoomList;