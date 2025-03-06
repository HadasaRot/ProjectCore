const uri = '/User';
const token = sessionStorage.getItem('token'); 
let users = []; 
let currUser;
if (token) {
    if(!isTokenValid(token))
        location.href="index.html";
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const jsonPayload = JSON.parse(decodedPayload);
    const userId = parseInt(jsonPayload.UserId, 10);
    currUser = userId;
    jsonPayload.UserId=userId;
    showUserName(userId);
}
else {
    location.href="index.html";
}
function showUserName(id){
    const userName = document.getElementById('userName');
    fetch(`${uri}/${id}`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    })
    .then(response=>{
        if (!response.ok) {
            throw new Error("הגישה נדחתה! ייתכן שהמשתמש אינו מחובר.");
        }
        return response.json();
    })
    .then(data => {
        startName = document.getElementById('startName').innerHTML = data.username.charAt(0);
        profileName = document.getElementById('profileName').innerHTML = data.username
        document.getElementById('edit-username').value = data.username; });
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
    const addUsernameTextbox = document.getElementById('add-username');
    const addPasswordTextbox = document.getElementById('add-password');
    const addRoleCheckbox = document.getElementById('add-role');

    const item = {
        username: addUsernameTextbox.value.trim(),
        password: addPasswordTextbox.value.trim(),
        isAdmin: addRoleCheckbox.checked
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
            addUsernameTextbox.value = '';
            addPasswordTextbox.value = '';
            addRoleCheckbox.checked = false;
        })
        .catch(error => console.error('Unable to add item.', error));
}


function displayEditForm(id) {    
    if(!isTokenValid(token))
        location.href="index.html";    
    const user = users.find(user => user.userId === id);
    if (!user) {
        console.error('User not found');
        return;
    }
    console.log(user+"in lamda");
    
    document.getElementById('edit-id').value = user.userId;
    document.getElementById('edit-name').value = user.username;
    document.getElementById('edit-password').value = user.password;
    document.getElementById('edit-role').checked = user.isAdmin;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const userId = document.getElementById('edit-id').value;
    const userName = document.getElementById('edit-name').value.trim();
    const password = document.getElementById('edit-password').value.trim();
    const isAdmin = document.getElementById('edit-role').checked;

    const user = {
        userId : userId,
        username: userName,
        password: password,
        isAdmin: isAdmin
    };
    console.log(user+"before fetch");
    

    fetch(`${uri}/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(() => {
        getItems();
        document.getElementById('editForm').style.display = 'none';
    })
    .catch(error => console.error('Error updating user.', error));
}


function deleteItem(id) {
    if(!isTokenValid(token))
        location.href="index.html";
    fetch(`${uri}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function _displayItems(data) {
    const tBody = document.getElementById('users');
    tBody.innerHTML = '';
    const button = document.createElement('button');
    data.forEach(item => {
        let role = document.createElement('label');
        role.textContent = item.isAdmin ? 'Admin' : 'User';
        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.userId})`);
        let updataButton = button.cloneNode(false);
        updataButton.innerHTML='update';
        updataButton.setAttribute('onclick',`displayEditForm(${item.userId})`)
        let tr = tBody.insertRow();
        let td1 = tr.insertCell(0);
        td1.appendChild(document.createTextNode(item.userId));
        let td2 = tr.insertCell(1);
        td2.appendChild(document.createTextNode(item.username));
        let td3 = tr.insertCell(2);
        td3.appendChild(document.createTextNode(item.password));
        let td4 = tr.insertCell(3);
        td4.appendChild(role);
        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
        let td6 = tr.insertCell(5);
        td6.appendChild(updataButton);
    });
    users = data;
    
}

getItems();

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
    const newPassword = document.getElementById('edit-password2').value.trim();

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
    
    fetch(`${uri}/${currUser}`, {
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