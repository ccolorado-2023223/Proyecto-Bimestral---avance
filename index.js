
import {initServer} from './configs/app.js'
import {config} from 'dotenv'
import { connect} from './configs/monogo.js'


config()
connect()
initServer()
