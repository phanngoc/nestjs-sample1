
export const SET_LOGIN = 'SET_LOGIN';
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
export const SET_USER = 'SET_USER';
export const SET_THREADS = 'SET_THREADS';
export const SET_ACTIVE_THREAD = 'SET_ACTIVE_THREAD';
export const SET_MESSAGES = 'SET_MESSAGES';
// set socket
export const SET_SOCKET = 'SET_SOCKET';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

const setIsLogin = (item) => {
  return { type: SET_LOGIN, payload: item };
};

// set access token
const setAccessToken = (access_token) => {
  return { type: SET_ACCESS_TOKEN, payload: access_token };
};

// set user
const setUser = (user) => {
  return { type: SET_USER, payload: user };
};

// set threads
const setThreads = (threads) => {
  return { type: SET_THREADS, payload: threads };
};

// set active thread
const setActiveThreadId = (threadId) => {
  return { type: SET_ACTIVE_THREAD, payload: threadId };
};

// set setMessages
const setMessages = (messages) => {
  return { type: SET_MESSAGES, payload: messages };
};

// set socket
const setSocket = (socket) => {
  return { type: SET_SOCKET, payload: socket };
};

// RECEIVE_MESSAGE
const receiveMessage = (message) => {
  return { type: RECEIVE_MESSAGE, payload: message };
};

export { setIsLogin, setAccessToken, setUser, setThreads, setActiveThreadId, setMessages,
  setSocket, receiveMessage};