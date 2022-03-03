## Possible implementation of revocation registry

Keep it to as last as possible , might not be entirely possible with JS

we need
- prime preferrably large
- generator
- some kind of seeded values as public witness

Idea : 
- we can keep the private witness to be a private key ( there are deterministic key generation algorithm available [Link](https://crypto.stackexchange.com/questions/24514/deterministically-generate-a-rsa-public-private-key-pair-from-a-passphrase-with) ).
- node module for the same [Link](https://nodejs.org/docs/latest-v14.x/api/crypto.html) (not tested yet).
- as a seed we can give the hash of values of credential to the key gen
- then we store the public key in the public witness list , private key as revocation id and give it to holder
- have to think about giving proofs