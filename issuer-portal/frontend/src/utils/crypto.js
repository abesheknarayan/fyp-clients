
// returns a elliptic curve key pair
const genKeyPair = async () => {
    let keyPair = await window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    },
        true,
        ["encrypt", "decrypt"])
    return keyPair;
}



export {
    genKeyPair,
}