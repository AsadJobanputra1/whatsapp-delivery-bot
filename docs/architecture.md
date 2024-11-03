# Architecture for WhatsApp Proactive Contact Manager

## Overview

This document defines the system architecture and technical design for the WhatsApp Proactive Contact Manager application, following the SPARC framework.

## Architectural Style

The application will use a **Model-View-Controller (MVC)** architectural pattern.

### Justification

- **Separation of Concerns**: MVC separates the application into three interconnected components, allowing for efficient code organization and maintainability.
- **Scalability**: MVC supports growth by enabling developers to extend individual components without affecting others.
- **Reusability**: Components like models and views can be reused across different parts of the application.

## System Architecture Diagram

*(A diagram would be included here in a visual format.)*

### Components and Interactions

1. **Model**
   - **Data Layer**: Interacts with the CSV file (`data/info.csv`) for reading and writing scheduled messages.
   - **Data Models**: Defines the data structures for scheduled messages.

2. **View**
   - **User Interface**: Consists of HTML pages in `src/ui/`:
     - `dashboard.html`
     - `scheduleMessage.html`
     - `viewMessages.html`
   - **Purpose**: Allows users to interact with the application by scheduling messages, viewing scheduled messages, and viewing sent messages.

3. **Controller**
   - **Application Logic**: Handles user inputs and interactions between the Model and View.
   - **Routes and Endpoints**: Defined in `src/api.js` using Express.js to manage scheduled messages.

4. **WhatsApp Client**
   - **Integration Layer**: Manages the connection to WhatsApp using the `whatsapp-web.js` library.
   - **Authentication and Session Management**: Handles QR code generation and session persistence.
   - **Event Handling**: Responds to events like receiving messages and client readiness.

5. **Scheduler**
   - **Message Scheduler**: Uses `node-schedule` to schedule and execute message sending tasks.
   - **Task Management**: Schedules tasks based on data from the CSV file.

## Technology Stack

- **Backend**: Node.js with Express.js
  - **Justification**: Provides a robust environment for building scalable network applications and APIs.
- **Frontend**: HTML, CSS, JavaScript
  - **Justification**: Allows for a simple and accessible user interface that can be easily extended.
- **Database**: Flat CSV file (`data/info.csv`)
  - **Justification**: Meets the requirement for a lightweight database suitable for a single-user application.
- **Scheduler**: `node-schedule` package
  - **Justification**: Flexible cron-like scheduler for Node.js applications.
- **WhatsApp Integration**: `whatsapp-web.js` library
  - **Justification**: Simplifies the process of connecting and interacting with WhatsApp Web.
- **Environment Configuration**: `.env` files managed by `dotenv` package
  - **Justification**: Securely manages configuration variables.

## Data Models and Schemas

### ScheduledMessage Model

```javascript
{
  id: Number,
  recipientName: String,
  phoneNumber: String,
  date: String,       // Format: 'YYYY/MM/DD'
  time: String,       // Format: 'HH:mm'
  message: String,
  status: String      // 'Pending', 'Sent', 'Failed'
}
```

- **CSV Structure**: The headers in `data/info.csv` correspond to the fields in the `ScheduledMessage` model.

## Key Components

1. **`src/index.js`**
   - Entry point of the application.
   - Initializes the WhatsApp client.
   - Starts the Express.js server.

2. **`src/whatsappClient.js`**
   - Manages WhatsApp client events.
   - Handles message sending and reception.

3. **`src/scheduler.js`**
   - Reads the CSV file and schedules messages.
   - Uses `node-schedule` to handle timing.

4. **`src/api.js`**
   - Defines RESTful API endpoints for the frontend to interact with the backend.
   - Handles CRUD operations for scheduled messages.

5. **`src/utils/csvReader.js`**
   - Contains functions to read from and write to the CSV file.
   - Ensures data integrity and proper formatting.

6. **`src/utils/messageFormatter.js`**
   - Provides utilities for formatting messages before sending.

7. **`src/ui/`**
   - Contains HTML files and associated assets for the user interface.
   - Interfaces with `api.js` through AJAX or form submissions.

## Scalability, Security, and Performance

### Scalability

- **Horizontal Scalability**: While designed for single-user use, the application structure allows for future enhancements to support multiple users.
- **Modularity**: Components are decoupled, making it easier to scale specific parts of the application.

### Security

- **Data Security**: Sensitive information is managed via environment variables in `.env` files.
- **WhatsApp Session Security**: Authentication data is stored securely using `whatsapp-web.js` encryption.
- **Input Validation**: All user inputs are validated on both the client and server sides to prevent injection attacks.

### Performance

- **Lightweight Database**: Using a CSV file minimizes overhead for data storage and retrieval.
- **Efficient Scheduling**: `node-schedule` efficiently handles timing without consuming excessive resources.
- **Asynchronous Operations**: Non-blocking I/O operations enhance performance under load.

## Reflection

The chosen architecture aligns with the project's goals and constraints:

- **MVC Pattern**: Facilitates organized code, making development and maintenance more manageable.
- **Technology Choices**: Node.js and Express.js are suitable for both the API and real-time communication required by the WhatsApp client.
- **CSV Data Storage**: Meets the non-functional requirement of a lightweight database while keeping the application simple.

**Potential Bottlenecks and Mitigations**:

- **CSV File Concurrency**: Concurrent access might lead to data corruption.
  - *Mitigation*: Implement file-locking mechanisms or consider migrating to a lightweight database like SQLite if scalability becomes a concern.
- **WhatsApp Web Session Stability**: The session may disconnect or expire.
  - *Mitigation*: Implement reconnection logic and notify the user if re-authentication is required.
- **Time Zone Handling**: Users in different time zones might experience scheduling issues.
  - *Mitigation*: Standardize all times to UTC within the application and convert times based on the user's locale for display purposes.

**Future-Proofing**:

- The modular design allows for easy integration of additional features, such as migrating to a relational database or adding multi-user support.
- The use of standard technologies and patterns makes onboarding new developers more straightforward.

**AI Models Usage**:

- While AI models are not directly used in the application's architecture, leveraging tools like **Perplexity** during the design phase enhanced research efficiency.
- Utilizing different AI models for development could streamline coding tasks, though caution must be taken to ensure code quality and security.

---
