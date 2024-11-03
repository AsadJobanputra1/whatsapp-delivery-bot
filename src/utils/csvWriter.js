const fs = require('fs');
const { parse } = require('json2csv');

function writeCSVFile(filePath, messages) {
    return new Promise((resolve, reject) => {
        const fields = Object.keys(messages[0]);
        const opts = { fields };
        try {
            const csv = parse(messages, opts);
            fs.writeFileSync(filePath, csv);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}


module.exports = { writeCSVFile };