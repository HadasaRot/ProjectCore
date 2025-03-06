
const uri = '/Books';
const uriUser = '/User'
let books = [];
let token = sessionStorage.getItem('token');
let currUser;


if (token) {
    if (!isTokenValid(token)) {
        alert('התנתקת! התחבר מחדש')
        location.href = "index.html";
    }
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const jsonPayload = JSON.parse(decodedPayload);
    const userId = parseInt(jsonPayload.UserId, 10);
    const isAdmin = jsonPayload.isAdmin; 
    jsonPayload.UserId = userId;
    currUser = userId;
    console.log(currUser);
    showUserName(userId);
}

else
    location.href = 'index.html'

function showUserName(id) {
    const userName = document.getElementById('userName');
    fetch(`${uriUser}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("הגישה נדחתה! ייתכן שהמשתמש אינו מחובר.");
            }
            return response.json();
        })
        .then(data => {
            startName = document.getElementById('startName').innerHTML = data.username.charAt(0);
            profileName = document.getElementById('profileName').innerHTML = data.username
            document.getElementById('edit-username').value = data.username; 
        })
        .catch(error => console.error('שגיאה בקבלת שם המשתמש:', error));
}


function getItems() {
    fetch(uri, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("הגישה נדחתה! ייתכן שהמשתמש אינו מחובר.");
            }
            return response.json();
        })
        .then(data => _displayItems(data))
        .catch(error => alert(error.message));
}

function addItem() {
    if (!isTokenValid(token)) {
        alert('התנתקת! התחבר מחדש')
        location.href = "index.html";
    }
    const addNameTextbox = document.getElementById('add-name');
    const addCategorySelect = document.getElementById('add-category');

    const item = {
        name: addNameTextbox.value.trim(),
        category: parseInt(addCategorySelect.value, 10)
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
            addCategorySelect.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    if (!isTokenValid(token)) {
        alert('התנתקת! התחבר מחדש')
        location.href = "index.html";
    }
    fetch(`${uri}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    if (!isTokenValid(token)) {
        alert('התנתקת! התחבר מחדש')
        location.href = "index.html";
    }
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
    if (!isTokenValid(token)) {
        alert('התנתקת! התחבר מחדש')
        location.href = "index.html";
    }
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
        category: parseInt(itemCategory),
        UserId: parseInt(currUser)
    };
   

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
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
    if (!isTokenValid(token)) {
        alert('התנתקת! התחבר מחדש')
        location.href = "index.html";
    }
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
function _filterById() {
    let idItem = document.getElementById('filter').value;
    idItem = parseInt(idItem);
    fetch(`${uri}/${idItem}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                (response)
                alert("לא קיים ספר כזה במערכת");
                getItems();
            }
            return response.json();
        })
        .then(data => {
            let Data = [];
            Data[0] = data
            _displayItems(Data)
        })
        .catch(error => alert(error.message));
}


function showAfterFilter() {
    getItems()
}


function isTokenValid(token) {
    if (!token) return false; 

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        const expiry = payload.exp * 1000; 
        return expiry > Date.now(); 
    } catch (error) {
        return false; 
    }
}


// פונקציה לפתיחת וסגירת טופס העריכה
function toggleEdit() {
    let editForm = document.getElementById("editProfile");
    if (editForm.style.display === "none" || editForm.style.display === "") {
        editForm.style.display = "block";
    } else {
        editForm.style.display = "none";
    }
}
function saveChanges() {
    if (!isTokenValid(token)) {
        alert('התנתקת! התחבר מחדש');
        location.href = "index.html";
        return;
    }

    const newUsername = document.getElementById('edit-username').value.trim();
    const newPassword = document.getElementById('edit-password').value.trim();

    if (!newUsername || !newPassword) {
        alert("נא למלא את כל השדות");
        return;
    }
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const jsonPayload = JSON.parse(decodedPayload);
    const isAdmin = JSON.parse(jsonPayload.isAdmin);

    const updatedUser = {
        userId: currUser,
        username: newUsername,
        password: newPassword,
        isAdmin :isAdmin
    };
  

   
    fetch(`${uriUser}/${currUser}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("עדכון נכשל, נסה שוב.");
            }
            return response.text();
        })
        .then(() => {
            alert("העדכון בוצע בהצלחה!");
            toggleEdit();
            showUserName(currUser); 
        })
        .catch(error => {
            console.error('שגיאה בעדכון המשתמש:', error);
            alert(error.message);
        });
}
