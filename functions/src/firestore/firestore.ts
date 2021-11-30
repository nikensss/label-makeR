import * as admin from 'firebase-admin';

export interface FirestoreDocument {
  toFirestore: () => admin.firestore.DocumentData;
}
