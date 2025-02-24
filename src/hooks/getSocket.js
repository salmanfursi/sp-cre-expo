

// socketService.js
import { io } from 'socket.io-client';

let socket;

export const connectSocket = () => {
  socket = io('http://192.168.68.108:5000', {
  // socket = io('http://localhost:5000', {
    path: '/socket.io',
    reconnectionDelay: 1000,
    reconnection: true, 
    reconnectionAttempts: 10,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.log('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => connectSocket();
