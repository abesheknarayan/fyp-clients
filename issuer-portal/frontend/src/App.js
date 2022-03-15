import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as Components from './components'
import Web3ContextProvider from './context/Web3Context';
import IssuerContextProvider from './context/IssuerContext';
import UserContextProvider from './context/UserContext';
import CommonContextProvider from './context/CommonContext';

function App() {

  const issuerRoutes = [
    "/auth/issuer/logout",
    "/issuer/dashboard",
    "/auth/issuer/login",
    "/credentials/issued",
    "/credentialschema/all", 
    "/credentialschema/create", 
    "/credentialdefinition/all", 
    "/credentialdefinition/create",
    "/credential/requests",
    "/credential/issued",
    "/credential/issue/:id",
  ]

  const userRoutes = [
    "/auth/user/logout", 
    "/auth/user/login", 
    "/user/dashboard",
    "/user/credentials/view",
    "/user/credentials/requested",
    "/user/credentials/issued",
    "/user/credential/view/:id",
    "/credential/issued/view/:id",
  ]

  return (
    <React.Fragment>
      <Router>
        <CommonContextProvider>

          {/* Pages without any authentication */}
          <Switch>
            <Route exact path="/" component={Components.Landing} />


            {/* Pages with normal user authentication */}
            {/* Idealy it will be displayed from Issuer's backend service */}
            <Route exact path={userRoutes}>
              <UserContextProvider>
                <Route exact path = "/user/credential/view/:id" component={Components.ViewCredential} />
                <Route exact path="/auth/user/login" component={Components.UserLogin} />
                <Route exact path="/auth/user/logout" component={Components.UserLogout} />
                <Route exact path="/user/dashboard" component={Components.UserDashboard} />
                <Route exact path="/user/credentials/view" component={Components.ViewIssuableCredentials}  />
                <Route exact path="/user/credentials/requested" component={Components.ViewRequestedCredentials} />
                <Route exact path="/credential/issued/view/:id" component={Components.ViewIssuedCredential} />
                <Route exact path ="/user/credentials/issued" component={Components.ViewIssuedCredentials} />
              </UserContextProvider>
            </Route>

            {/* Pages with issuer authentication (has Web3Context needed for contract calls) */}
            <Route exact path={issuerRoutes}>
              <IssuerContextProvider>
                <Web3ContextProvider>
                  <Route exact path="/credential/issue/:id" component={Components.IssueCredential} />
                  <Route exact path="/auth/issuer/login" component={Components.IssuerLogin} />
                  <Route exact path="/auth/issuer/logout" component={Components.IssuerLogout} />
                  <Route exact path="/issuer/dashboard" component={Components.IssuerDashboard} />
                  <Route exact path="/credentials/issued" component={Components.ViewIssuedCredentials} />
                  <Route exact path="/credentialschema/all" component={Components.ViewCredentialSchemas} />
                  <Route exact path="/credentialschema/create" component={Components.CreateCredentialSchema} />
                  <Route exact path="/credentialdefinition/all" component={Components.ViewCredentialDefinitions} />
                  <Route exact path="/credentialdefinition/create" component={Components.CreateCredentialDefintion} />
                  <Route exact path="/credential/requests" component={Components.ViewCredentialRequests} />
                  <Route exact path="/credential/issued" component={Components.ViewIssuedCredentialsIssuer} />
                  {/* <Route path="/credentialdefintion/view/:id" component={} */}
                </Web3ContextProvider>
              </IssuerContextProvider>
            </Route>
          </Switch>

        </CommonContextProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
