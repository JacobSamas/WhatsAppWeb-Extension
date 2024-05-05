const filters = {
    all: contact => true,
    unread: contact => contact.unread,
    awaiting: contact => contact.awaiting,
    "needs-reply": contact => contact.needsReply,
};
let contacts = [];
let customFilters = [];
let currentContact = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'applyFilter') {
        applyFilter(message.filterType, sender.tab.id);
    } else if (message.action === 'addCustomFilter') {
        addCustomFilter(message.filterName);
    } else if (message.action === 'getCustomFilters') {
        sendResponse({ filters: customFilters });
    } else if (message.action === 'getCurrentContact') {
        sendResponse(currentContact);
    } else if (message.action === 'saveNotes') {
        saveNotes(message.notes);
    }
    return true;
});

function applyFilter(filterType, tabId) {
    const filterFunction = filters[filterType] || ((contact) => contact.customFilters.includes(filterType));
    const filteredContacts = contacts.filter(filterFunction);
    chrome.tabs.sendMessage(tabId, { action: 'displayContacts', contacts: filteredContacts });
}

function addCustomFilter(filterName) {
    customFilters.push(filterName);
}

function saveNotes(notes) {
    if (currentContact) {
        currentContact.notes = notes;
    }
}
