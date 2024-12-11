import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue, get, set, update, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// Load all withdrawal requests from the users node
function loadWithdrawals() {
  const usersRef = ref(db, "users");
  const withdrawalsList = document.getElementById("withdrawals-list");

  onValue(usersRef, (snapshot) => {
    withdrawalsList.innerHTML = ""; // Clear previous data

    if (snapshot.exists()) {
      const users = snapshot.val();

      // Loop through each user and their withdrawals
      for (const userId in users) {
        const user = users[userId];

        if (user.withdrawals) {
          for (const withdrawalId in user.withdrawals) {
            const withdrawal = user.withdrawals[withdrawalId];
            const withdrawalHTML = `
              <div class="withdrawal-item">
                <p><strong>User Email:</strong> ${user.email || "Not Provided"}</p>
                <p><strong>Account Name:</strong> ${withdrawal.accountName}</p>
                <p><strong>Bank Name:</strong> ${withdrawal.bankName}</p>
                <p><strong>Account Number:</strong> ${withdrawal.accountNumber}</p>
                <p><strong>Withdrawal Amount:</strong> ${withdrawal.withdrawalAmount} Naira</p>
                <p><strong>Status:</strong> ${withdrawal.status}</p>
                <button onclick="markWithdrawal('${userId}', '${withdrawalId}', 'Paid')">Mark as Paid</button>
                <button onclick="markWithdrawal('${userId}', '${withdrawalId}', 'Failed')">Mark as Failed</button>
              </div>
            `;
            withdrawalsList.innerHTML += withdrawalHTML;
          }
        }
      }
    } else {
      withdrawalsList.innerHTML = "<p>No withdrawal requests found.</p>";
    }
  });
}

// Mark a withdrawal as Paid or Failed
window.markWithdrawal = function (userId, withdrawalId, status) {
  const withdrawalRef = ref(db, `users/${userId}/withdrawals/${withdrawalId}`);

  // Fetch the withdrawal details
  get(withdrawalRef).then((snapshot) => {
    if (snapshot.exists()) {
      const withdrawal = snapshot.val();

      // Refund balance if marking as Failed
      if (status === "Failed") {
        const userRef = ref(db, `users/${userId}`);
        get(userRef).then((userSnapshot) => {
          if (userSnapshot.exists()) {
            const user = userSnapshot.val();
            const updatedBalance = user.balance + withdrawal.withdrawalAmount;

            // Update the user's balance
            update(userRef, { balance: updatedBalance }).then(() => {
              console.log("Balance refunded to user.");
            }).catch((error) => {
              console.error("Error refunding balance:", error);
            });
          }
        });
      }

      // Update the withdrawal status (no removal, stays in the withdrawals node)
      update(withdrawalRef, { status: status }).then(() => {
        console.log(`Withdrawal marked as ${status}.`);
        alert(`Withdrawal marked as ${status}.`);
      }).catch((error) => {
        console.error("Error updating withdrawal status:", error);
      });
    } else {
      alert("Withdrawal not found.");
    }
  });
};

// Load withdrawals on page load
window.onload = loadWithdrawals;