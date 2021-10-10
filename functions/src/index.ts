import * as functions from 'firebase-functions';

export const checkOrder = functions
  .runWith({ memory: '256MB' })
  .region('europe-west3')
  .https.onRequest((req, res) => {
    return res.sendStatus(200).end();
  });
