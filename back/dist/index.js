import app from './app.js';
import config from './utils/config.js';
import http from 'http';
import { Server } from 'socket.io';
import { handleSocket } from './utils/socketConnection.js';
const { PORT } = config;
const host = '0.0.0.0';
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://taskwizard.fly.dev',
        credentials: true
    }
});
handleSocket(io);
console.log('asdfasfdasdf');
server.listen(parseInt(PORT), host, () => console.log(`Socket listening on port ${PORT}`));
