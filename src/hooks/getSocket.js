// socketService.js
// import { io } from 'socket.io-client';

// let socket;

// export const connectSocket = () => {
// 	socket = io('https://crm.solutionprovider.com.bd', {
// 		path: '/socket.io',
// 		reconnectionDelay: 1000,
// 		reconnection: true,
// 		reconnectionAttempts: 10,
// 		transports: ['websocket'],
// 		agent: false,
// 		upgrade: false,
// 		rejectUnauthorized: false,
// 	});

// 	return socket;
// };

// export const getSocket = () => connectSocket();


import { io } from "socket.io-client";
 
let socket = null; // ✅ Global socket instance

export const connectSocket = () => {
  if (!socket) {  // ✅ Prevent multiple connections
    socket = io('https://crm.solutionprovider.com.bd', {
      path: '/socket.io',
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    });

    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("disconnect", (reason) => console.log("⚠️ Socket disconnected:", reason));
    socket.on("connect_error", (error) => console.log("❌ Socket connection error:", error));
  }

  return socket; // ✅ Always return the same instance
};

export const getSocket = () => socket || connectSocket(); // ✅ Return existing socket or create new
