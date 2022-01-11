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
import EditServerPage from './components/EditServerPage';
import User from './components/User';
import Messages from './components/MessagesPage';
import Message from './components/MessagesEditForm';
import ChannelsList from './components/ChannelsPage';
import CreateChannel from './components/CreateChannelForm';
import EditChannel from './components/EditChannelForm';
import { authenticate } from './store/session';

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
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <div id='main_page'>
          <Route path='/servers' exact={true}>
            <NavBar />
            <ServerPage />
            <ChannelsList />
          </Route>
          <Route path='/servers/new' exact={true}>
            <CreateServerPage />
          </Route>
          <Route path='/servers/edit/:id' exact={true}>
            <EditServerPage />
          </Route>
          <Route path='/servers/:id' exact={true}>
            <ServerByIdPage />
          </Route>
          <Route exact path='/servers/:serverId/channels'>
            <NavBar />
            <ServerPage />
            <ChannelsList />
          </Route>
          <Route path='/servers/:serverId/channels/:channelId/edit'>
            <EditChannel />
          </Route>
          <Route path='/servers/:serverId/channels/new'>
            <CreateChannel />
          </Route>
          <ProtectedRoute path='/users' exact={true} >
            <UsersList />
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
        </div>
        <ProtectedRoute path='/' exact={true} >
          <h1>My Home Page</h1>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter >
  );
}

export default App;
