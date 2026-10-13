
export const canAccessRoom = (room, user) => {
  if (!room.isPrivate) return true;
  if (user.isAdmin) return true; 
  return room.members.some((id) => id.equals(user._id));
};