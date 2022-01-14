const SET_SERVER = 'server/SET_SERVER'
const GET_SERVER = 'server/GET_SERVER'
const CREATE_SERVER = 'server/CREATE_SERVER'
const EDIT_SERVER = 'server/EDIT_SERVER'
const DELETE_SERVER = 'server/DELETE_SERVER'
const JOIN_SERVER = 'server/JOIN_SERVER'
const JOIN_ADMIN = 'server/JOIN_ADMIN'

const joinAdmin = (server) => {
  return {
    type: JOIN_ADMIN,
    payload: server
  }
}

const joinServer = (server) => {
  return {
    type: JOIN_SERVER,
    payload: server
  }
}


const deleteServer = () => {
  return {
    type: DELETE_SERVER
  }
}


const editServer = (server) => {
  return {
    type: EDIT_SERVER,
    payload: server
  }
}

const createServer = (server) => {
  return {
    type: CREATE_SERVER,
    payload: server
  }
}

const setServer = (server) => {
  return {
    type: SET_SERVER,
    payload: server
  }
}

const getServer = (server) => {
  return {
    type: GET_SERVER,
    payload: server
  }
}

export const joinAsAdmin = ({ userId, serverId }) => async (dispatch) => {
  const res = await fetch(`/api/servers/${serverId}/add_admin`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId
    })
  })

  if (res.ok) {
    const data = await res.json()
    dispatch(joinAdmin(data))
    return data
  }
  else if (res.status < 500) {
    const data = await res.json()
    if (data.errors) return data.errors
  }
  else {
    return ['An error occurred. Please try again']
  }
}

export const joinAServer = ({ userId, serverId }) => async (dispatch) => {
  const res = await fetch(`/api/servers/${serverId}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId
    })
  })

  if (res.ok) {
    const data = await res.json()
    dispatch(joinServer(data))
    return data
  }
  else if (res.status < 500) {
    const data = await res.json()
    if (data.errors) return data.errors
  }
  else {
    return ['An error occurred. Please try again']
  }
}

export const deleteAServer = (serverId) => async (dispatch) => {
  await fetch(`/api/servers/${serverId}`, {
    method: 'DELETE'
  })
  dispatch(deleteServer())
}

export const editOneServer = (server) => async (dispatch) => {
  const { serverId, server_name, server_image } = server;
  const res = await fetch(`/api/servers/${serverId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      server_name,
      server_image
    })
  })

  if (res.ok) {
    const data = await res.json()
    dispatch(createServer(data))
    return data
  }
  else if (res.status < 500) {
    const data = await res.json()
    if (data.errors) return data.errors
  }
  else {
    return ['An error occurred. Please try again']
  }
}

export const createAServer = (server_name, imageUrl, currentUser) => async (dispatch) => {
  let server_image = imageUrl
  const res = await fetch('/api/servers/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      server_name,
      server_image,
      currentUser
    })
  })

  if (res.ok) {
    const data = await res.json()
    dispatch(createServer(data))
    return data
  }
  else if (res.status < 500) {
    const data = await res.json()
    if (data.errors) return data.errors
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

export const setServers = (userId) => async (dispatch) => {
  const res = await fetch(`/api/servers/user/${userId}`, {
    method: 'GET'
  })

  const data = await res.json()

  dispatch(setServer(data.servers))
}


const serverReducer = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case SET_SERVER:
      console.log(action.payload)
      action.payload.forEach(server => {
        const key = server.id;
        newState[key] = server;
      })
      return newState;
    case GET_SERVER:
      newState = { ...state, ...action.payload }
      return newState
    case CREATE_SERVER:
      newState = { ...state }
      newState[action.payload.id]=action.payload
      return newState
    case JOIN_SERVER:
      newState = { ...state }
      newState[action.payload.id]=action.payload
      return newState
    case JOIN_ADMIN:
      newState = { ...state, ...action.payload }
      return newState
    default:
      return state;
  }
}

export default serverReducer;
