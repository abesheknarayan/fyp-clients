import * as pr from 'prime-functions';

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


const checkRevocationValues = (revocationProof, accumulatorValue, generator, prime) => {
    console.log(accumulatorValue,prime);
    let lval = modpow(Number(accumulatorValue),revocationProof.r1r2,Number(prime));
    let rval = modpow(revocationProof.p2,revocationProof.p1,Number(prime));
    console.log(lval,rval);
    return lval === rval;
}

export {
    checkRevocationValues
}