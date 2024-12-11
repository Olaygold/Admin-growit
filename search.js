import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, query, orderByChild, get, equalTo } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAELWzVQZiw2PxbNUT3-YK4a6KPHfYkdZ4",
  authDomain: "work-98965.firebaseapp.com",
  databaseURL: "https://work-98965-default-rtdb.firebaseio.com",
  projectId: "work-98965",
  storageBucket: "work-98965.appspot.com",
  messagingSenderId: "755408416828",
  appId: "1:755408416828:web:59f72561f27fb9ffa01339"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Search Function
document.getElementById("searchBtn").addEventListener("click", async () => {
  const searchValue = document.getElementById("searchField").value.trim();
  const resultContainer = document.getElementById("resultContainer");

  if (!searchValue) {
    resultContainer.innerHTML = `<div class="alert alert-warning">Please enter a search value.</div>`;
    return;
  }

  resultContainer.innerHTML = `<div class="alert alert-info">Searching...</div>`;

  try {
    // Query users by name, email, referral code, or UID
    const usersRef = ref(db, "users");
    let foundUser = null;

    // Check by `name`
    let q = query(usersRef, orderByChild("name"), equalTo(searchValue));
    let snapshot = await get(q);
    if (snapshot.exists()) {
      foundUser = snapshot.val();
    }

    // Check by `email`
    if (!foundUser) {
      q = query(usersRef, orderByChild("email"), equalTo(searchValue));
      snapshot = await get(q);
      if (snapshot.exists()) {
        foundUser = snapshot.val();
      }
    }

    // Check by `referralCode`
    if (!foundUser) {
      q = query(usersRef, orderByChild("referralCode"), equalTo(searchValue));
      snapshot = await get(q);
      if (snapshot.exists()) {
        foundUser = snapshot.val();
      }
    }

    // Check by `UID`
    if (!foundUser) {
      q = query(usersRef, orderByChild("uid"), equalTo(searchValue));
      snapshot = await get(q);
      if (snapshot.exists()) {
        foundUser = snapshot.val();
      }
    }

    if (foundUser) {
      // Display user data
      const userId = Object.keys(foundUser)[0];
      const userData = foundUser[userId];
      resultContainer.innerHTML = `
        <div class="card">
          <div class="card-header">User Details</div>
          <div class="card-body">
            <p><strong>Name:</strong> ${userData.name}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Phone Number:</strong> ${userData.phone || "Not Provided"}</p>
            <p><strong>UID:</strong> ${userId}</p>
            <p><strong>Main Balance:</strong> ${userData.balance || 0} Naira</p>
            <p><strong>Commission Balance:</strong> ${userData.commissionBalance || 0} Naira</p>
            <p><strong>Gift Code Balance:</strong> ${userData.redeemBalance || 0} Naira</p>
            <p><strong>Referral Code:</strong> ${userData.referralCode || "N/A"}</p>
            <p><strong>Registration Date:</strong> ${userData.registrationDate || "Not Available"}</p>
          </div>
        </div>
      `;
    } else {
      resultContainer.innerHTML = `<div class="alert alert-danger">No user found with the provided value.</div>`;
    }
  } catch (error) {
    console.error("Error searching user:", error);
    resultContainer.innerHTML = `<div class="alert alert-danger">Error fetching user data. Please try again later.</div>`;
  }
});