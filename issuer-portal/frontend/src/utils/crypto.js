import { config } from "../config/config";
import * as pr from 'prime-functions';

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

const encryptWithPublicKey = async (publicKey, value) => {
    try {
        // import public key
        let importedPublicKey = await window.crypto.subtle.importKey(
            'jwk',
            publicKey,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256',
            },
            true,
            ['encrypt']
        )
        // encode value
        let stringifiedCredential = JSON.stringify(value);
        let encoder = new TextEncoder();
        let encodedCredential = encoder.encode(stringifiedCredential);
        let result = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256',
            },
            importedPublicKey,
            encodedCredential
        )
        let int8Array = new Int8Array(result);
        return ConvertArrayBuffertoHexString(int8Array);
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

const ConvertArrayBuffertoHexString = (byteArray) => {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
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
    console.log(a,b,m)
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


const initRevocationRegistry = () => {
    let privateWitnessList = config.primes.slice(0, config.initPrimes);
    let generator = config.generator;
    let accumulatorValue = 1;
    let prime = config.primeNumber;
    let publicWitnessList = []
    privateWitnessList.forEach((x) => {
        accumulatorValue = mult(accumulatorValue, x, prime - 1);
    })

    // generating public witness 
    privateWitnessList.forEach((privateWitness) => {
        let publicWitness = modpow(generator, mult(accumulatorValue, inverse(privateWitness, prime - 1), prime - 1), prime)
        {
            // checking if public witness ^ private witness = public accumulator value
            let publicAccumulatorValue = modpow(generator, accumulatorValue, prime);
            let checkingValue = modpow(publicWitness, privateWitness, prime);
            if (publicAccumulatorValue !== checkingValue) {
                console.log(publicAccumulatorValue, checkingValue)
                throw "something is wrong"
            }
        }
        publicWitnessList.push(publicWitness)
    })

    return {
        privateAccumulatorValue: accumulatorValue,
        publicAccumulatorValue: modpow(generator, accumulatorValue, prime),
        prime: prime,
        generator: generator,
        privateWitnessList: privateWitnessList,
        publicWitnessList: publicWitnessList,
    }
}


const addNewCredential = (publicAccumulatorValue, publicWitnessList, revocationId, primeNumber) => {
    let newAccumulatorValue = modpow(Number(publicAccumulatorValue),revocationId,Number(primeNumber));
    let newPublicWitnessList = []
    publicWitnessList.forEach((publicWitness)=>{
        console.log(typeof publicWitness)
        console.log(Number(publicWitness))
        newPublicWitnessList.push(modpow(Number(publicWitness),revocationId,Number(primeNumber)))
    })
    // public witness for newly added credential is same as old public accumulator value
    newPublicWitnessList.push(Number(publicAccumulatorValue))

    return {
        publicAccumulatorValue: newAccumulatorValue,
        publicWitnessList: newPublicWitnessList,
    }
}





export {
    genKeyPair,
    Sign,
    VerifySignature,
    encryptWithPublicKey,
    ConvertArrayBuffertoHexString,
    ConvertHexStringtoArrayBuffer,
    initRevocationRegistry,
    addNewCredential,
}