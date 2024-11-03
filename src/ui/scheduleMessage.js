document.getElementById('message').addEventListener('input', updateCharCount);
document.getElementById('scheduleForm').addEventListener('submit', submitForm);

function updateCharCount() {
    const message = document.getElementById('message').value;
    document.getElementById('charCount').textContent = `${message.length}/500`;
}

async function submitForm(event) {
    event.preventDefault();
    const data = {
        recipient: document.getElementById('recipient').value,
        phonenumber: document.getElementById('phonenumber').value,
        message: document.getElementById('message').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
    };
    const response = await fetch('/schedule-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        alert('Message scheduled successfully');
        window.location.href = 'viewMessages.html';
    } else {
        alert('Error scheduling message');
    }
}