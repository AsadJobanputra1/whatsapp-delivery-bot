const { readCSVFile } = require('./utils/csvProcessor');
const { scheduleMessages } = require('./scheduler');
require('dotenv').config();

const DATAFILE = process.env.DATAFILE;

class WhatsAppClientHandler {
    constructor() {
        this.eventHandlers = {};
    }

    on(event, callback) {
        this.eventHandlers[event] = callback;
        if (event === 'ready') {
            // Simulate ready event immediately for now
            setTimeout(() => {
                callback();
            }, 0);
        }
    }
}

const whatsAppClientHandler = new WhatsAppClientHandler();

whatsAppClientHandler.on('ready', () => {
    console.info('WhatsApp Client is ready. Processing CSV file...');
    processCSVFile();
});

function processCSVFile() {
    readCSVFile(DATAFILE)
        .then((records) => {
            scheduleMessages(records, whatsAppClientHandler);
        })
        .catch((error) => {
            console.error('Error reading CSV file:', error);
        });
}

module.exports = whatsAppClientHandler;
