// firebase-messaging-sw.js
// Uses compat build for background messages
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC8azD-z8Gk5ydARpqkMI0fr0q-KJeKgiQ",
  authDomain: "sandhuchat-12429.firebaseapp.com",
  projectId: "sandhuchat-12429",
  messagingSenderId: "599206414772",
  appId: "1:599206414772:web:a14d10675b003344838ae1"
});

const messaging = firebase.messaging();

// Show a notification when a background message is received
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "New message";
  const options = {
    body: (payload.notification && payload.notification.body) || "",
    icon: "/chat-icon.png"
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
