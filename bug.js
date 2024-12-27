In a Firebase project, I encountered an issue where data wasn't persisting correctly across sessions, even with offline persistence enabled.  The problem was particularly noticeable when using transactions.  Specifically, the transaction would seem to succeed, but the data changes wouldn't be reflected when the app relaunched, even though offline persistence was supposedly active. The relevant code snippet shows a transaction attempting to increment a counter: 
```javascript
firebase.firestore().runTransaction(transaction => {
  return transaction.get(counterRef).then(doc => {
    const newCount = (doc.exists ? doc.data().count : 0) + 1;
    transaction.update(counterRef, { count: newCount });
    return newCount;
  });
}).then(newCount => {
  console.log('Transaction succeeded:', newCount);
}).catch(error => {
  console.error('Transaction failed:', error);
});
```