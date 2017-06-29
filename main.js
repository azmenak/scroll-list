import React from 'react';
import _ from 'lodash';
import Faker from 'faker';
import { createStore } from 'redux';
import { connect } from 'react-redux';

const fakeData = [];
_.times(1000, () => {
  fakeData.push(Faker.fake('{{name.lastName}}, {{name.firstName}}'));
});

const app = {
  rowHeight: 30,
  fetch(indices) {
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(indices.map(i => fakeData[i % 1000]));
      }, _.random(100, 500));
    });
  },
};

const defaultState = {
  offset: 0,
  size: 500,
  list: [],
};

const RECEIVE_NAMES = 'RECEIVE_NAMES';
const SET_OFFSET = 'SET_OFFSET';

const listApp = (state, action) => {
  switch (action.type) {
  case RECEIVE_NAMES:
    const newList = state.list.slice();
    action.indicies.forEach((index, i) => {
      newList[index] = action.result[i];
    });
    return Object.assign({}, state, {
      list: newList,
    });
  case SET_OFFSET:
    return Object.assign({}, state, {
      offset: action.offset,
    });
  default:
    return state;
  }
};

export const store = createStore(listApp, defaultState);

const queueUpdate = _.throttle(() => {
  const { offset, size } = store.getState();
  const count = Math.ceil(window.innerHeight / app.rowHeight);
  const a = Math.floor(offset / app.rowHeight);
  update(_.range(Math.min(count, size - a)).map(i => i + a));
}, 200);

const update = indicies => {
  const uncachedIndicies = indicies.filter(i => !store.getState().list.includes(i));
  app.fetch(uncachedIndicies).then(result => {
    store.dispatch({
      type: RECEIVE_NAMES,
      indicies,
      result,
    });
  });
}

export class Row extends React.Component {
  render() {
    const { i, name } = this.props;
    return <div className="row">{i}: {name || 'Loading...'}</div>;
  }
}


class DisconnectedList extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', () => {
      const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (offset !== this.props.offset) {
        this.props.dispatch({
          type: SET_OFFSET,
          offset,
        });
        queueUpdate();
      }
    });
    queueUpdate();
  }

  render() {
    const { offset, list, size } = this.props;

    const count = Math.ceil(window.innerHeight / app.rowHeight);
    let a = Math.floor(offset / app.rowHeight);
    let b = Math.max(0, size - a - count);

    const rows = _.map(_.range(Math.min(count, size - a)), (i) => {
      i+= a;
      return <Row key={i} i={i} name={list[i]} />;
    });

    return (
      <div>
        <div style={{ height: `${a * app.rowHeight}px` }} />
        <div>{rows}</div>
        <div style={{ height: `${b * app.rowHeight}px` }} />
      </div>
    );
  }
}

export const List = connect(state => state)(DisconnectedList);
