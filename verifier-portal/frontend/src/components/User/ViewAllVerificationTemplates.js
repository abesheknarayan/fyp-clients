import { Button, Container, Tbody, Table, Tr, Td } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { axiosInstance } from "../../utils/axios";
import Navbar from './Navbar';

function ViewAllVerificationTemplatesUser() {
    const { isVerifierLoggedin, isUserLoggedin } = useContext(commonContext);
    const [verificationTemplates, setverificationTemplates] = useState([]);
    const history = useHistory();

    const getAllVerificationTemplates = useCallback(async () => {
        try {
            let result = await axiosInstance.get("/user/verificationtemplate/all");
            setverificationTemplates(result.data);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (isUserLoggedin && !isVerifierLoggedin) getAllVerificationTemplates();
    }, [])

    if (isVerifierLoggedin)
        return <Redirect to="/verifier/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />


    const handleVerificationTemplateView = (e) => {
        history.push(`/user/verificationtemplate/view/${e.target.id}`);
    }

    return (
        <React.Fragment>
            <Navbar />
            <Container>
                <Table>
                    <Tbody>
                        {
                            verificationTemplates.map((template, index) => {
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

export default ViewAllVerificationTemplatesUser;