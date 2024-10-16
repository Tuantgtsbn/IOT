const express = require('express');
const app = express();
const WebSocket = require('ws');
const path = require('path');
const { engine } = require('express-handlebars');
// rename extension file to .hbs
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));
const PORT = 8080;
const cors = require('cors');
//Middleware CORS
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// static file
app.use(express.static(path.join(__dirname, 'public')));

const { routes } = require('./routes');
// Tạo server HTTP
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
routes(app);
const db = require('./config/db');
db.connectToDatabase();

// Tạo WebSocket server
const wss = new WebSocket.Server({ server });

//Upgrade HTTP to WebSocket
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Xử lý kết nối WebSocket
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received data from ESP8266:', message);
        try {
            const data = JSON.parse(message);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Invalid JSON data:', error);
        }

    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Phục vụ file HTML
// app.get('/', (req, res) => {
//     res.render('home');
// });
