import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import server from './server'
import channelReducer from './channel';
import messageReducer from './message';
import conversationReducer from './conversation';
import directMessageReducer from './direct_message';

const rootReducer = combineReducers({
  session,
  server,
  channel: channelReducer,
  message: messageReducer,
  conversation: conversationReducer,
  direct_message: directMessageReducer,
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
