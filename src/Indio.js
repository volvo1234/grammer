import React, { Component } from 'react';
import 'rxjs';

import { Form, Select } from 'semantic-ui-react';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const addRadio$ = new Subject;
const useRadio$ = new Subject;
const useDropdown$ = new Subject;

const handlers = {
  addRadio: () => addRadio$.next(),
  useRadio: val => useRadio$.next(val),
  useDropdown: val => useDropdown$.next(val)
};

const MyRadio = (currentValue) => {
  const _handleChange = (e, { value }) => {
    handlers.useRadio(value);
  };

  return (<Form>
    <Form.Group inline>
      <label>Do you have a car?</label>
      <Form.Radio label='Yes' value='yes' checked={currentValue === 'yes'} onChange={_handleChange}/>
      <Form.Radio label='No' value='no' checked={currentValue === 'no'} onChange={_handleChange}/>
    </Form.Group>
  </Form>)
};


const MyDropdown = () => {
  const options = [
    { text: 'BMW', value: 'BMW' },
    { text: 'Benz', value: 'Benz' },
    { text: 'Prosche', value: 'Prosche' },
  ];

  const _handleChange = (e, { value }) => {
    handlers.useDropdown(value);
  };

  return (
      <Form>
        <Form.Group>
          <Form.Field control={Select} label='Car Type' options={options} placeholder='Please Select' onChange={_handleChange} />
        </Form.Group>
      </Form>
  )
};

const addRadioCmd = () => state => {
  const findDeepestObj = obj => {
    if(obj.children) {
      findDeepestObj(obj.children[0]);
    } else {
      Object.assign(state, {term: [false, MyRadio]})
    }
  };

  findDeepestObj(state);
  return state;
};

const useRadioCmd = val => state => {
  const findDeepestObj = obj => {
    if(obj.children) {
      findDeepestObj(obj.children[0]);
    } else {
      if(val === 'yes') {
        Object.assign(state,  { children: [{term: [val, MyDropdown]}]})
      }
    }
  };

  findDeepestObj(state);
  return state;
};


const useUseDropdownCmd = val => state => {
  const findDeepestObj = obj => {
    if(obj.children) {
      findDeepestObj(obj.children[0]);
    } else {
      Object.assign(state,  { children: [{term: [val, MyDropdown]}]})
    }
  };

  findDeepestObj(state);
  return state;
};

const s1$ = addRadio$.map(() => addRadioCmd());
const s2$ = useRadio$.map(yesNo => useRadioCmd(yesNo));
const s3$ = useDropdown$.map(val => useUseDropdownCmd(val));
const appState$ = Observable.merge(s1$, s2$, s3$).scan((acc, c) => c(acc), {});

const Node = item => {
  const ui = item => <li>{item.term[1](item.term[0])}</li>;
  let child_node = item.children? item.children.map(item => Node(item)) : null;

  return (<ul>
    {ui(item)}
    {child_node}
  </ul>)
};

const Nodes = items => items.map(item => {
  return Node(item);
});

const AddRadio = () => {
  const _handleSubmit = () => {
    handlers.addRadio();
  };

  return (
      <Form onSubmit={_handleSubmit}>
        <Form.Group inline>
          <label>Your Verhicle Info</label>
          <Form.Button primary>Start From Here</Form.Button>
        </Form.Group>
      </Form>
  )
};

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
          {AddRadio()}
          {Nodes(this.state.items)}
        </div>
    )
  }
}

export default Indio;