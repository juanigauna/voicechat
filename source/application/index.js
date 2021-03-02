import Server from './server'
import StartUp from './startup'
import config from '../config/env'
import routes from './routes'


let server = new Server(config, routes)
let startup = new StartUp(server)

export default {
    start: startup.start()
}