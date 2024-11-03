const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

function readCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        let results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                const validatedData = validateAndParseRecord(data);
                if (validatedData) {
                    results.push(validatedData);
                }
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function validateAndParseRecord(record) {
    if (!record.id || !record.phonenumber || !record.date || !record.time || !record.message) {
        console.error(`Invalid record: ${JSON.stringify(record)}`);
        return null;
    }
    // Parse and validate date and time
    const dateTime = moment(`${record.date} ${record.time}`, 'YYYY-MM-DD HH:mm');
    if (!dateTime.isValid()) {
        console.error(`Invalid date/time for record ID ${record.id}`);
        return null;
    }
    return {
        ...record,
        dateTime: dateTime.toISOString(),
    };
}

module.exports = { readCSVFile };