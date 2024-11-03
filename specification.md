# Specification for WhatsApp Proactive Contact Manager

## Project Overview

### Project Name

**WhatsApp Proactive Contact Manager**

### Project Goal

To proactively keep in touch with contacts and not forget birthdays or special occasions.

### Target Audience

Technical users who wish to use and configure this program to automate sending scheduled messages via WhatsApp.

## Functional Requirements

1. **User Interface to View Scheduled Messages**

   - A dashboard displaying all messages that are queued and scheduled in the system.
   - Ability to filter messages based on status (sent, pending, failed).
   - Option to edit or delete scheduled messages.

2. **User Interface to View Sent Messages and Their Status**

   - Display all messages that have been sent to end-users.
   - Show delivery status (e.g., delivered, read).
   - Timestamp of when messages were sent.

3. **Background Program to Connect to WhatsApp and Send Messages**

   - A backend service that connects to WhatsApp using the WhatsApp Web API.
   - Reads scheduled messages from a data source (e.g., CSV file).
   - Sends messages at the specified date and time.
   - Handles authentication and maintains session with WhatsApp.

## Non-Functional Requirements

1. **Technology Stack**

   - The application should be written in Node.js.

2. **Lightweight Database**

   - Use a flat CSV file (e.g., `data/info.csv`) for data storage to keep the system simple.

3. **Single-User Design**

   - The application is designed for use by a single person.

## User Scenarios and User Flows

### User Scenario 1: Scheduling a Birthday Message for a Friend

**User**: Sarah wants to ensure she doesn't forget her best friend's birthday.

#### Steps:

1. **Login**: Sarah opens the WhatsApp Proactive Contact Manager application.

2. **Schedule New Message**: She selects "Schedule New Message" from the dashboard.

3. **Enter Contact Details**: She enters her friend's name and phone number.

4. **Compose Message**: Sarah writes, "Happy Birthday! 🎉 Hope you have an amazing day!" in the message text input.

5. **Set Date and Time**: She selects the date of her friend's birthday and sets the time to 9:00 AM.

6. **Confirm Schedule**: She clicks on "Schedule".

7. **Confirmation**: The system confirms that her birthday message has been successfully scheduled.

8. **Outcome**: On her friend's birthday at 9:00 AM, the app automatically sends the message via WhatsApp. Sarah can see the status as "Sent" in her scheduled messages.

### User Scenario 2: Rescheduling a Message

**User**: Mike needs to change the date of a meeting reminder he previously scheduled.

#### Steps:

1. **View Scheduled Messages**: Mike logs in and navigates to "View Scheduled Messages".

2. **Locate Message**: He searches for the meeting reminder.

3. **Edit Message**: Mike selects the message and chooses "Edit".

4. **Update Date and Time**: He changes the date from March 2nd to March 4th.

5. **Save Changes**: He saves the updated schedule.

6. **Confirmation**: The app confirms that the changes have been saved.

7. **Outcome**: The meeting reminder is rescheduled, and Mike can see the updated date and time.

### User Scenario 3: Deleting a Scheduled Message

**User**: Raj wants to delete a mistakenly scheduled message.

#### Steps:

1. **View Scheduled Messages**: Raj logs in and selects "View Scheduled Messages".

2. **Locate Message**: He finds the incorrect message.

3. **Delete Message**: Raj selects "Delete".

4. **Confirmation Prompt**: The app asks for confirmation; Raj confirms.

5. **Outcome**: The message is deleted from the schedule.

## UI/UX Considerations

1. **Home Dashboard**

   - Simple layout with key features prominently displayed.
   - Buttons for "Schedule New Message" and "View Scheduled Messages".

2. **Schedule a New Message Screen**

   - Form with input fields for contact name, phone number, message content, date, and time.
   - Character counter for message text.
   - "Schedule" button to confirm scheduling.

3. **View Scheduled Messages Screen**

   - List of scheduled messages displayed as cards.
   - Each card shows recipient name, message preview, scheduled date and time, and status.
   - Options to edit or delete messages.
   - Search and filter functionality.

4. **Design Elements**

   - Use colors complementary to WhatsApp's branding (green and white).
   - Clear typography for readability.
   - Icons representing actions (e.g., edit, delete, status indicators).

## File Structure Proposal

```
project-root/
├── src/
│   ├── index.js
│   ├── whatsappClient.js
│   ├── scheduler.js
│   ├── ui/
│   │   ├── dashboard.html
│   │   ├── scheduleMessage.html
│   │   ├── viewMessages.html
│   └── utils/
│       ├── csvReader.js
│       └── messageFormatter.js
├── data/
│   └── info.csv
├── docs/
│   ├── specification.md
│   ├── conventions.md
│   └── sparc.md
├── configs/
│   └── .env
├── .gitignore
├── package.json
├── package-lock.json
└── readme.md
```

## Assumptions

- Users are technical and can manage configurations via files like `.env`.
- The application will run on a server that can maintain an active WhatsApp Web session.
- Only one user will use the application, eliminating the need for multi-user authentication and authorization.
- The CSV file `data/info.csv` serves as the primary data source for scheduled messages.

## Reflection

Including both a user interface and background service addresses the need for ease of use and automation. The UI allows users to interact with the system without modifying files directly, reducing the potential for errors. Using Node.js and a flat CSV file aligns with the technical constraints and keeps the application lightweight.

Potential challenges include maintaining a stable connection with WhatsApp Web and handling authentication sessions. Mitigation strategies involve using existing libraries like `whatsapp-web.js` and implementing appropriate error handling and reconnection logic.

This specification lays out a clear roadmap for development, ensuring all functional and non-functional requirements are addressed to meet the project goals.
