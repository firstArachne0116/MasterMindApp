/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {initialBag} = require('./constants');

admin.initializeApp();

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

exports.sendInvitationNotification = functions.firestore.document('/messages/{documentId}')
  .onCreate(async (snap, context) => {
    const languages = {
      en: 'English(UK)',
      de: 'German',
      fr: 'French',
      bo: 'Bosnian',
      hr: 'Croatian',
      rs: 'Serbian',
      csb: 'Cro-Se-Bo',
      it: 'Italian',
      es: 'Spanish',
      pl: 'Polish',
      ru: 'Russian',
      mk: 'Macedonian',
    };

    // Access the parameter `{documentId}` with `context.params`
    const sessionRef = admin.firestore().doc('/messages/' + context.params.documentId);
    const sessionSnapshot = await sessionRef.get();
    if (sessionSnapshot.exists) {
      const session = sessionSnapshot.data();
      
      const inviter = session.players.find((player) => player.status === 'Invited');
      const invited = session.players.find((player) => player.status === 'Waiting');
      if (inviter && invited) {
        const bag = initialBag(session.language);
        const cards1 = [];
        while (cards1.length < 7 && bag.length !== 0) {
          const randomIndex = getRandomInt(bag.length);
          cards1.push({...bag[randomIndex], status: inviter.uid});
          bag.splice(randomIndex, 1);
        }
        const cards2 = [];
        while (cards2.length < 7 && bag.length !== 0) {
          const randomIndex = getRandomInt(bag.length);
          cards2.push({...bag[randomIndex], status: invited.uid});
          bag.splice(randomIndex, 1);
        }
        admin.database().ref(`board/${context.params.documentId}/tiles`).set([...bag, ...cards1, ...cards2]);
        admin.database().ref(`board/${context.params.documentId}/score`).set([
          {
            id: inviter.uid,
            passed: 0,
            score: 0,
          },
          {
            id: invited.uid,
            passed: 0,
            score: 0,
          },
        ]);
        admin.database().ref(`board/${context.params.documentId}/turnId`).set(invited.uid);

        const playerRef = admin.firestore().doc('/users/' + invited.uid);
        const playerSnapPromise = playerRef.get();
        const settingSnapPromise = admin.firestore().doc('/notifications/' + invited.uid).get();
        const [playerSnap, settingSnap] = await Promise.all([playerSnapPromise, settingSnapPromise]);
        const player = playerSnap.data();
        const notificationSetting = settingSnap.data();
        if (player.token && !notificationSetting.push_message_flag) {
          const payload = {
            notification: {
              title: 'You are invited to a new game.',
              body: `${inviter.full_name} invited you to ${languages[session.language]} Game.`,
            },
            data: {
              room: JSON.stringify(session),
            },
          };
          const response = await admin.messaging().sendToDevice(player.token, payload);

          const tokensToRemove = [];
          
          // For each message check if there was an error.
          response.results.forEach((result, index) => {
            const error = result.error;
            if (error) {
              functions.logger.error('Failure sending notification to', player.token, error);
              // Cleanup the tokens who are not registered anymore.
              if (error.code === 'messaging/invalid-registration-token' ||
                  error.code === 'messaging/registration-token-not-registered') {
                tokensToRemove.push(playerRef.update({token: null}));
              }
            }
          });
          return Promise.all(tokensToRemove);
        }
      }
    }
    return null;
  });
exports.sendTurnNotification = functions.database.ref('/board/{roomId}/score/')
  .onUpdate(async (change, context) => {
    const roomId = context.params.roomId;
    functions.logger.log('roomId');
    functions.logger.log(roomId);

    functions.logger.log(JSON.stringify(change.after.val()));
    const score = JSON.parse(JSON.stringify(change.after.val()));

    const currentPlayerRef = admin.firestore().doc('/users/' + score[1].id);
    const lastPlayerPromise = admin.firestore().doc('/users/' + score[0].id).get();

    const currentPlayerPromise = currentPlayerRef.get();
    const settingSnapPromise = admin.firestore().doc('/notifications/' + score[1].id).get();

    functions.logger.log(score);
    const [lastPlayerSnap, currentPlayerSnap, notificationSnap] = await Promise.all([lastPlayerPromise, currentPlayerPromise, settingSnapPromise]);

    const lastPlayer = lastPlayerSnap.data();
    const currentPlayer = currentPlayerSnap.data();
    const notificationSetting = notificationSnap.data();

    if (!currentPlayer.token || notificationSetting.push_message_flag) {
      return null;
    }
    const payload = {
      notification: {
        title: 'Turn changed.',
        body: `${lastPlayer.full_name} placed a word.`,
      },
    };
    
    if (score[0].passed) {
      payload.notification.body = `${lastPlayer.full_name} passed a turn.`;
    }
    const response = await admin.messaging().sendToDevice(currentPlayer.token, payload);

    const tokensToRemove = [];
    
    // For each message check if there was an error.
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        functions.logger.error('Failure sending notification to', currentPlayer.token, error);
        // Cleanup the tokens who are not registered anymore.
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
          tokensToRemove.push(currentPlayerRef.update({token: null}));
        }
      }
    });
    return Promise.all(tokensToRemove);
  });
