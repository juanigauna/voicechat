import express from 'express'
import http from 'http'
import socket from 'socket.io'

class Server {
    constructor(config, router) {
        this.config = config
        this.app = express()
        this.server = http.Server(this.app)
        this.io = socket(this.server)
        this.app.use(express.static('public'))
        this.app.set('view engine', 'ejs')
        this.app.use(router())
        this.io.on('connection', socket => {
            socket.on('join', data => {
                let { roomId, userId } = data
                socket.join(roomId)
                socket.to(roomId).emit('user-connected', { userId: userId, name: data.name })
                socket.on('error', error => {
                    socket.to(roomId).emit('error', error)
                })
                socket.on('outgoing-call', call => {
                    socket.to(roomId).emit('incoming-call', call)
                })
                socket.on('disconnect', () => {
                    socket.to(roomId).emit('user-disconnected', { userId: userId })
                })
            })
        })

    }
    start() {
        return new Promise((resolve, reject) => {
            this.server.listen(this.config.PORT, () => {
                console.log('Server running on port', this.config.PORT)
                resolve()
            })
        })
    }
}

export default Server