/* DOM Selectors */

const addBtn = document.querySelector('.add-btn'),
      blurOverlay = document.querySelector('.blur-overlay'),
      newContact = document.querySelector('.new-contact'),
      cancelBtn = document.querySelector('.cancel-btn'),
      search = document.querySelector('#search'),
      newForm = document.querySelector('#new-contact-form'),
      openContact = document.querySelector('.open-contact'), 
      backBtn = document.querySelector('.open-back');


/* Event Handlers */

const toggleNewContact = () => {

    // Open new contact div and blur overlay
    newContact.classList.toggle('show');
    blurOverlay.classList.toggle('show');

};

const removeBlur = () => {

    // Close open divs and remove blur overlay when blur is clicked
    newContact.classList.remove('show');
    blurOverlay.classList.remove('show');
    openContact.classList.remove('show');

};

const filterContacts = () => { 

    // Get user inout value
    const inputValue = search.value.toLowerCase().trim();

    // Filter search
    Array.from(document.querySelectorAll('.contacts-item span'))
            .filter(item => !item.textContent.toLowerCase().includes(inputValue))
            .forEach(item => item.parentElement.classList.add('filtered'));
    
    Array.from(document.querySelectorAll('.contacts-item span'))
            .filter(item => item.textContent.toLowerCase().includes(inputValue))
            .forEach(item => item.parentElement.classList.remove('filtered'));
    
};

const addNewContact = (e) => {

    // Prevent form from submitting
    e.preventDefault();

    // Get user input values
    const name = newForm.querySelector('#new-name').value.trim().toLowerCase();
    const phone = newForm.querySelector('#new-phone').value.trim().toLowerCase();   
    const note = newForm.querySelector('#new-note').value.trim().toLowerCase();   

    // New contact object
    const contact = {
        name,
        phone,
        note
    };

    // Update local storage
    const storage = JSON.parse(localStorage.getItem('contacts')) || [];
    storage.push(contact);
    localStorage.setItem('contacts', JSON.stringify(storage));

    // Update UI
    updateUI();

    // Reset input fields
    newForm.reset();
    
    // Hide new contact div and blur overlay
    newContact.classList.remove('show');
    blurOverlay.classList.remove('show');

};

const goBack = () => {

    // Close contact div and remove blur overlay
    openContact.classList.remove('show');
    blurOverlay.classList.remove('show');

};

/* Helpers */

const updateUI = () => {

    // Get local storage
    const storage = JSON.parse(localStorage.getItem('contacts')) || [];
    storage.sort(dynamicSort('name'));

    // Update UI
    const list = document.querySelector('.contacts');
    const html = storage.map(contact => {
        return `
                <li class="contacts-item">
                    <span onclick="showContact('${contact.name}');">${contact.name}</span>
                    <button class="remove-contact" onclick="removeContact('${contact.name}')">
                        <i class="fas fa-window-close"></i>
                    </button>
                </li>
        `;
    }).join('');

    list.innerHTML = html;

};

const removeContact = (contactName) => {

    // Update local storage
    const storage = JSON.parse(localStorage.getItem('contacts')) || [];

    for (let i = 0; i < storage.length; i++) {
        if (storage[i].name === contactName.toLowerCase()) {
            storage.splice(i, 1);
        }
    }

    localStorage.setItem('contacts', JSON.stringify(storage));

    // Update UI
    updateUI();

};

const showContact = (contactName) => {
    
    // Show contact div with blur overlay
    openContact.classList.add('show');
    blurOverlay.classList.add('show');

    // Get local storage
    const storage = JSON.parse(localStorage.getItem('contacts')) || [];

    // Find contact in local storage
    const contact = storage.filter(item => item.name === contactName).pop();

    // Update contact div
    const contactHeader = document.querySelector('.open-header');
    const contactPhone = document.querySelector('.open-phone span');
    const contactNote = document.querySelector('.open-note span');

    // First letters
    let firstLetter = contact.name[0].toUpperCase();

    const nameArr = contact.name.split(' ');

    if (nameArr.length > 1) {
        firstLetter += nameArr[1][0].toUpperCase();
    }

    // Update name and letters circle
    const html = `
                <div class="open-circle">
                    <span class="open-circle-span">${firstLetter}</span>
                </div>
                <h2 class="open-heading">${contact.name}</h2>
                `;

    contactHeader.innerHTML = html;

    // Update phone
    contactPhone.textContent = contact.phone;

    // Update note
    contactNote.textContent = contact.note;

};

function dynamicSort(property) {  // Function for sorting array of objects by key
    let sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else{
            return a[property].localeCompare(b[property]);
        }        
    }
}

/* Event Listeners */
window.addEventListener('load', () => {

    // Remove body preload class after load
    document.body.classList.remove('preload');

    // Update UI from local storage
    updateUI();

    // Open add contact div
    addBtn.addEventListener('click', toggleNewContact);
    // Close add contact div
    cancelBtn.addEventListener('click', toggleNewContact);
    // Close open divs and remove blur
    blurOverlay.addEventListener('click', removeBlur);
    // Search contacts
    search.addEventListener('keyup', filterContacts);
    // Add new contact
    newForm.addEventListener('submit', addNewContact);
    // Close contact info
    backBtn.addEventListener('click', goBack);
    
});