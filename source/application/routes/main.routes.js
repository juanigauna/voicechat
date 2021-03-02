import { Router } from 'express'
import { v4 as uuidV4 } from 'uuid'

export default () => {
    let router = Router()
    router.get('/', (req, res) => {
        res.redirect(`room/${uuidV4()}`)
    })
    return router
}