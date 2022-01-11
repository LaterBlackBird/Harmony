import { csrfFetch } from './csrf'

const SET_SERVER = 'server/SET_SERVER'
const GET_SERVER = 'server/GET_SERVER'
const CREATE_SERVER = 'server/CREATE_SERVER'

const createServer = (server) => {
  return{
    type: CREATE_SERVER,
    payload: server
  }
}

const setServer = (server) => {
  return{
    type: SET_SERVER,
    payload:server
  }
}

const getServer = (server) => {
  return{
    type: GET_SERVER,
    payload: server
  }
}

export const createAServer = (server) => async (dispatch) => {
  const { server_name, server_image } = server;
  const res = await fetch('/api/servers/', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      server_name,
      server_image
    })
  })

  if(res.ok){
    const data = await res.json()
    dispatch(createServer(data))
    return data
  }
  else if (res.status < 500){
    const data = await res.json()
    if(data.errors) return data.errors
  }
  else {
    return ['An error occurred. Please try again']
  }
}

export const getOneServer = (id) => async (dispatch) => {
  const res = await fetch(`/api/servers/${id}`, {
    method: 'GET'
  })
  const data = await res.json()
  dispatch(getServer(data.server))
}

export const setServers = () => async (dispatch) => {
  const res = await fetch('/api/servers', {
    method: 'GET'
  })

  const data = await res.json()

  dispatch(setServer(data.servers))
}


const serverReducer = (state = {}, action) => {
  let newState;
  switch(action.type) {
    case SET_SERVER:
      newState = {...action.payload};
      return newState;
    case GET_SERVER:
      newState = {...state, ...action.payload}
      return newState
    case CREATE_SERVER:
      newState = {...state, ...action.payload}
      return newState
    default:
      return state;
    }
}

export default serverReducer;

