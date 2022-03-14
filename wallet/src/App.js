import './App.css';
import React from 'react';
import * as Components from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {

  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path='/' component={Components.Landing} />
          <Route exact path='/dashboard' component={Components.Dashboard} />
          <Route exact path='/credential/create' component={Components.CreateCredential} />
          <Route exact path='/credential/link/:id' component={Components.LinkCredential} />
          <Route exact path='/credential/link' component={Components.LinkCredentials} />
          <Route exact path='/credential/all' component={Components.ViewAllCredentials} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
