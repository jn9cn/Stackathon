import { Notifications } from 'expo';

export const localNotification = {
    title: 'Pingo!',
    body: 'You are near: ',
    ios: { 
      sound: true 
    },
    android:
    {
      sound: true,
      icon: 'https://d30y9cdsu7xlg0.cloudfront.net/png/62169-200.png',
      priority: 'high', 
      sticky: false,
      vibrate: true 
    }
};
