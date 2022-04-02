import * as pr from 'prime-functions';


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

const mult = (a, b, m) => {
    return (a * b) % m;
}

// computes a^(-1) mod m
const inverse = (a, m) => {
    return modpow(a, phi(m) - 1, m);
}


// computes euler totient value
const phi = (a) => {
    return pr.totient(a);
}

// computes a^b mod m for prime m
const modpow = (a, b, m) => {
    a %= m
    let res = 1
    while (b > 0) {
        if (b & 1) {
            res = mult(res, a, m)
            b--;
        }
        b /= 2
        a = mult(a, a, m)
    }
    return res;
}

// generates a random number in [1,limit)
const generateRandomNumber = (limit) => {   
    return Math.floor(Math.random()*(limit-1) + 1);
}

const generateProof = (privateVal,publicVal,p) => {
    // compute x*r1, y--> public , y^r2 , r1,r2    
    let r1 = generateRandomNumber(p);
    let r2 = generateRandomNumber(p);
    console.log(publicVal)
    console.log(modpow(publicVal,privateVal,p));
    return {
        r1r2: mult(r1,r2,phi(Number(p))),
        p1: mult(r1,Number(privateVal),phi(Number(p))),
        p2: modpow(Number(publicVal),r2,Number(p))
    }
}

// const checkRevocation = (accumulatorValue,revocationProof,p) => {
//     let lval = modpow(accumulatorValue,revocationProof.r1r2,p)
//     let {p1,p2} = revocationProof;
//     let rval = modpow(p2,p1,p)
//     console.log(lval,rval);
// }


export {
    getKeyMaterial,
    deriveKey,
    ConvertArrayBuffertoHexString,
    ConvertHexStringtoArrayBuffer,
    decrypt,
    generateProof,
    // checkRevocation,
}