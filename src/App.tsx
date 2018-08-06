import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from '@/Home';
import Navbar from '@/Navbar';
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Navbar />
            <Route component={Home} path="/" />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
