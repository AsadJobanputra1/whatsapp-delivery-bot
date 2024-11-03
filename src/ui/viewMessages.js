document.addEventListener('DOMContentLoaded', loadMessages);
document.getElementById('searchInput').addEventListener('input', filterMessages);

let messages = [];

async function loadMessages() {
    const response = await fetch('/scheduled-messages');
    if (response.ok) {
        messages = await response.json();
        displayMessages(messages);
    } else {
        alert('Error loading messages');
    }
}

function displayMessages(messagesToDisplay) {
    const container = document.getElementById('messagesContainer');
    container.innerHTML = '';
    messagesToDisplay.forEach((msg) => {
        const card = document.createElement('div');
        card.className = 'message-card';
        card.innerHTML = `
            <h3>${msg.recipient}</h3>
            <p>${msg.message}</p>
            <p>Scheduled for: ${msg.date} ${msg.time}</p>
            <button onclick="editMessage(${msg.id})">Edit</button>
            <button onclick="deleteMessage(${msg.id})">Delete</button>
        `;
        container.appendChild(card);
    });
}

function filterMessages() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = messages.filter((msg) =>
        msg.recipient.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query)
    );
    displayMessages(filtered);
}

function editMessage(id) {
    // Redirect to edit page (to be implemented)
}

async function deleteMessage(id) {
    const confirmed = confirm('Are you sure you want to delete this message?');
    if (confirmed) {
        const response = await fetch(`/scheduled-messages/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Message deleted successfully');
            loadMessages();
        } else {
            alert('Error deleting message');
        }
    }
}