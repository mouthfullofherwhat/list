const firebaseConfig = {
  apiKey: "AIzaSyC8jNncFRwauYraxK8-gZiwLlPR45ntMGY",
  authDomain: "list-55258.firebaseapp.com",
  projectId: "list-55258",
  storageBucket: "list-55258.firebasestorage.app",
  messagingSenderId: "32790679727",
  appId: "1:32790679727:web:2b948ac0b71365ed49445a"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();