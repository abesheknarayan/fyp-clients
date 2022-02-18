import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as Components from './components'
import Web3ContextProvider from './context/Web3Context';
import UserContextProvider from './context/UserContext';

function App() {
  return (
    <React.Fragment>
      <UserContextProvider>
        <Router>
          <Routes>

            {/* Pages without any authentication */}
            <Route exact path="/" element={<Components.Landing />} />
            <Route exact path="/auth/issuer" element={<Components.IssuerLogin />} />
            <Route exact path="/auth/user" element={<Components.UserLogin />} />

            {/* Pages with normal user authentication */}
            {/* Idealy it will be displayed from Issuer's backend service */}
            <Route exact path="/credentials/all" element={<Components.ViewAllCredentials />} />
            {/* <Route exact path="/credentials/" */}

            {/* Pages with issuer authentication (has Web3Context) */}
            <Web3ContextProvider>
              <Route exact path="/credentials/issued" element={<Components.ViewIssuedCredentials />} />
              <Route exact path="/credentialschema/all" element={<Components.ViewCredentialSchemas />} />
              <Route exact path="/credentialschema/create" element={<Components.CreateCredentialSchema />} />
              <Route exact path="/credentialdefinition/all" element={<Components.ViewCredentialDefinitions />} />
              <Route exact path="/credentialdefinition/create" element={<Components.CreateCredentialDefintion />} />
              {/* <Route path="/credentialdefintion/view/:id" element={} */}
            </Web3ContextProvider>

          </Routes>
        </Router>
      </UserContextProvider>
    </React.Fragment>
  );
}

export default App;
