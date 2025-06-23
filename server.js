import { createServer } from "http";
import { createServer as createHttpsServer } from "https";
import { WebSocketServer } from "ws";
import fs from 'fs/promises';

// 1. Création des serveurs HTTP et HTTPS
const httpsServer = createHttpsServer({
    key: await fs.readFile('keys/private.key'),
    cert: await fs.readFile('keys/certificate.crt')
});

// 2. Création des WebSocket Servers
const wssHttps = new WebSocketServer({ server: httpsServer });

// 3. Gestion des clients
function setupWebSocket(wss) {
    const clients = [];
    
    wss.on('connection', ws => {
        clients.push(ws);
        
        ws.on('message', message => {
            clients.forEach(client => {
                if (client !== ws && client.readyState === 1) { // 1 = OPEN
                    client.send(message.toString());
                }
                console.log(message,client)
            });
        });
        
        ws.on('close', () => {
            const index = clients.indexOf(ws);
            if (index !== -1) {
                clients.splice(index, 1);
            }
            
            // Notifier tous les autres clients de la déconnexion
            clients.forEach(client => {
                if (client.readyState === 1) { // 1 = OPEN
                    client.send(JSON.stringify({ 
                        type: 'peer_disconnected' 
                    }));
                }
            });
        });
    });
}

setupWebSocket(wssHttps);

// 4. Gestion des requêtes HTTP/HTTPS
async function handleRequest(req, res) {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './public/sender.html';
    
    try {
        const content = await fs.readFile(filePath);
        res.writeHead(200);
        res.end(content);
    } catch (err) {
        res.writeHead(404);
        res.end('Fichier non trouvé');
    }
}

httpsServer.on('request', handleRequest);

// 5. Démarrage des serveurs

httpsServer.listen(443, "0.0.0.0", () => {
    console.log('HTTPS Server: https://localhost:443');
    console.log('WebSocket Server: wss://localhost:443');
});