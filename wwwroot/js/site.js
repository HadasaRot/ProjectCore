const uri = '/Books';
let books = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const addCategorySelect = document.getElementById('add-category');

    const item = {
        name: addNameTextbox.value.trim(),
        category: parseInt(addCategorySelect.value, 10) // המרת ערך הקטגוריה למספר
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
            addCategorySelect.value = ''; // איפוס השדות לאחר הוספה
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = books.find(item => item.id === id);
    if (!item) {
        console.error('Item not found');
        return;
    }

    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-category').value = item.category;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const itemName = document.getElementById('edit-name').value.trim();
    const itemCategory = parseInt(document.getElementById('edit-category').value, 10);

    if (!itemName || isNaN(itemCategory)) {
        alert('Please provide valid inputs for both name and category.');
        return;
    }

    const item = {
        id: parseInt(itemId, 10),
        name: itemName,
        category: itemCategory
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => {
            getItems();
            closeInput();
        })
        .catch(error => console.error('Unable to update item.', error));
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'Book' : 'books kinds';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('books');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');
    const arrCategory = ["Biography", "Textbook", "Tension", "History", "Science", "Philosophy"];

    data.forEach(item => {
        let categor = document.createElement('label');
        categor.textContent = arrCategory[item.category] || 'Unknown';

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(categor);

        let td2 = tr.insertCell(1);
        td2.appendChild(document.createTextNode(item.name));

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    books = data;
}
