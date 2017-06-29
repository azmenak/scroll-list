import React from 'react';
import ReactDOM from 'react-dom';
import { List, store } from './main';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <List />
  </Provider>,
  document.getElementById('entry')
);
