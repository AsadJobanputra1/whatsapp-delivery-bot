const schedule = require('node-schedule');
const moment = require('moment');
let scheduledJobs = [];

function scheduleMessages(messages, whatsAppClientHandler) {
    clearExistingSchedules();
    for (let message of messages) {
        scheduleMessage(message, whatsAppClientHandler);
    }
}

function scheduleMessage(message, whatsAppClientHandler) {
    const dateTime = moment(`${message.date} ${message.time}`, 'YYYY-MM-DD HH:mm');
    if (dateTime.isValid() && dateTime.isAfter(moment())) {
        const jobName = `${message.phonenumber} ${message.date} ${message.time}: ${message.message}`;
        const job = schedule.scheduleJob(jobName, dateTime.toDate(), function () {
            whatsAppClientHandler.sendMessage(message.phonenumber, message.message);
        });
        scheduledJobs.push(job);
    } else {
        console.log(`Invalid or past date/time for message ID: ${message.id}`);
    }
}

function clearExistingSchedules() {
    for (let job of scheduledJobs) {
        job.cancel();
    }
    scheduledJobs = [];
}

module.exports = { scheduleMessages, clearExistingSchedules };
