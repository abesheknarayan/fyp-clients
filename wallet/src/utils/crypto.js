
/*
Get some key material to use as input to the deriveKey method.
The key material is a password supplied by the user.
*/
const getKeyMaterial = (passphrase) => {
    let encoder = new TextEncoder();
    return window.crypto.subtle.importKey(
        'raw',
        encoder.encode(passphrase),
        'PBKDF2',
        false,
        ["deriveBits", "deriveKey"]
    );
}

const deriveKey = async () => {
    try {
        let key = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ['encrypt', 'decrypt']
        )
        let formattedPublicKey = await window.crypto.subtle.exportKey('jwk',
            key.publicKey
        )
        let formattedPrivateKey = await window.crypto.subtle.exportKey('jwk',
            key.privateKey
        )
        return {publicKey: formattedPublicKey,privateKey: formattedPrivateKey};
    }
    catch (err) {
        console.error(err);
    }
}


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


const decrypt = async(privateKey,cipherText) => {
    try{
        let importedPrivateKey = await window.crypto.subtle.importKey(
            'jwk',
            privateKey,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256',
            },
            true,
            ['decrypt']
        )
        // cipher text is in hex form ==> change it to array buffer
        let cipherTextBuffer = ConvertHexStringtoArrayBuffer(cipherText);
        let result = await window.crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP',

            },
            importedPrivateKey,
            cipherTextBuffer,
        )
        let decoder = new TextDecoder();
        return decoder.decode(result);
    }
    catch(err)
    {
        console.error(err);
    }

}


export {
    getKeyMaterial,
    deriveKey,
    ConvertArrayBuffertoHexString,
    ConvertHexStringtoArrayBuffer,
    decrypt,
}