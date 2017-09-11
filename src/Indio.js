import React, { Component } from 'react';
import 'rxjs';
import { Input } from 'semantic-ui-react';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import R from 'ramda';

const add$ = new Subject;

const handlers = {
  add: val => {
    add$.next(val)}
};

const addCmd = term => state => {
  const findDeepestObj = obj => {
    if(obj.children) {
      findDeepestObj(obj.children[0]);
    } else {
      Object.assign(obj, { term }, { children: [{}]});
    }
  };
  findDeepestObj(state);
  return state;
};

const appState$ = add$.map(term => addCmd(term)).scan((acc, c) => c(acc), {});

const Node = item => {
  const name = item => <li>{item.term}</li>;
  let child_node = item.children? item.children.map(item => Node(item)) : null;

  return (<ul>
    {name(item)}
    {child_node}
  </ul>)
};

const Nodes = items => items.map(item => Node(item));

const AddContent = () => {
  const _handleAdd = e => {
    if(e.which === 13) {
      handlers.add(e.target.value);
    }
  };
  return (<Input placeholder="add content...and hit 'enter'"  onKeyDown={_handleAdd} style={{width: '300px'}}/>)
}

class Indio extends Component {
  state = {
    items: []
  }

  componentDidMount() {
    appState$.subscribe(val => {
      this.setState({
        items: [val]
      })
    });
  }

  render() {
    return (
        <div>
          {AddContent()}
          {Nodes(this.state.items)}
        </div>
    )
  }
}

export default Indio;