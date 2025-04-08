import socket from 'socket.io-client';

let socketinstance = null;

export const initializeSocket = (projectId, token) => {
    if (!socketinstance) { // Prevent multiple instances
        socketinstance = socket('http://localhost:4000/', {
            auth: { token },
            query: { projectId }
        });
    }
    return socketinstance;
};

export const receiveMessage = (eventName, cb) => {
    if (socketinstance) {
        socketinstance.on(eventName, cb);
    }
};

export const sendMessage = (eventName, data) => {
    if (socketinstance) { 
        socketinstance.emit(eventName, data);
    }
};
