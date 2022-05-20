
const ConvertHexStringtoArrayBuffer = (hex) => {
    try {
        return new Int8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
    }
    catch (err) {
        console.error(err);
    }
}

function ConvertArrayBuffertoHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

const verifySignature = async (publicKey, val, signature) => {
    try {
        // import key from jwk
        let importedPublicKey = await window.crypto.subtle.importKey('jwk',
            publicKey,
            {
                name: "ECDSA",
                namedCurve: "P-384",
            },
            true,
            ["verify"],
        )
        let encoder = new TextEncoder();
        let encodedData = encoder.encode(val.replace(/['"]+/g, ''));
        let result = await window.crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: {name:"SHA-256"}
            },
            importedPublicKey,
            ConvertHexStringtoArrayBuffer(signature),
            encodedData,
        )
        return result;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}


export {
    ConvertArrayBuffertoHexString,
    ConvertHexStringtoArrayBuffer,
    verifySignature,
}