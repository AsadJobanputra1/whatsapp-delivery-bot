/**
 * Main entry point for the WhatsApp messaging application.
 * Initializes the WhatsAppManager and API server, and handles any uncaught errors.
 */

const WhatsAppManager = require('./whatsappManager');
const createApp = require('./api');

// Handle any uncaught errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Initialize WhatsApp manager and API server
async function main() {
    try {
        // Initialize WhatsApp manager
        const whatsAppManager = new WhatsAppManager();
        console.log('WhatsApp Manager instance created...');
        
        await whatsAppManager.initializeClient();
        console.log('WhatsApp Manager initialized and running in background...');

        // Initialize API server
        const app = createApp(whatsAppManager);
        const PORT = process.env.PORT || 3000;
        
        app.listen(PORT, () => {
            console.log(`API Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Initialization error:', error);
        process.exit(1);
    }
}

main().catch(console.error);
