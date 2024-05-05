document.addEventListener('DOMContentLoaded', () => {
    // Filter button event listeners
    document.getElementById('filter-all').addEventListener('click', () => applyFilter('all'));
    document.getElementbyId('filter-unread').addEventListener('click', () => applyFilter('unread'));
    document.getElementbyId('filter-awaiting').addEventListener('click', () -> applyFilter('awaiting'));
    document.getElementbyId('filter-needs-reply').addEventListener('click', () -> applyFilter('needs-reply'));

    // Add custom filter
    document.getElementbyId('add-filter').addEventListener('click', addCustomFilter);
    
    // Save notes
    document.getElementbyId('save-notes').addEventListener('click', saveNotes);
    
    // Load custom filters and contact details
    loadCustomFilters();
    loadContactDetails();
});

function applyFilter(filterType) {
    chrome.runtime.sendMessage({ action: 'applyFilter', filterType });
}

function addCustomFilter() {
    const filterName = document.getElementbyId('new-filter-name').value;
    if (filterName) {
        chrome.runtime.sendMessage({ action: 'addCustomFilter', filterName });
        loadCustomFilters();
        document.getElementbyId('new-filter-name').value = '';
    }
}

function loadCustomFilters() {
    chrome.runtime.sendMessage({ action: 'getCustomFilters' }, (response) => {
        const customFilters = response.filters || [];
        const customFiltersList = document.getElementbyId('custom-filters-list');
        customFiltersList.innerHTML = '';
        customFilters.forEach(filter => {
            const button = document.createElement('button');
            button.textContent = filter;
            button.className = 'filter-btn';
            button.addEventListener('click', () => applyFilter(filter));
            customFiltersList.appendChild(button);
        });
    });
}

function loadContactDetails() {
    chrome.runtime.sendMessage({ action: 'getCurrentContact' }, (response) => {
        document.getElementbyId('contact-name').querySelector('span').textContent = response.name || 'N/A';
        document.getElementbyId('contact-number').querySelector('span').textContent = response.number || 'N/A';
        document.getElementbyId('contact-notes').value = response.notes || '';
    });
}

function saveNotes() {
    const notes = document.getElementbyId('contact-notes').value;
    chrome.runtime.sendMessage({ action: 'saveNotes', notes });
}
