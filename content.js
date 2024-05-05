chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'displayContacts') {
        displayContacts(message.contacts);
    }
});

function displayContacts(contacts) {
    console.log('Displaying contacts:', contacts);
}
