import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Connection self-test as required by Firebase skill
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: offline or initial setup pending.');
    }
  }
}
testFirestoreConnection();

// Authentication helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Upsert user profile
    if (result.user) {
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        {
          id: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Meteorologist',
          photoURL: result.user.photoURL || '',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signOutUser() {
  await signOut(auth);
}

// User state subscriber
export function subscribeAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Types for persisted data
export interface SavedLocationItem {
  id: string;
  userId: string;
  locationId: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  alertThreshold: string;
  notes?: string;
  createdAt: string;
}

export interface WeatherNoteItem {
  id: string;
  userId: string;
  title: string;
  scenarioId: string;
  locationName: string;
  severity: string;
  notes: string;
  createdAt: string;
}

// Saved Locations subcollection: /users/{userId}/savedLocations/{locationId}
export function subscribeSavedLocations(
  userId: string,
  callback: (locations: SavedLocationItem[]) => void
) {
  const colRef = collection(db, 'users', userId, 'savedLocations');
  const q = query(colRef);
  return onSnapshot(
    q,
    (snapshot) => {
      const list: SavedLocationItem[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as SavedLocationItem);
      });
      callback(list);
    },
    (err) => {
      console.error('Error listening to saved locations:', err);
    }
  );
}

export async function addSavedLocation(userId: string, loc: Omit<SavedLocationItem, 'userId' | 'createdAt'>) {
  const itemRef = doc(db, 'users', userId, 'savedLocations', loc.id);
  const data: SavedLocationItem = {
    ...loc,
    userId,
    createdAt: new Date().toISOString(),
  };
  await setDoc(itemRef, data, { merge: true });
}

export async function removeSavedLocation(userId: string, locDocId: string) {
  const itemRef = doc(db, 'users', userId, 'savedLocations', locDocId);
  await deleteDoc(itemRef);
}

// Weather Notes subcollection: /users/{userId}/weatherNotes/{noteId}
export function subscribeWeatherNotes(
  userId: string,
  callback: (notes: WeatherNoteItem[]) => void
) {
  const colRef = collection(db, 'users', userId, 'weatherNotes');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: WeatherNoteItem[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as WeatherNoteItem);
      });
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(list);
    },
    (err) => {
      console.error('Error listening to weather notes:', err);
    }
  );
}

export async function addWeatherNote(userId: string, note: Omit<WeatherNoteItem, 'userId' | 'createdAt'>) {
  const noteRef = doc(db, 'users', userId, 'weatherNotes', note.id);
  const data: WeatherNoteItem = {
    ...note,
    userId,
    createdAt: new Date().toISOString(),
  };
  await setDoc(noteRef, data);
}

export async function removeWeatherNote(userId: string, noteId: string) {
  const noteRef = doc(db, 'users', userId, 'weatherNotes', noteId);
  await deleteDoc(noteRef);
}
