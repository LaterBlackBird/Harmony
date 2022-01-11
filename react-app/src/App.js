import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import ServerPage from './components/ServersPage';
import ServerByIdPage from './components/ServerByIdPage';
import CreateServerPage from './components/CreateServerPage';
import User from './components/User';
import Messages from './components/Messages';
import Message from './components/Message';
import ChannelsList from './components/ChannelsPage';
import CreateChannel from './components/CreateChannelForm';
import EditChannel from './components/EditChannelForm';
import { authenticate } from './store/session';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <Route path='/servers' exact={true}>
          <ServerPage />
        </Route>
        <Route exact path='/servers/:serverId/channels'>
          <ChannelsList />
        </Route>
        <Route path='/servers/:serverId/channels/:channelId/edit'>
          <EditChannel />
        </Route>
        <Route path='/servers/:serverId/channels/new'>
          <CreateChannel />
        </Route>
        <Route path='/servers/new' exact={true}>
          <CreateServerPage />
        </Route>
        <Route path='/servers/:id' exact={true}>
          <ServerByIdPage />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>
        <ProtectedRoute path='/channels/:channelId/messages' exact={true} >
          <Messages />
        </ProtectedRoute>
        <ProtectedRoute path='/messages/:messageId' exact={true} >
          <Message />
        </ProtectedRoute>
        <ProtectedRoute path='/' exact={true} >
          <h1>My Home Page</h1>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
