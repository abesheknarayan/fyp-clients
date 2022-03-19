import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CommonContextProvider from './context/CommonContext';
import * as Components from './components';
import UserContextProvider from './context/UserContext';
import VerifierContextProvider from './context/VerifierContext';
import Web3ContextProvider from './context/Web3Context';

function App() {

  const userRoutes = [
    "/auth/user/login",
    "/auth/user/logout",
    "/user/dashboard",
    "/user/verificationtemplates/view",
    "/user/verificationtemplate/view/:id",
  ]

  const verifierRoutes = [
    "/auth/verifier/login",
    "/auth/verifier/logout",
    "/verifier/dashboard",
    "/verifier/verificationtemplate/create",
    "/verifier/verificationtemplate/view/all",
    "/verificationtemplate/view/:id",
  ]

  return (
    <React.Fragment>
      <Router>
        <CommonContextProvider>
          <Switch>
            <Route exact path={'/'} component={Components.Landing} />
            <Route exact path={userRoutes} >
              <UserContextProvider>
                <Route exact path='/auth/user/login' component={Components.UserLogin} />
                <Route exact path='/auth/user/logout' component={Components.UserLogout} />
                <Route exact path='/user/dashboard' component={Components.UserDashboard} />
                <Route exact path='/user/verificationtemplates/view' component={Components.ViewAllVerificationTemplatesUser} />
                <Route exact path='/user/verificationtemplate/view/:id' component={Components.ViewVerificationTemplateUser} />
              </UserContextProvider>
            </Route>
            <Route exact path={verifierRoutes}>
              <VerifierContextProvider>
                <Web3ContextProvider>
                  <Route exact path='/auth/verifier/login' component={Components.VerifierLogin} />
                  <Route exact path='/auth/verifier/logout' component={Components.VerifierLogout} />
                  <Route exact path='/verifier/dashboard' component={Components.VerifierDashboard} />
                  <Route exact path='/verifier/verificationtemplate/create' component={Components.CreateVerificationTemplate} />
                  <Route exact path='/verifier/verificationtemplate/view/all' component={Components.ViewAllVerificationTemplates} />
                  <Route exact path='/verificationtemplate/view/:id' component={Components.ViewVerificationTemplate} />
                </Web3ContextProvider>
              </VerifierContextProvider>
            </Route>
          </Switch>
        </CommonContextProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
