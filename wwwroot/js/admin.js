let token = sessionStorage.getItem('token');
let currUser;
const uriUser = '/User'
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
    showUserName(userId);
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

