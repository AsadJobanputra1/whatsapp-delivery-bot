/**
 * Main entry point for the WhatsApp messaging application.
 * Initializes the WhatsAppManager and handles any uncaught errors.
 */

const WhatsAppManager = require('./whatsappManager');

// Handle any uncaught errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Initialize WhatsApp manager
const whatsAppManager = new WhatsAppManager();

console.log('WhatsApp Manager initialized and running...');
