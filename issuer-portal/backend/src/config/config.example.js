const config = {
    port:4000,
    mongoose: {
        MONGO_HOST_NAME:'localhost',
        MONGO_PORT: 27017,
        MONGO_DB:'issuer_portal'
    },
    saltRounds:10,
    jwtSecret: "Im so bad at chess"
}

export default config;