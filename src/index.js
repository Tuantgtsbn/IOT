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
const db = require('./config/db');
db.connectToDatabase();
const { sessionConfig } = require('./config/session');
// app.use(sessionConfig);
routes(app);


// Tạo WebSocket server
const wss = new WebSocket.Server({ server });

//Upgrade HTTP to WebSocket
// server.on('upgrade', (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//     });
// });

// Xử lý kết nối WebSocket
var isESP8266Connected = false;
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {

        try {
            const data = JSON.parse(message);

            // Kiểm tra xem đây có phải là tin nhắn xác định loại client không
            if (data.type === 'esp8266' || data.type === 'browser') {
                if (data.type === 'esp8266') {
                    isESP8266Connected = true;
                }

                ws.send(JSON.stringify({ type: 'signConnection', status: isESP8266Connected }));
                if (isESP8266Connected) {
                    wss.clients.forEach((client) => {
                        if (client.clientType === 'browser') {
                            client.send(JSON.stringify({ type: 'signConnection', status: isESP8266Connected }));
                        }
                    });
                }
                ws.clientType = data.type; // Lưu định danh loại client vào WebSocket instance
                console.log(`Client type identified: ${ws.clientType}`);
                return;
            }

            // Xử lý tin nhắn dựa trên loại client
            if (ws.clientType === 'esp8266') {
                console.log('Received from ESP8266:', data);
                switch (data.type) {
                    case 'dataSensor':
                        var { unit, value, idDevice } = data;
                        var sql = `Insert into sensors_data (id_device, value, unit) values (?, ?, ?)`;
                        db.query(sql, [idDevice, value, unit]);
                        wss.clients.forEach((client) => {
                            if (client.clientType === 'browser') {
                                client.send(JSON.stringify({ type: 'dataSensor', unit, value, idDevice }));
                            }
                        });
                        break;
                    case 'statusDevice':
                        var { status, idDevice } = data;
                        var sql = `Update devices set status = ?, last_updated=current_timestamp where id = ?`;

                        db.query(sql, [status, idDevice]);
                        wss.clients.forEach((client) => {
                            if (client.clientType === 'browser') {
                                client.send(JSON.stringify({ type: 'statusDevice', status, idDevice }));
                            }
                        });
                        break;
                    case 'toggleDevice':
                        var { currentStatus, idDevice, isSuccess } = data;
                        if (!!isSuccess) {
                            var sql = `Update devices set status = ?, last_updated=current_timestamp where id = ?`;
                            db.query(sql, [currentStatus, idDevice]);

                        }
                        sql = `Insert into action (id_device, action_type, status) values (?, ?, ?)`;
                        db.query(sql, [idDevice, currentStatus, isSuccess]);
                        wss.clients.forEach((client) => {
                            if (client.clientType === 'browser') {
                                client.send(JSON.stringify({ type: 'toggleDevice', currentStatus, idDevice, isSuccess }));
                            }
                        });
                        break;
                    case 'alertDevice':
                        var { status, idDevice, message: m } = data;
                        var sql = `Insert into alerts (id_device, message, isSafe) values (?, ?, ?)`;
                        db.query(sql, [idDevice, m, status]);
                        if (idDevice != 3) {
                            sql = `Update devices set status = ?, last_updated=current_timestamp where id = ?`;
                            db.query(sql, [status, idDevice]);
                        }

                        if (idDevice === 3 && m == 'Detect smoke !!!') {
                            fetch('https://api.telegram.org/bot7442157649:AAG-BdVqGkKyztVoLWRpJyMN0UB4vPlXrIA/sendMessage?chat_id=6160625198&text=warning gas in the kitchen')
                                .then(response => response.json())
                                .then(data => console.log(data));
                        }

                        break;
                    case 'toggleDeviceAutomatic':
                        var { currentStatus, idDevice, isSuccess } = data;

                        var sql = `Insert into action (id_device, action_type, status) values (?, ?, ?)`;
                        db.query(sql, [idDevice, currentStatus, isSuccess]);
                        sql = `Update devices set status = ?, last_updated=current_timestamp where id = ?`;
                        db.query(sql, [currentStatus, idDevice]);
                        break;



                }
            } else if (ws.clientType === 'browser') {
                console.log('Received from browser:', data);
                switch (data.type) {
                    case 'toggleDevice':
                        var { idDevice, currentStatus } = data;
                        wss.clients.forEach((client) => {
                            if (client.clientType === 'esp8266') {
                                client.send(JSON.stringify({ type: 'toggleDevice', currentStatus, idDevice }));
                            }
                        });
                        break;
                    case 'automatic':
                        var { status, idDevice } = data;
                        wss.clients.forEach((client) => {
                            if (client.clientType === 'esp8266') {
                                client.send(JSON.stringify({ type: 'automatic', status, idDevice }));
                            }
                        });
                }
            }
        } catch (error) {
            console.error('Failed to parse JSON:', error.message);
        }

    });

    ws.on('close', () => {
        if (ws.clientType === 'esp8266') {
            isESP8266Connected = false;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && client.clientType === 'browser') {
                    client.send(JSON.stringify({ type: 'signConnection', status: false }));
                }
            });
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Phục vụ file HTML
// app.get('/', (req, res) => {
//     res.render('home');
// });
