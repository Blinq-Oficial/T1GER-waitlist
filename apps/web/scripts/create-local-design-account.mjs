// Disposable local account. This script cannot contact production Auth.
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from 'firebase/auth';
const app=initializeApp({projectId:'demo-t1ger-web',apiKey:'local-fixture',authDomain:'demo-t1ger-web.firebaseapp.com'});
const auth=getAuth(app); connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
try { await createUserWithEmailAndPassword(auth,'design-account-20260930@example.invalid','Local-test-only-2026'); console.log('Disposable local design account created.'); }
finally { await deleteApp(app); }
