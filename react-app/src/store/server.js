import { csrfFetch } from './csrf'

const SET_SERVER = 'server/SET_SERVER'

const setServer = (server) => {
  return{
    type: SET_SERVER,
    payload:server
  }
}

export const setServers = () => async (dispatch) => {
  const res = await csrfFetch('/api/servers', {
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
    default:
      return state;
    }
}

export default serverReducer;

