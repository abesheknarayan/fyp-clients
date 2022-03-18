import mongoose from "mongoose";
import config from "../config/config.js"

const { MONGO_HOST_NAME,MONGO_PORT,MONGO_DB } = config.mongoose
const connection_url = `mongodb://${MONGO_HOST_NAME}:${MONGO_PORT}/${MONGO_DB}`
mongoose.Promise = Promise;

export default () => {
    mongoose.connect(connection_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to the data base !!!");
    })
    .catch((err) => {
        console.log(`ERROR!!! : ${err}`);
    });
}

const connection  = mongoose.connection;

export {connection};

