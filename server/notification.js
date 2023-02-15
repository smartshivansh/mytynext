var admin = require("firebase-admin");
var serviceAccount = require("./mobile-app-rn-firebase-adminsdk-t7dev-3e3aa4ab40.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const message = {
  notification: {
    title: "new add",
    body: "new add posted click to open",
  },
  token:
    "dpOnmffJSy6XaCzFjEF-vv:APA91bHxd1T3PI66OqRMnn-v91Xdc19Z28EVLpVWS0qSj2-QT_JNa3-bZmKNYacpCTdjizJD4kjiToro3fhb6-TkfOUZUPEHzeeIwTVuMVFv9D7yjx8dtTfbT7QHDbTJFvBTIRGV59ec",
};

async function Notification(user, messagge, name, subdomain, blogadmin) {
  console.log(
    "user,messagge,name,subdomain,blogadmin in notification .js*****",
    user,
    messagge,
    name,
    subdomain,
    blogadmin
  );
  //us user ki info h jisko msg bhejna h to usi ki device ka token bhi chahiye h
  const availableUserInfo = await AdminsOnlineuser.findOne({
    Username: user,
  });
  console.log(
    "availableUserInfo ki information for token",
    availableUserInfo.DeviceToken
  );

  if (availableUserInfo.DeviceToken) {
    admin
      .messaging()
      .sendToDevice(
        [availableUserInfo.DeviceToken],
        {
          data: {
            text: messagge,
            senderUser: name,
            subdomain: subdomain ? subdomain : "",
          },
        },
        {
          contentAvailable: true,
          priority: "high",
        }
      )
      .then((data) => {
        console.log("Send", data);
      })
      .catch((err) => {
        console.log("Fail", err.message);
      });
  }
}
module.exports = Notification;
