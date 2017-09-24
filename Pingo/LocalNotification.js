import { Notifications } from 'expo';

export const localNotification = {
    title: 'Pingo!',
    body: 'You are near: ', // (string) — body text of the notification.
    ios: { // (optional) (object) — notification configuration specific to iOS.
      sound: true // (optional) (boolean) — if true, play a sound. Default: false.
    },
    android:
    {
      sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
      icon: 'https://d30y9cdsu7xlg0.cloudfront.net/png/62169-200.png',
      //icon (optional) (string) — URL of icon to display in notification drawer.
      //color (optional) (string) — color of the notification icon in notification drawer.
      priority: 'high', 
      sticky: false,
      vibrate: true 
    }
};

let t = new Date();
t.setSeconds(t.getSeconds() + 3);

export const schedulingOptions = {
    time: (new Date()).getTime() + 1000 // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
    // repeat: repeat
};

Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);

Notifications.cancelAllScheduledNotificationsAsync();