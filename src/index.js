const WhatsAppClientHandler = require('./whatsappClient');
const { readCSVFile } = require('./utils/csvProcessor');
const { scheduleMessages } = require('./scheduler');

require('dotenv').config();
const REPROCESS_CSV_IN_HOURS = process.env.REPROCESS_CSV_IN_HOURS;
const MANAGER_PHONE_NUMBER = process.env.MANAGER_PHONE_NUMBER;
const DATAFILE = process.env.DATAFILE;

const whatsAppClientHandler = new WhatsAppClientHandler();

whatsAppClientHandler.on('ready', () => {
    console.info('WhatsApp Client is ready. Processing CSV file...');
    sendStartupMessage();
    processCSVFile();
    setInterval(processCSVFile, REPROCESS_CSV_IN_HOURS * 60 * 60 * 1000);
});

function sendStartupMessage() {
    const message = `WhatsApp Bot has now started\n${new Date()}`;
    whatsAppClientHandler.sendMessage(MANAGER_PHONE_NUMBER, message);
}

function processCSVFile() {
    readCSVFile(DATAFILE)
        .then((records) => {
            scheduleMessages(records, whatsAppClientHandler);
        })
        .catch((error) => {
            console.error('Error reading CSV file:', error);
        });
}