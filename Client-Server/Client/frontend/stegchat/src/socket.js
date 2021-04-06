import { io } from 'socket.io-client'
import { server_addr } from './server_addr'

const socket = io.connect(server_addr);

export { socket }