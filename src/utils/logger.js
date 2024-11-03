const fs = require('fs');
const path = require('path');

function logInfo(message) {
    const logMessage = `${new Date().toISOString()} INFO: ${message}\n`;
    console.info(message);
    fs.appendFile(path.join(__dirname, '../../logs/info.log'), logMessage, (err) => {
        if (err) throw err;
    });
}

function logError(message) {
    const logMessage = `${new Date().toISOString()} ERROR: ${message}\n`;
    console.error(message);
    fs.appendFile(path.join(__dirname, '../../logs/error.log'), logMessage, (err) => {
        if (err) throw err;
    });
}

module.exports = { logInfo, logError };