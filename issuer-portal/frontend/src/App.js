import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as Components from './components'
import Web3ContextProvider from './context/Web3Context';
import IssuerContextProvider from './context/IssuerContext';

function App() {
  return (
    <React.Fragment>
      <Router>

        {/* Pages without any authentication */}
        <Switch>
          <Route exact path="/" component={Components.Landing} />
          <Route exact path="/auth/user/login" component={Components.UserLogin} />

          {/* Pages with normal user authentication */}
          {/* Idealy it will be displayed from Issuer's backend service */}
          {/* <Route exact path="/credentials/all" component={<Components.ViewAllCredentials />} /> */}
          {/* <Route exact path="/credentials/" */}

          {/* Pages with issuer authentication (has Web3Context) */}
          <Route exact path={["/auth/issuer/logout", "/issuer/dashboard", "/auth/issuer/login", "/credentials/issued", "/credentialschema/all", "/credentialschema/create", "/credentialdefinition/all", "/credentialdefinition/create"]}>
            <IssuerContextProvider>
              {/* <Web3ContextProvider> */}
              <Route exact path="/auth/issuer/login" component={Components.IssuerLogin} />
              <Route exact path="/auth/issuer/logout" component={Components.IssuerLogout} />
              <Route exact path="/issuer/dashboard" component={Components.IssuerDashboard} />
              <Route exact path="/credentials/issued" component={Components.ViewIssuedCredentials} />
              <Route exact path="/credentialschema/all" component={Components.ViewCredentialSchemas} />
              <Route exact path="/credentialschema/create" component={Components.CreateCredentialSchema} />
              <Route exact path="/credentialdefinition/all" component={Components.ViewCredentialDefinitions} />
              <Route exact path="/credentialdefinition/create" component={Components.CreateCredentialDefintion} />
              {/* <Route path="/credentialdefintion/view/:id" component={} */}
              {/* </Web3ContextProvider> */}
            </IssuerContextProvider>
          </Route>
        </Switch>

      </Router>
    </React.Fragment>
  );
}

export default App;
