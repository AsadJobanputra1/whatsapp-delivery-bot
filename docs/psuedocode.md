# Pseudocode for WhatsApp Proactive Contact Manager

## Overview

This pseudocode outlines the main components and functionalities of the WhatsApp Proactive Contact Manager, serving as a development roadmap.

## Modules and Components

- **Main Application (`index.js`)**
  - Initialize WhatsApp Client
    - Handle authentication and session initialization
    - Set up event listeners for client readiness and message events
  - Schedule Message Processing
    - Set interval to reprocess the CSV file periodically
    - Trigger CSV processing on client readiness

- **CSV Processor (`csvProcessor.js`)**
  - Function to read CSV file
    - Open and parse `data/info.csv`
    - Convert CSV data into an array of message objects
  - Function to process messages
    - Loop through message objects
    - Schedule messages based on date and time

- **Message Scheduler (`scheduler.js`)**
  - Function to schedule messages
    - Use a scheduling library to schedule message sending
    - Handle message execution at the specified time
  - Function to send messages
    - Send message via WhatsApp Client
    - Handle sending success and failure
    - Update message status

- **User Interface (`ui/`)**
  - **Dashboard (`dashboard.html`)**
    - Display scheduled messages
    - Provide options to edit or delete messages
  - **Schedule Message Form (`scheduleMessage.html`)**
    - Form inputs for recipient details and message content
    - Date and time picker for scheduling
  - **View Messages (`viewMessages.html`)**
    - List sent messages with status and timestamps
  - **API Endpoints (`api.js`)**
    - Endpoint to get scheduled messages
    - Endpoint to add new scheduled message
    - Endpoint to update existing message
    - Endpoint to delete a scheduled message

- **Utilities (`utils/`)**
  - **CSV Reader (`csvReader.js`)**
    - Reusable functions for reading and writing CSV files
  - **Message Formatter (`messageFormatter.js`)**
    - Functions to format messages before sending

## Pseudocode Details

### 1. Initialize WhatsApp Client

```pseudo
function initializeWhatsAppClient():
    client = new WhatsAppClient()
    client.on('qr', displayQRCode)
    client.on('ready', onClientReady)
    client.on('message', onMessageReceived)
    client.initialize()
```

### 2. On Client Ready

```pseudo
function onClientReady():
    log("WhatsApp Client is ready")
    processCSVFile()
    scheduleCSVReprocessing()
```

### 3. Process CSV File

```pseudo
function processCSVFile():
    messages = readCSVFile(DATAFILE)
    clearExistingSchedules()
    for message in messages:
        scheduleMessage(message)
```

### 4. Schedule Message

```pseudo
function scheduleMessage(message):
    datetime = parseDateTime(message.date, message.time)
    job = scheduleJob(datetime, sendWhatsAppMessage, args=(message.phonenumber, message.message))
```

### 5. Send WhatsApp Message

```pseudo
function sendWhatsAppMessage(phonenumber, messageBody):
    if client.isReady:
        client.sendMessage(phonenumber, messageBody)
        updateMessageStatus(phonenumber, "Sent")
    else:
        log("Client not ready, cannot send message")
        reinitializeClient()
```

### 6. User Interface Endpoints

```pseudo
API Endpoint: GET /scheduled-messages
    return list of scheduled messages

API Endpoint: POST /schedule-message
    extract message details from request
    validate input
    add message to CSV file
    schedule message

API Endpoint: PUT /scheduled-messages/:id
    extract updated details
    find message by id
    update message in CSV
    reschedule message

API Endpoint: DELETE /scheduled-messages/:id
    delete message from CSV
    cancel scheduled job
```

### 7. CSV Reading and Writing

```pseudo
function readCSVFile(filePath):
    open CSV file at filePath
    parse CSV data into array of objects
    return messages array

function writeCSVFile(filePath, messages):
    serialize messages array into CSV format
    write data to CSV file at filePath
```

### 8. Utility Functions

```pseudo
function parseDateTime(dateString, timeString):
    combine dateString and timeString
    return datetime object

function clearExistingSchedules():
    for job in scheduledJobs:
        job.cancel()
    clear scheduledJobs list
```

## Notes

- **Error Handling**
  - Implement try-catch blocks around critical operations
  - Log errors and provide meaningful messages

- **Concurrency**
  - Ensure thread safety when accessing shared resources like the CSV file

- **Extension Points**
  - Placeholder for implementing message editing and deletion from the UI
  - Potential for adding database support in the future

## Reflection

- The pseudocode aligns with the specifications, covering the main functional requirements.
- Potential issues include handling time zone differences and message delivery failures.
- Alternative approaches could involve using a database instead of a CSV file for scalability.
- The use of modular components facilitates maintainability and future enhancements.
