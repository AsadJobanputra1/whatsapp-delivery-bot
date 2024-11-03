const qrcode = require("qrcode-terminal"); //whatsapp utility to establish trust with client
const moment = require('moment');
const {
    Client,
    LocalAuth
} = require('whatsapp-web.js'); //whatsapp client application
const schedule = require('node-schedule'); //scheduler used to manage delivery of messages

// Access the configurations using process.env
require('dotenv').config(); // Load configurations from .env file
const REPROCESS_CSV_IN_HOURS = process.env.REPROCESS_CSV_IN_HOURS;
const MANAGER_PHONE_NUMBER = process.env.MANAGER_PHONE_NUMBER;
const DATAFILE = process.env.DATAFILE;

const whatsAppClient = new Client({
    puppeteer: {
       // executablePath: '$HOME/.cache/puppeteer/chrome',
    },
    authStrategy: new LocalAuth(),
});


// Whatsapp events triggered when connected w whatsapp
whatsAppClient.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {
        small: true
    });
});
whatsAppClient.on('ready', () => {
    console.info(`whatsapp client is ready! (${new Date()})`);
    whatsAppClient.isReady = true;

    // send message to process manager that whatsapp bot has started
    m = `Whatsapp Bot has now started\n${new Date()}`;
    sendWhatsAppMessage(MANAGER_PHONE_NUMBER,m)
    m = `Whatsapp test 12 now started\n${new Date()}`;
    sendWhatsAppMessage(MANAGER_PHONE_NUMBER,m)

    // process CSV file after whatsAppClient is ready.
    //processCSVFile();

});
whatsAppClient.on("authenticated", () => {
    console.info(`Authentication complete. (${new Date()})`);
});
// executed when system recieves a message
whatsAppClient.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
    console.info("message recieved \n" + msg.body + "message start ============\n" 
    + JSON.stringify(msg)
    + "message end ============\n" 
    );
});
whatsAppClient.isReady = false;
whatsAppClient.initialize();
/**
 * sendWhatsAppMessage sends a message to a phone number already in your contact list.
 * @param {Number} _number  phone number of recipient with country code. 
 * @param {Number} _message message to send in UTF8?
 */
function sendWhatsAppMessage(_number, _message) {

    console.log(`Attempting to sending message to ${_number} message: ${_message} at ${Date()}`);
    try {
        if (whatsAppClient.isReady) {
            _number = _number.replace(/[\+\-\(\) ]/g, "");
            console.log(`Sending message to "${_number}" message: "${_message}"`);
            whatsAppClient.sendMessage(_number + "@c.us", _message, {
                sendSeen: true
            });

        } else {
            console.log(`WhatsAppClient is NOT Ready. Unable to send message to ${_number}, with message:${_message}.`)
            whatsAppClient.initialize();
        }
    } catch (e) {
        console.debug("sendWhatsAppMessage has thrown an exception and it was caught, execution continues.\n Message was " + e)
    }
}

/**
 * readCSV accepts a path to a csv file and returns the contents of the CSV file in an array.
 * @param {String} filePath 
 * @returns array of objects, each object has the column name as the key, and the data as the value.
 */
function readCSVFile(filePath) {
    const fs = require('fs');
    const csv = require('csv-parser');

    return new Promise((resolve, reject) => {
        var results = [];

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

function processCSVFile() {

    readCSVFile(DATAFILE)
        .then((records) => {
            //console.log(`csv file read: \r\n ${JSON.stringify(records)}`);
            schedule.gracefulShutdown();
            //for each message in csv setup a time to deliver the message
            for (message of records) {

                const dt = moment(`${message.date} ${message.time} EST`, 'YYYY/MM/DD HH:mm tz');
                console.log(`Creating scheduler for: at ${message.phonenumber} ${message.date} ${message.time} EST: ${message.message}`)

                //in async mode, no parameters, so keep this.phoneNumber and this.messageBody in scope available for sendWhatsAppMessage()
                phoneNumber = message.phonenumber;
                messageBody = message.message.replace(/\\n/g,"\n"); //escape out \n so that u can get multi-line messages
                jobname = `${message.phonenumber} ${message.date} ${message.time}: ${message.message}`;
                const cronExpression = `${dt.seconds()} ${dt.minutes()} ${dt.hours()} ${dt.date()} ${dt.month()+1} *`;

                // d = new Date(Date.now() + 65000)
                // const cronExpression = `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth()+1} *`;
                //console.debug(`cron expression "${cronExpression}"`);

                // create the scheduled job at appropriate time to run sendWhatsAppMessage funtion. 
                // use bind function to pass parameters into async function on call back
                const job = schedule.scheduleJob(jobname,
                    cronExpression,
                    sendWhatsAppMessage.bind(null, phoneNumber, messageBody)
                );

            }
        })
        .catch((error) => {
            console.error('Error reading CSV file:', error);
        });


}


function scheduleTestMessage(dateTime, phoneNumber, Message) {
    // send message on startup (also used to verify scheduler is working correctly)
    d = dateTime;
    const cronExpression = `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth()+1} *`;
    const job = schedule.scheduleJob('startupSchedule',
        cronExpression,
        sendWhatsAppMessage.bind(null, phoneNumber, Message)
    );

}

processCSVFile();
setInterval(processCSVFile, REPROCESS_CSV_IN_HOURS * 60 * 60 * 1000);
scheduleTestMessage(new Date(Date.now() + 65000), MANAGER_PHONE_NUMBER, `Whatsapp Bot\n has started%0A${new Date()}`);
console.log(`Whatsapp Bot has started%0A ${Date()}`)