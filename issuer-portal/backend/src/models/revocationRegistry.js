import mongoose from "mongoose";

const RevocationRegistrySchema = new mongoose.Schema({
    credentialDefinitionId: mongoose.Types.ObjectId,
    primeNumber: Number,
    generator: Number,
    publicAccumulatorValue: Number,
    publicWitnessList: [
        {
            type: Number,
        }
    ],
})

const RevocationRegistry = mongoose.model('RevocationRegistry',RevocationRegistrySchema);

export default RevocationRegistry;