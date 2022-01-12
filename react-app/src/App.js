import React, { useState, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import ServerPage from './components/ServersPage';
import ServerByIdPage from './components/ServerByIdPage';
import CreateServerPage from './components/CreateServerPage';
import EditServerPage from './components/EditServerPage';
import User from './components/User';
import Messages from './components/MessagesPage';
import Message from './components/MessagesEditForm';
import ChannelsList from './components/ChannelsPage';
import CreateChannel from './components/CreateChannelForm';
import EditChannel from './components/EditChannelForm';
import { authenticate } from './store/session';
import { io } from 'socket.io-client';

let socket;
socket = io();

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute exact path='/' >
          <Redirect to='/servers' />
        </ProtectedRoute>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/servers/new' exact={true}>
          <CreateServerPage />
        </ProtectedRoute>
        <ProtectedRoute path='/servers/edit/:id' exact={true}>
          <EditServerPage />
        </ProtectedRoute>
        <ProtectedRoute path='/servers/:id' exact={true}>
          <ServerByIdPage />
        </ProtectedRoute>
        <ProtectedRoute path='/servers/:serverId/channels/:channelId/edit'>
          <EditChannel />
        </ProtectedRoute>
        <ProtectedRoute path='/servers/:serverId/channels/new'>
          <CreateChannel />
        </ProtectedRoute>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>


        <div id='main_page'>
          <ProtectedRoute path='/servers' exact={true}>
            <NavBar />
            <ServerPage />
            <ChannelsList />
          </ProtectedRoute>
          <ProtectedRoute exact path='/servers/:serverId/channels'>
            <NavBar />
            <ServerPage />
            <ChannelsList />
          </ProtectedRoute>
          <ProtectedRoute path='/servers/:serverId/channels/:channelId/messages' exact={true} >
            <NavBar />
            <ServerPage />
            <ChannelsList />
            <Messages socket={socket} />
          </ProtectedRoute>
          <ProtectedRoute path='/messages/:messageId' exact={true} >
            <Message socket={socket} />
          </ProtectedRoute>
        </div>

      </Switch>
      {() => { socket.disconnect() }}
    </BrowserRouter >
  );
}

export default App;
