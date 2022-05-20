import { Container, Input, useClipboard, Table, Stack, Button, Tbody, Tr, Td } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import { commonContext } from "../../context/CommonContext";
import { axiosInstance } from "../../utils/axios";
import { ConvertArrayBuffertoHexString } from "../../utils/crypto";
import Navbar from './Navbar'

function ViewIssuedCredential() {
    const { isIssuerLoggedin, isUserLoggedin } = useContext(commonContext);
    const [credential, setCredential] = useState(null);


    const path = useLocation();
    let credentialId = path.pathname.split("/").slice(-1)[0];

    const encodeCredential = (cred) => {
        let stringifiedCredential = JSON.stringify(cred);
        let encoder = new TextEncoder();
        let encodedCredential = encoder.encode(stringifiedCredential);
        return ConvertArrayBuffertoHexString(encodedCredential);
    }

    const { hasCopied, onCopy } = useClipboard(credential ? encodeCredential(credential.credential) : null);

    const fetchCredential = useCallback(async () => {
        try {
            let result = await axiosInstance.get(`/credential/issued/${credentialId}`)
            setCredential(result.data);
        }
        catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        if (!isIssuerLoggedin && isUserLoggedin) fetchCredential();
    }, [])


    if (isIssuerLoggedin)
        return <Redirect to="/issuer/dashboard" />

    if (!isUserLoggedin)
        return <Redirect to="/auth/user/login" />



    return (
        <React.Fragment>
            <Navbar />
            <Container>
                {credential && (
                    <React.Fragment>
                        <Table>
                            <Tbody >
                                <Tr>
                                    <Td>
                                        {credential.credential.name}
                                    </Td>
                                    <Td>
                                        {credential.credential.version}
                                    </Td>
                                </Tr>
                                <Tr>

                                </Tr>
                            </Tbody>
                        </Table>
                        <Stack padding={5}>
                            <Input value={encodeCredential(credential.credential)} isReadOnly />
                            <Button size='md' margin={1} onClick={onCopy} >
                                Copy
                            </Button>
                        </Stack>
                    </React.Fragment>
                )}
            </Container>
        </React.Fragment>
    )
}

export default ViewIssuedCredential;