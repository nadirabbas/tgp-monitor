const https = require('https');
const fs = require('fs');

const URL = 'https://thegamepost.com';
const INTERVAL = 60000; // 1 minute
const LOG_FILE = './logs/site_monitor.log';

function checkSite() {
    const start = Date.now();
    let dnsLookupAt, connectAt;

    const req = https.get(URL, (res) => {
        const totalTime = (Date.now() - start) / 1000;
        const log = `[${new Date().toISOString()}] Status: ${res.statusCode} | Total: ${totalTime.toFixed(3)}s\n`;
        
        console.log(log.trim());
        fs.appendFileSync(LOG_FILE, log);
    });

    req.on('socket', (socket) => {
        socket.on('lookup', () => dnsLookupAt = Date.now());
        socket.on('connect', () => connectAt = Date.now());
    });

    req.on('error', (e) => {
        const log = `[${new Date().toISOString()}] ERROR: ${e.message}\n`;
        console.error(log.trim());
        fs.appendFileSync(LOG_FILE, log);
    });
}

// Start the loop
console.log(`Monitoring ${URL} every 60 seconds...`);
setInterval(checkSite, INTERVAL);
checkSite(); // Initial run
