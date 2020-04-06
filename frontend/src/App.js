import React, { Component } from 'react';

import FileUploader from './components/FileUploader/FileUploader';
import Display from './components/Display/Display';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <FileUploader />
        <br />
        <Display />
      </div>
    );
  }
}

export default App;
