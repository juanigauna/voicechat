import express, { Router } from 'express'
import compression from 'compression'
import mainRoutes from './main.routes'
import roomRoutes from './room.routes'

export default () => {
    let router = Router()
    router.use(compression())
    router.use('/', mainRoutes())
    router.use('/room', roomRoutes())
    return router
}