import api from "./api";

export const getRooms = async () => {
  const res = await api.get("/rooms");
  return res.data;
};

export const createRoom = async (roomData) => {
  const res = await api.post("/rooms", roomData);
  return res.data;
};

export const joinPrivateRoom = async (name, passcode) => {
  const res = await api.post("/rooms/join", { name, passcode });
  return res.data;
};

export const deleteRoom = async (roomId) => {
  await api.delete(`/rooms/${roomId}`);
};

export const getMessages = async (roomId) => {
  const res = await api.get(`/messages/${roomId}`);
  return res.data;
};

export const deleteMessage = async (messageId) => {
  await api.delete(`/messages/${messageId}`);
};