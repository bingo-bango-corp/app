workbox.core.skipWaiting()
workbox.core.clientsClaim()

importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '637950999947'
});

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler((payload) => {
  // eslint-disable-next-line no-console
  console.log('[firebase-messaging-sw.js] Received background message ', payload)

  var notificationTitle = payload.data.title
  var notificationOptions = {
    body: payload.data.body,
    icon: '/round-icon.png',
    priority: 2,
    actions: payload.data.actions,
    data: {
      url: payload.data.link
    }
  }

  return self.registration.showNotification(notificationTitle,
    notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
  // eslint-disable-next-line no-console
  console.log(event)

  const url = event.notification.data.url || 'https://app.bingobango.app/'

  switch (event.action) {
    default:
      event.notification.close()
      event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
          for (var i = 0; i < windowClients.length; i++) {
              var client = windowClients[i];
              if (client.url === url && 'focus' in client) {
                  return client.focus();
              }
          }
          if (clients.openWindow) {
              return clients.openWindow(url);
          }
        })
      )
  }
})

workbox.precaching.precacheAndRoute(self.__precacheManifest)