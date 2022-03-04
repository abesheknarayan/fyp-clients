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

// User Pages
import UserLogin from "./User/UserLogin";
import UserDashboard from "./User/UserDashboard";
import UserLogout from "./User/UserLogout";
import ViewIssuableCredentials from "./User/ViewIssuableCredentials";
import ViewIssuedCredentials from "./User/ViewIssuedCredential";
import ViewRequestedCredentials from "./User/ViewRequestedCredentials";

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
    
    
    // user
    UserLogin,
    UserLogout,
    UserDashboard,
    ViewIssuedCredentials,
    ViewIssuableCredentials,
    ViewRequestedCredentials,
}