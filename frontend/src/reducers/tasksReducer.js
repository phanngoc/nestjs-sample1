// tasksReducer.js
import { SET_LOGIN, SET_ACCESS_TOKEN, SET_USER, SET_THREADS, 
    SET_ACTIVE_THREAD, SET_MESSAGES, SET_SOCKET, RECEIVE_MESSAGE } from '../actions/login';

export const initialState = {
  isLogin: false,
  accessToken: null,
  user: null,
  threads: [],
  activeThreadId: null,
  messages: [],
  socket: null
};

export function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN:
      return {...state, isLogin: action.payload};
    case SET_ACCESS_TOKEN:
      return {...state, access_token: action.payload};
    case SET_USER:
      return {...state, user: action.payload};
    case SET_THREADS:
      return {...state, threads: action.payload};
    case SET_ACTIVE_THREAD:
      return {...state, activeThreadId: action.payload};
    case SET_MESSAGES:
      return {...state, messages: action.payload};
    case RECEIVE_MESSAGE:
      return {...state, messages: [...state.messages, action.payload]};
    case SET_SOCKET:
      return {...state, socket: action.payload};
    default:
      return state;
  }
}

export default tasksReducer;