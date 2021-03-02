import { Router } from 'express'
import config from '../../config/env'

export default () => {
    let router = Router()

    router.get('/:roomId', (req, res) => {
        res.render('room', {
            roomId: req.params.roomId,
            config: config.PEER_CONFIG
        })
    })
    return router
}