/**
 * This file initializes and manages a WhatsApp client using the whatsapp-web.js library.
 * It reads scheduled messages from a CSV file and sends them at the specified times.
 * The file also handles WhatsApp client events such as authentication and message reception.
 * 
 * Major Functions:
 * - sendWhatsAppMessage: Sends a message to a specified phone number using the WhatsApp client.
 * - readCSVFile: Reads a CSV file and returns its contents as an array of objects.
 * - processCSVFile: Processes the CSV file to schedule messages based on the data.
 * - scheduleTestMessage: Schedules a test message to verify the scheduler is working correctly.
 */

const qrcode = require("qrcode-terminal");
const moment = require('moment');
const { Client, LocalAuth } = require('whatsapp-web.js');
const schedule = require('node-schedule');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

class WhatsAppManager {
    constructor() {
        this.REPROCESS_CSV_IN_HOURS = process.env.REPROCESS_CSV_IN_HOURS;
        this.MANAGER_PHONE_NUMBER = process.env.MANAGER_PHONE_NUMBER;
        this.DATAFILE = process.env.DATAFILE;
        this.whatsAppClient = new Client({
            puppeteer: {},
            authStrategy: new LocalAuth(),
        });
        this.whatsAppClient.isReady = false;
        this.initializeClient();
    }

    initializeClient() {
        this.whatsAppClient.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.generate(qr, { small: true });
        });

        this.whatsAppClient.on('ready', () => {
            console.info(`whatsapp client is ready! (${new Date()})`);
            this.whatsAppClient.isReady = true;
            this.sendWhatsAppMessage(this.MANAGER_PHONE_NUMBER, `Whatsapp Bot has now started\n${new Date()}`);
            this.processCSVFile();
        });

        this.whatsAppClient.on("authenticated", () => {
            console.info(`Authentication complete. (${new Date()})`);
        });

        this.whatsAppClient.on('message', msg => {
            if (msg.body == '!ping') {
                msg.reply('pong');
            }
            console.info("message received \n" + msg.body);
        });

        this.whatsAppClient.initialize();
    }

    sendWhatsAppMessage(_number, _message) {
        console.log(`Attempting to send message to ${_number} message: ${_message} at ${Date()}`);
        try {
            if (this.whatsAppClient.isReady) {
                _number = _number.replace(/[\+\-\(\) ]/g, "");
                console.log(`Sending message to "${_number}" message: "${_message}"`);
                this.whatsAppClient.sendMessage(_number + "@c.us", _message, { sendSeen: true });
            } else {
                console.log(`WhatsAppClient is NOT Ready. Unable to send message to ${_number}, with message:${_message}.`);
                this.whatsAppClient.initialize();
            }
        } catch (e) {
            console.debug("sendWhatsAppMessage has thrown an exception and it was caught, execution continues.\n Message was " + e);
        }
    }

    readCSVFile(filePath) {
        return new Promise((resolve, reject) => {
            let results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    results.push(data);
                })
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    processCSVFile() {
        this.readCSVFile(this.DATAFILE)
            .then((records) => {
                schedule.gracefulShutdown();
                for (let message of records) {
                    const dt = moment(`${message.date} ${message.time} EST`, 'YYYY/MM/DD HH:mm tz');
                    console.log(`Creating scheduler for: at ${message.phonenumber} ${message.date} ${message.time} EST: ${message.message}`);
                    const phoneNumber = message.phonenumber;
                    const messageBody = message.message.replace(/\\n/g, "\n");
                    const jobname = `${message.phonenumber} ${message.date} ${message.time}: ${message.message}`;
                    const cronExpression = `${dt.seconds()} ${dt.minutes()} ${dt.hours()} ${dt.date()} ${dt.month() + 1} *`;
                    schedule.scheduleJob(jobname, cronExpression, this.sendWhatsAppMessage.bind(this, phoneNumber, messageBody));
                }
            })
            .catch((error) => {
                console.error('Error reading CSV file:', error);
            });
    }

    scheduleTestMessage(dateTime, phoneNumber, Message) {
        const cronExpression = `${dateTime.getSeconds()} ${dateTime.getMinutes()} ${dateTime.getHours()} ${dateTime.getDate()} ${dateTime.getMonth() + 1} *`;
        schedule.scheduleJob('startupSchedule', cronExpression, this.sendWhatsAppMessage.bind(this, phoneNumber, Message));
    }
}

module.exports = WhatsAppManager;
