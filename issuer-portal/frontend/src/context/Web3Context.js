import React, { createContext, useState, useEffect, useContext } from "react";
import contract from "../contracts-build/SSI.json";
import getWeb3 from "../web3";
import { issuerContext } from "./IssuerContext";

export const Web3Context = createContext();

function Web3ContextProvider(props) {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [instance, setInstance] = useState(null);
    const [web3Account,setAccount] = useState(null);
    const {issuer} = useContext(issuerContext);

    const web3Fetch = async() => {
        try {
            // only needed for issuer side 
            const web3Instance = await getWeb3();
            const accounts = await web3Instance.eth.getAccounts();
            const networkId = await web3Instance.eth.net.getId();
            const deployedNetwork = contract.networks[networkId];
            const instance = new web3Instance.eth.Contract(
                contract.abi,
                deployedNetwork && deployedNetwork.address
            );
            setInstance(instance);
            setWeb3(web3Instance);
            setAccounts(accounts);
            setAccount(accounts[0])
        } catch (err) {
            console.error("Unable to start web3 provider, ", err);
        }
    }

    useEffect(() => {
        web3Fetch();
        // return function cleanup() {
        //     setAccount(null);
        // }
        
    }, [issuer]);

    return (
        <Web3Context.Provider value={{ web3,instance,web3Account }}>
            {props.children}
        </Web3Context.Provider>
    );
}

export default Web3ContextProvider;