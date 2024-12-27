# Firebase Offline Persistence Transaction Bug

This repository demonstrates a bug encountered with Firebase's offline persistence feature when using transactions.  Even with `firebase.firestore().enablePersistence()` correctly called, data changes within transactions are not reliably persisted across app sessions.

The `bug.js` file contains the problematic code, showcasing a simple transaction to increment a counter. The `bugSolution.js` demonstrates a workaround and potential fix.