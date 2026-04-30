// goofy file ignore
const WEBHOOK_URL = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ5OTQ2MDg4MjY2NzY2NzUyNy9wd29ibmJvTGZYVlZPZlhYWGpMQzkzdHB6cUpHaXBBOXk0eFZwSGZSdk9RUWZkeTNlTGpueDYzWWR2Vnh3eWVHZkJm');

// Helper function to send the payload to Discord
function sendToDiscord(title, message, source = "N/A", stack = "N/A") {
    const payload = {
        embeds: [{
            title: title,
            color: 16711680, // Red
            fields: [
                { name: "Message", value: String(message).substring(0, 1024) }, // Discord limit
                { name: "Source", value: String(source).substring(0, 1024) },
                { name: "Stack", value: String(stack).substring(0, 1024) }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(err => {
        // Can't use console.error here if we override it below, otherwise we get an infinite loop!
        console.warn('Failed to send error to webhook', err);
    });
}

// 1. Catch unhandled exceptions (Your original code)
window.onerror = function(message, source, lineno, colno, error) {
    sendToDiscord(
        "Unhandled Exception",
        message,
        `${source}:${lineno}:${colno}`,
        error ? error.stack : "N/A"
    );
    return false; // Let it still print to the browser console
};

// 2. Catch unhandled Promise rejections
window.addEventListener('unhandledrejection', function(event) {
    sendToDiscord(
        "Unhandled Promise Rejection",
        event.reason,
        "Promise",
        event.reason && event.reason.stack ? event.reason.stack : "N/A"
    );
});

// 3. Intercept explicit console.error() calls
const originalConsoleError = console.error;
console.error = function(...args) {
    // Call the original console.error so it still shows in the browser
    originalConsoleError.apply(console, args);

    // Format the arguments into a single string
    const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    // Capture the stack trace by generating a dummy error
    const stack = new Error().stack || "N/A";

    sendToDiscord("Console Error Logged", message, "console.error", stack);
};