## ABOUT APP

### De la différence entre une Chat Room Publique et une Chat Room Privée

- Une **Chat Room Publique** est une Chat Room que tous les utilisateurs peuvent voir par défaut. Ils auront un bouton join qui leur permettra de rejoindre la Chat Room s'ils le désirent.
- Une **Chat Room Privée** est une Chat Room qui n'est pas visible du grand public et à laquelle on ne peut accéder que si l'administrateur nous a ajouté.

### Push notifications

1. ### Client

   - Enregistrer un service worker
   - Souscrire à un service push avec le service worker en fournissant une clé publique. Cette clé est obtenue sur le serveur. Cependant, côté client, elle doit être convertie en Uint8Array. Voici la fonction :

   ```js
   function urlBase64ToUint8Array(base64String) {
     const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
     const base64 = (base64String + padding)
       .replace(/-/g, "+")
       .replace(/_/g, "/");

     const rawData = window.atob(base64);
     const outputArray = new Uint8Array(rawData.length);

     for (let i = 0; i < rawData.length; ++i) {
       outputArray[i] = rawData.charCodeAt(i);
     }
     return outputArray;
   }
   ```

   Depuis quelques versions de **web-push** cette fonction n'est plus présentée dans la documentation. Il faut dans les versions d'il y à au moins 4 ans pour l'obtenir. Cela veut-il dire qu'il n'y a plus besoin de convertir la VAPID Key ?

   - Envoyer l'objet de souscription au serveur.

   Le code peut ressembler à ceci :

   ```js
   const VAPID_PUBLIC_KEY_FROM_SERVER = urlBase64ToUint8Array(
     "my-public-vapid-key-generated-on-the-server"
   );

   const registration = await navigator.serviceWorker.register("/sw.js", {
     scope: "/",
   });

   const subscription = await registration.pushManager.subscribe("", {
     userVisibleOnly: true,
     applicationServerKey: VAPID_PUBLIC_KEY_FROM_SERVER,
   });

   fetch("https://mysite.com/subscribe", {
     method: "POST",
     data: JSON.stringify(subscription),
     headers: {
       "Content-Type": "application/json",
     },
   });
   ```

2. #### Serveur

   - Installer le module **web-push**
   - Générer les clés VAPID en utilisant une ligne de commande avec
     ```
         npx web-push generate-vapid-keys
     ```
   - Mettre en place une route de sourscription au web push (dans notre cas, /subscribe ). Quand l'utilisateur envoie son objet de souscription à cet endpoint, cet objet aura la forme suivant

   ```js

   {
       endpoint : "https://fcm.googleapis.com/...",
       expirationTime : null,
       keys : {
           p256dh : "a-long-string",
           auth : "a-short-string"
       }
   }

   ```

   - Stocker cet objet quelque part puisqu'on en aura besoin pour envoyer les notifications à ce client.

   ```js
   webpush.sendNotification(subscriptionObject, dataToSend);
   ```

3. ### Sw

   - Ajouter un event listener nommé push dans le service worker. L'objet **event** du gestionnaire contient une propriété **data** qui représente les données en voyées depuis le serveur. Ces données sont envoyées en format json. Il faut d'abord les parser et ensuite les utiliser.

   ```js
   self.addEventListener("push", ({ data }) => {
     let { title, message, chatRoomId } = data.json();

     self.registration.showNotification(title, {
       body: message,
       tag: chatRoomId,
     });
   });
   ```
