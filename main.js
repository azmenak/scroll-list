const React = require('react');
const Immutable = require('immutable');
const _ = require('lodash');
const Faker = require('faker');

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
      }, _.random(30, 200));
    });
  },
};

const store = {
  offset: 0,
  size: 500,
  list: [],
};

export class Row extends React.Component {
  componentDidMount() {
    const { i, list } = this.props;
    if (list[i]) return;
    this.props.update([ this.props.i ]);
  }

  render() {
    const { i, list } = this.props;
    return <div className="row">{i}: {list[i]}</div>;
  }
}

export class List extends React.Component {
  constructor() {
    super();
    this.state = store;
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.setState({ offset });
    });
  }

  update(indicies) {
    app.fetch(indicies).then((res) => {
      indicies.forEach((index, i) => {
        store.list[index] = res[i];
        this.setState({ list: store.list });
      });
    });
  }

  render() {
    const { offset, size, list } = this.state;

    const count = Math.ceil(window.innerHeight / app.rowHeight);
    let a = Math.floor(offset / app.rowHeight);
    let b = Math.max(0, size - a - count);

    const rows = _.map(_.range(Math.min(count, size - a)), (i) => {
      i+= a;
      return <Row key={i} i={i} list={list} update={this.update} />;
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
