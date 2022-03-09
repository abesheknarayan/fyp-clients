
// returns a elliptic curve key pair
const genKeyPair = async () => {
    try {
        let keyPair = await window.crypto.subtle.generateKey({
            name: "ECDSA",
            namedCurve: "P-384"
        },
            true,
            ["sign", "verify"])
        return keyPair;
    }
    catch (err) {
        console.error(err);
    }
}

const importPrivateKeyFromJWK = async (jwk) => {
    try {
        return window.crypto.subtle.importKey(
            'jwk',
            jwk,
            {
                name: "ECDSA",
                namedCurve: "P-384"
            },
            true,
            ["sign"]
        );
    }
    catch (err) {
        console.error(err);
    }
}

const importPublicKeyFromJWK = async (jwk) => {
    try {
        return window.crypto.subtle.importKey(
            'jwk',
            jwk,
            {
                name: "ECDSA",
                namedCurve: "P-384"
            },
            true,
            ["verify"]
        );
    }
    catch (err) {
        console.error(err);
    }
}

const Sign = async (encodedMessage, jwk) => {
    try {
        let importedPrivateKey = await importPrivateKeyFromJWK(jwk);
        console.log(importedPrivateKey);
        let signature = await window.crypto.subtle.sign({
            name: 'ECDSA',
            hash: { name: 'SHA-256' }
        },
            importedPrivateKey,
            encodedMessage
        )
        console.log(signature);
        // converting it into hex from Array of bytes
        let int8Array = new Int8Array(signature);
        let hexSignature = ConvertArrayBuffertoHexString(int8Array);
        return hexSignature;
    }
    catch (err) {
        console.error(err);
    }
}

const VerifySignature = async (encodedMessage, signature, jwk) => {
    try {
        let importedPublicKey = await importPublicKeyFromJWK(jwk);
        let result = await window.crypto.subtle.verify({
            name: 'ECDSA',
            hash: { name: "SHA-256" }
        },
            importedPublicKey,
            signature,
            encodedMessage
        )
        return result;
    }
    catch (err) {
        console.error(err);
    }
}

const ConvertHexStringtoArrayBuffer = (hex) => {
    try{
       return new Int8Array(hex.match(/.{1,2}/g).map(byte=> parseInt(byte,16)))
    }
    catch(err)
    {
        console.error(err);
    }
}

function ConvertArrayBuffertoHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}


export {
    genKeyPair,
    Sign,
    VerifySignature,
    ConvertArrayBuffertoHexString,
    ConvertHexStringtoArrayBuffer,
}