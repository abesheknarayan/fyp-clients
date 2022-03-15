import Landing from "./Landing";

// Issuer Pages
import IssuerLogin from "./Issuer/IssuerLogin";
import ViewIssuedCredentialsIssuer from "./Issuer/ViewIssuedCredentials";
import CreateCredentialSchema from "./Issuer/CreateCredentialSchema";
import CreateCredentialDefintion from "./Issuer/CreateCredentialDefinition";
import ViewCredentialSchemas from "./Issuer/ViewCredentialSchemas";
import ViewCredentialDefinitions from "./Issuer/ViewCredentialDefinitions";
import IssuerDashboard from "./Issuer/IssuerDashboard";
import IssuerLogout from "./Issuer/IssuerLogout";
import ViewCredentialRequests from "./Issuer/ViewCredentialRequests";
import IssueCredential from "./Issuer/IssueCredential";

// User Pages
import UserLogin from "./User/UserLogin";
import UserDashboard from "./User/UserDashboard";
import UserLogout from "./User/UserLogout";
import ViewIssuableCredentials from "./User/ViewIssuableCredentials";
import ViewIssuedCredentials from "./User/ViewIssuedCredentials";
import ViewRequestedCredentials from "./User/ViewRequestedCredentials";
import ViewCredential from "./User/ViewCredential";
import ViewIssuedCredential from "./User/ViewIssuedCredential";

export {
    Landing,
    // issuer
    IssuerLogin,
    CreateCredentialSchema,
    CreateCredentialDefintion,
    ViewCredentialSchemas,
    ViewCredentialDefinitions,  
    ViewIssuedCredentialsIssuer,
    IssuerDashboard,
    IssuerLogout,
    ViewCredentialRequests,
    IssueCredential,
    
    // user
    UserLogin,
    UserLogout,
    UserDashboard,
    ViewIssuedCredentials,
    ViewIssuableCredentials,
    ViewRequestedCredentials,
    ViewCredential,
    ViewIssuedCredential,
}