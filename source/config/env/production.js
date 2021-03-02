export default {
    PORT: process.env.PORT,
    PEER_CONFIG: {
        secure: true,
        host: 'peer-server-noname.herokuapp.com',
        port: 443,
        path: '/server'
    }
}