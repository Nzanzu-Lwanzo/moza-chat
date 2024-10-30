self.addEventListener("push", function (e) {
  const message = e.data.json();

  const options = {
    body: `${message.sendee.name} dit : ${message.content}`,
    tag: message.room._id,
    actions: [
      {
        type: "text",
        title: "Répondre",
        action: "reply",
        placeholder: "Ecrivez pour répondre ...",
      },
      {
        type: "button",
        title: "Vu",
        action: "mark-as-seen",
      },
    ],
    data: message,
  };

  e.waitUntil(self.registration.showNotification(message.room.name, options));
});

self.addEventListener("notificationclick", function (e) {
  const notification = e.notification;

  switch (e.action) {
    case "mark-as-seen": {
      notification.close();
    }

    case "reply": {
      let replyText = e.reply;

      // Send it to the server

      // Send it to the window
    }
  }
});
