function formatMessage(template, variables) {
    let message = template;
    for (const key in variables) {
        const placeholder = `{{${key}}}`;
        message = message.replace(new RegExp(placeholder, 'g'), variables[key]);
    }
    return message;
}

module.exports = { formatMessage };