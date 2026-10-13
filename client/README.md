Chatty

A real-time chat app with public rooms, passcode-protected private rooms, auto-deleting messages, and an admin role. Built with the MERN stack and Socket.io.

Features
Register and log in with JWT authentication and bcrypt-hashed passwords
Real-time messaging with Socket.io
Typing indicators and a live list of who is online in each room
Public rooms that anyone can see and join
Private rooms that stay hidden from room lists and are joined by typing the exact room name and a passcode (the passcode is hashed like a password)
Messages in public rooms are deleted automatically after 24 hours; private rooms can choose to auto-delete or keep messages
Users can delete their own messages, private room owners can delete any message in their room, and owners can delete their room
Admin role that can delete any message or room
Messages and rooms disappear live for everyone when they are deleted
Responsive layout that works on phones