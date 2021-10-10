import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { app } from './api';

admin.initializeApp();

export const api = functions
  .runWith({ memory: '256MB' })
  .region('europe-west3')
  .https.onRequest(app);
