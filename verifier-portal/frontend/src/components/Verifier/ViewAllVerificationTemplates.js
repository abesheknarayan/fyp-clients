import { Button, Container, Tbody, Table, Tr, Td } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { verifierContext } from "../../context/VerifierContext";
import { Web3Context } from "../../context/Web3Context";
import { axiosInstance } from "../../utils/axios";
import Navbar from './Navbar';

function ViewAllVerificationTemplates() {
    const { isLoggedin, verifier } = useContext(verifierContext);
    const { isVerifierLoggedin, isUserLoggedin } = useContext(commonContext);
    const { web3Account } = useContext(Web3Context);
    const [verificationTemplates,setverificationTemplates] = useState([]);
    const history = useHistory();

    const getAllVerificationTemplates = useCallback(async () => {
        try {
            console.log("here")
            let result = await axiosInstance.get("/credential/verificationtemplate/all");
            setverificationTemplates(result.data);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (!isUserLoggedin && isVerifierLoggedin) getAllVerificationTemplates();
    }, [])

    if (isUserLoggedin) return <Redirect to="/user/dashboard" />

    if (!isVerifierLoggedin) return <Redirect to="/auth/verifier/login" />

    const handleVerificationTemplateView = (e) => {
        history.push(`/verificationtemplate/view/${e.target.id}`);
    }

    return (
        <React.Fragment>
            <Navbar />
            <Container>
                <Table>
                    <Tbody>
                        {
                            verificationTemplates.map((template,index)=>{
                                console.log(template)
                                return (
                                    <Tr key={index}>
                                        <Td> {template.templateName} </Td>
                                        <Td> <Button id={template._id} onClick={handleVerificationTemplateView}>View</Button> </Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </Container>
        </React.Fragment>
    )
}

export default ViewAllVerificationTemplates;