import { useState, useEffect } from "react";
import { getRooms, createRoom, joinPrivateRoom } from "../services/roomService";
import { useSocket } from "./useSocket";

export const useRooms = () => {
  const socket = useSocket();
  const [rooms, setRooms] = useState([]);

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  
  useEffect(() => {
    if (!socket) return;
    socket.on("roomsChanged", loadRooms);
    return () => socket.off("roomsChanged", loadRooms);
  }, [socket]);

  const addRoom = async (roomData) => {
    const newRoom = await createRoom(roomData);
    await loadRooms();
    return newRoom;
  };

  const joinRoomByName = async (name, passcode) => {
    const room = await joinPrivateRoom(name, passcode);
    await loadRooms();
    return room;
  };

  return { rooms, addRoom, joinRoomByName };
};