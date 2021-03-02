import 'dotenv/config'
import development from './development'
import production from './production'

const { NODE_ENV } = process.env 

const CURRENT_ENV = NODE_ENV === 'production' ? production : development

export default CURRENT_ENV