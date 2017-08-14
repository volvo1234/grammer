import React, { Component } from 'react';
import GrammerCheck from './GrammerCheck';

const items = [
  {id: 0, text: '', error: false},
  {id: 1, text: 'The', error: false},
  {id: 2, text: 'yoga', error: false},
  {id: 3, text: 'instructor', error: false},
  {id: 4, text: 'shouts', error: true, recommendations: ['speaks', 'talks', 'smiles'], style: {textColor: 'red', decorationColor: 'red', decoration: 'underline'}},
  {id: 5, text: 'so', error: false},
  {id: 6, text: 'quietly', error: false},
  {id: 7, text: 'that', error: false},
  {id: 8, text: 'we', error: false},
  {id: 9, text: 'cann hardly', error: true, recommendations: ['can hardly hear', 'can hardly find', 'can hardly feel', 'can hardly follow'], style: {textColor: 'red', decorationColor: 'red', decoration: 'underline'}},
  {id: 10, text: 'her', error: false},

];
class App extends Component {
  render() {
    return (
      <GrammerCheck items={items}/>
    );
  }
}

export default App;
