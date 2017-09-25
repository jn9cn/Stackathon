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

// let t = new Date();
// t.setSeconds(t.getSeconds() + 3);

// export const schedulingOptions = {
//     time: (new Date()).getTime() + 1000 // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
//     // repeat: repeat
// };

// Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);

// Notifications.cancelAllScheduledNotificationsAsync();