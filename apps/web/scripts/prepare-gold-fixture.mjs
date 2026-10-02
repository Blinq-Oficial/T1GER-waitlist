// Disposable local Auth/Firestore/Functions fixture. Never connects to production.
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,doc,setDoc,getDoc,getDocs,query,collection,where} from 'firebase/firestore';
import {getFunctions,connectFunctionsEmulator,httpsCallable} from 'firebase/functions';
const app=initializeApp({projectId:'demo-t1ger-web',apiKey:'local-fixture',authDomain:'demo-t1ger-web.firebaseapp.com'});
const auth=getAuth(app);connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
const db=getFirestore(app);connectFirestoreEmulator(db,'127.0.0.1',8080);
const functions=getFunctions(app);connectFunctionsEmulator(functions,'127.0.0.1',5001);
try {
  const {user}=await createUserWithEmailAndPassword(auth,'gold-v2-local@example.invalid','Local-test-only-2026').catch(error=>{if(error.code!=='auth/email-already-in-use')throw error;return signInWithEmailAndPassword(auth,'gold-v2-local@example.invalid','Local-test-only-2026');});
  const profile=doc(db,'users',user.uid);
  if(!(await getDoc(profile)).exists())await setDoc(profile,{uid:user.uid,email:user.email,niche:'investing',displayName:'Gold V2 local QA',xp:0,level:1,streak:0,coins:0,onboardingComplete:true,primaryTrack:'money-catalyst',dailyTime:5});
  const missions=await getDocs(query(collection(db,'missions'),where('userId','==',user.uid)));
  if(!missions.docs.some(item=>item.id===`${user.uid}_field-learn-money-01`))await setDoc(doc(db,'missions',`${user.uid}_field-learn-money-01`),{userId:user.uid,missionId:'field-learn-money-01',lessonId:'learn-money-01',status:'ready'});
  await httpsCallable(functions,'completeWebApplyMission')({lessonId:'learn-money-01',missionId:'field-learn-money-01',reflection:'Fictional prerequisite: keep an emergency reserve separate from long-term money.',timeZone:'America/New_York'});
  console.log('PASS: disposable Gold learner prepared, first prerequisite completed through canonical server. No production access.');
} finally { await deleteApp(app); }
