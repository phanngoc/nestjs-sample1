import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const ENDPOINT = 'http://localhost:3000';

export function getOrSetFromLocalStorage(key) {
    let valueId = localStorage.getItem(key);
    if (!valueId) {
        valueId = uuidv4();
      localStorage.setItem(key, valueId);
    }
    return valueId;
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