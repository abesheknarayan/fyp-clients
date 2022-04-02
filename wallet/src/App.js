import './App.css';
import React from 'react';
import * as Components from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Web3ContextProvider from './context/Web3Context';

function App() {

  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Web3ContextProvider>
            <Route exact path='/' component={Components.Landing} />
            <Route exact path='/dashboard' component={Components.Dashboard} />
            <Route exact path='/credential/create' component={Components.CreateCredential} />
            <Route exact path='/credential/link/:id' component={Components.LinkCredential} />
            <Route exact path='/credential/link' component={Components.LinkCredentials} />
            <Route exact path='/credential/all' component={Components.ViewAllCredentials} />
            <Route exact path="/credential/view/:id" component={Components.ViewCredential} />
            <Route exact path='/verifiablecredential/create/:id' component={Components.CreateVerifiableCredential} />
          </Web3ContextProvider>
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
