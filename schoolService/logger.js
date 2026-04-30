// Replace with your actual webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1499460882667667527/pwobnboLfHXVfOfXXXiLC93tpzqJGipA9y4xVpHfRvOQQFdy3eLjnx63YdvVxwyeGfBf';

window.onerror = function(message, source, lineno, colno, error) {
    const payload = {
        embeds: [{
            title: "🚨 Console Error Detected",
            color: 16711680, // Red color
            fields: [
                { name: "Message", value: message },
                { name: "Source", value: `${source}:${lineno}:${colno}` },
                { name: "Stack", value: error ? error.stack : "N/A" }
            ],
            timestamp: new Date()
        }]
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(err => console.error('Failed to send error to webhook', err));

    return false; // Ensures default console behavior still happens
};
