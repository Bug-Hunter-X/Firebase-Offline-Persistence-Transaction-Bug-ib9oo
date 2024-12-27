The core problem lies in the asynchronous nature of transactions combined with the limitations of offline persistence.  Simply enabling persistence isn't sufficient to guarantee immediate, reliable data synchronization.  The solution involves ensuring that any changes made during a transaction are also handled in a way that handles potential inconsistencies. One approach is to combine transactions with listeners to guarantee the data consistency. For example:

```javascript
firebase.firestore().enablePersistence().then(() => {
  // ... rest of your code
}).catch(err => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a time.
    console.log('Persistence not enabled. Multiple tabs open?')
  } else if (err.code === 'unavailable') {
    // Failed to enable persistence. Retry later?
    console.log('Persistence unavailable.')
  }
})

let counterRef = firebase.firestore().collection('counters').doc('myCounter');

function incrementCounter() {
  counterRef.onSnapshot(doc => {
    let newCount = (doc.exists ? doc.data().count : 0) + 1;
    counterRef.update({ count: newCount });
  })
  counterRef.runTransaction(transaction => {
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
}

incrementCounter();
```
This improved version uses a listener which ensures the counter is properly updated after the transaction and across app sessions.