import dexie from 'dexie';

export const db = new dexie('wallet');

db.version(1).stores({
    keypairs: '++id,credentialName,publicKey,privateKey,used',
    credentials: '++id,keyPairId,credential'
});