import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { setIsLogin, setAccessToken, setUser, setThreads, setUserId,
    setActiveThreadId, setMessages, 
    setSocket} from './actions/login';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000';

export async function authenticationInit() {
  const token = localStorage.getItem('access_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // load info user from server
    const response = await loadInfoUser();
    console.log('authenticationInit:response:', response)
    if (response) {
      return {
        isLogin: true,
        user: response,
        token: token
      };
    }
  }

  return {
    isLogin: false,
    user: null,
    token: null
  };
}

// load thread user join.
export async function loadThreads() {
  try {
    const response = await axios.get(ENDPOINT + '/api/threads');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// send to server check valid access_token
export async function loadInfoUser() {
  try {
    const response = await axios.get(ENDPOINT + '/api/user');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// write code push message to server
export async function postMessage(content, threadId) {
  try {
    const response = await axios.post(ENDPOINT + '/api/messages', { content, threadId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getOrSetFromLocalStorage(key) {
  let valueId = localStorage.getItem(key);
  if (!valueId) {
    valueId = uuidv4();
    localStorage.setItem(key, valueId);
  }
  return valueId;
}

export function connectSocket({ token, onConnect, onMessage }) {
  const socket = socketIOClient(ENDPOINT, {
    query: { token }
  });

  socket.on('connect', () => {
    console.log('Connected to server');
    // socket.emit('messages', { data: 'Hello Server!' });

    if (onConnect) {
      onConnect(socket);
    }
  });

  socket.on('messages', (data) => {
    console.log('Received message:', data);

    if (onMessage) {
      onMessage(data);
    }
  });

  return socket;
}

// fetch messages
export async function fetchMessages(threadId) {
  try {
    const response = await axios.get(ENDPOINT + '/api/messages',
      {
        params: {
          threadId: threadId
        }
      });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// best practice for using reactjs services axios post and update state by dispatch and reducer of reactjs


export async function initDataLoadpage({dispatch, onConnect, onMessage}) {
  const infoUser = await authenticationInit();
  dispatch(setIsLogin(infoUser.isLogin));
  dispatch(setAccessToken(infoUser.token));
  dispatch(setUser(infoUser.user));
  const threads = [];
  // if not login, set userId from local storage
  if (!infoUser.isLogin) {
    const userId = getOrSetFromLocalStorage('userId');
    // dispatch(setUserId(userId));
  } else {
    const threads = await loadThreads();
    dispatch(setThreads(threads));
    dispatch(setActiveThreadId(threads[0].id));
    let socket = connectSocket({ token: infoUser.token, onConnect: onConnect, onMessage: onMessage });
    dispatch(setSocket(socket));

    const responseMessages = await fetchMessages(threads[0].id);
    dispatch(setMessages(responseMessages));
  }
}

export async function postThread(threadId, userId) {
  try {
    const response = await axios.post(ENDPOINT + '/api/threads', { threadId: threadId, userId: userId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function joinThread(socket, threadId) {
  if (socket) {
    console.log('Emit:Joining thread:', threadId);
    socket.emit('joinThread', threadId);
  }
}