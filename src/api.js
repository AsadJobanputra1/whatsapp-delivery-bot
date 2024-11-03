const express = require('express');
const bodyParser = require('body-parser');
const { readCSVFile } = require('./utils/csvProcessor');
const { writeCSVFile } = require('./utils/csvWriter');
const { scheduleMessages, clearExistingSchedules } = require('./scheduler');
const app = express();
app.use(bodyParser.json());

require('dotenv').config();
const DATAFILE = process.env.DATAFILE;
const PORT = process.env.PORT || 3000;

let messagesCache = [];

app.get('/scheduled-messages', async (req, res) => {
    try {
        const records = await readCSVFile(DATAFILE);
        res.json(records);
        messagesCache = records;
    } catch (error) {
        res.status(500).send('Error reading scheduled messages');
    }
});

app.post('/schedule-message', async (req, res) => {
    const newMessage = req.body;
    // Validate input data
    if (!newMessage.phonenumber || !newMessage.date || !newMessage.time || !newMessage.message) {
        return res.status(400).send('Missing required fields');
    }
    try {
        const records = await readCSVFile(DATAFILE);
        newMessage.id = generateUniqueId(records);
        records.push(newMessage);
        await writeCSVFile(DATAFILE, records);
        messagesCache = records;
        clearExistingSchedules();
        scheduleMessages(records, whatsAppClientHandler);
        res.send('Message scheduled successfully');
    } catch (error) {
        res.status(500).send('Error scheduling message');
    }
});

app.put('/scheduled-messages/:id', async (req, res) => {
    const messageId = req.params.id;
    const updatedMessage = req.body;
    try {
        let records = await readCSVFile(DATAFILE);
        const index = records.findIndex((msg) => msg.id == messageId);
        if (index === -1) {
            return res.status(404).send('Message not found');
        }
        records[index] = { ...records[index], ...updatedMessage };
        await writeCSVFile(DATAFILE, records);
        messagesCache = records;
        clearExistingSchedules();
        scheduleMessages(records, whatsAppClientHandler);
        res.send('Message updated successfully');
    } catch (error) {
        res.status(500).send('Error updating message');
    }
});

app.delete('/scheduled-messages/:id', async (req, res) => {
    const messageId = req.params.id;
    try {
        let records = await readCSVFile(DATAFILE);
        records = records.filter((msg) => msg.id != messageId);
        await writeCSVFile(DATAFILE, records);
        messagesCache = records;
        clearExistingSchedules();
        scheduleMessages(records, whatsAppClientHandler);
        res.send('Message deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting message');
    }
});

function generateUniqueId(records) {
    return records.length > 0 ? Math.max(...records.map((msg) => parseInt(msg.id))) + 1 : 1;
}

const WhatsAppClientHandler = require('./whatsappClient');
const whatsAppClientHandler = new WhatsAppClientHandler();

const { scheduleMessages } = require('./scheduler');

whatsAppClientHandler.on('ready', () => {
    console.info('WhatsApp Client is ready. Processing CSV file...');
    processCSVFile();
});

function processCSVFile() {
    readCSVFile(DATAFILE)
        .then((records) => {
            messagesCache = records;
            scheduleMessages(records, whatsAppClientHandler);
        })
        .catch((error) => {
            console.error('Error reading CSV file:', error);
        });
}

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});