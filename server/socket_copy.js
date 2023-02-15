var sockets = {};
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const ChatMsg = require("./models/ChatMessage");
const AdminsOnlineuser = require("./models/AdminOnlineUsers");
const chatNotificationModel = require("./models/ChatMsgNotification");
const Onlineuser = require("./models/Onlineuser");
const mytyBot = require("./middleware/mytyBot");
const Notification = require("./notification");
const UserAnalytics = require("./models/UserAnalytics");
const AdminAsUser = require("./models/AdminAsUser");
var viewUser = [];
var NumberOfMsg = [];
var NotificationsOfMsg = [];
var viewUsers = [];
var mssages = [];
var BlogVisitorUser = [];
var AdminsOnly = [];
var receiveClickedUserName;
var ClickedUserOfAdminAsUser;
var ClickedUser;
var adminOnly;
var i = 0;

const app = express();
const server = http.createServer(app);
// app.use(cors());
var corsOptions = {
  Headers: {
    "Access-Control-Allow-Origin": "*",
  },
  // origin: [
  //   "http://localhost:3000", // react app
  //   "https://myty-staging.herokuapp.com/", // heroku
  //   "http://165.22.220.228/", // digital ocean
  // ],
};
sockets.init = (server) => {
  // console.log("initializing socketes");
  var io = new Server(server, {
    cors: corsOptions,
  });

  //MAIN CONNECTION EVENT----------------
  io.on("connect", async (socket) => {
    //------------------------------Myty_Homepage_Creating_Connection_Start------------------------------------------------

    socket.on("myty home user connected", async ({ name }, callback) => {
      // console.log("myty home user connected", name, socket.id);

      //getting allprevious msg of connected users & admin
      const allmsg = await ChatMsg.find(
        { $or: [{ sendername: name }, { receivername: name }] },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            io.to(socket.id).emit("allmsg", {
              allMsg: docs,
              socketid: socket.id,
            });
          }
        }
      );
      // console.log("all msg name",allmsg,name)

      //also changing and adding the socket.id of existing and new, BlogVisitorUser and BlogAdmin
      viewUsers[name] = socket.id;

      //finding that user is exitsing user or a new user
      const available = await Onlineuser.findOne({ Username: name });

      //if BlogVisitorUser and BlogAdmin is already existing then searching him by his name and updating his socket.id and online status of the BlogVisitorUser and BlogAdmin
      if (available) {
        const filter = { Username: name };
        const doc = { $set: { socketid: socket.id, Userstatus: "online" } };
        const options = { new: true };
        const updateddocument = await Onlineuser.findOneAndUpdate(
          filter,
          doc,
          options
        );

        if (name == "shubhamatintiwari") {
          // console.log("i am superadmin of myty home page", name);
          io.to(socket.id).emit("notification", {
            ClickedUser: receiveClickedUserName,
            NotificationsOfMsg: NotificationsOfMsg,
          });

          adminOnly = socket.id;

          const allusers = await Onlineuser.find({});

          //also sending online status of admin to all online-users
          allusers.map((data) => {
            io.to(data.socketid).emit("adminStatusToUser", {
              admin: "online",
            });
          });
        }

        if (name !== "shubhamatintiwari") {
          console.log("i am existing user of myty home page");
          mytyBot("/Chat", name, "Previous User Joined to myty Chat");
          //emiting a welcome msg to the connected user
          socket.emit("message", { user: "myty", text: "welcome to myty" });
          //if anyuser come eighther new or old he have to know the admin,s socketid
          const all = await Onlineuser.findOne({ Official: true });
          if (all) {
            adminOnly = all.socketid;
          }

          //when user connect again with the same name then sending the name of user to suparadmin
          io.to(adminOnly).emit("existinguser", { name: name });
        }
      }

      //if newMyty user is coming then adding his details on Online-users list in mongodb
      if (!available) {
        //emiting a welcome msg to the connected user
        socket.emit("message", { user: "myty", text: "welcome to myty" });
        mytyBot("/Chat", `UserName : ${name}`, "New User Joined to myty Chat");
        console.log("i am a new user of myty home page");
        const newOnlineUser = new Onlineuser({
          socketid: socket.id,
          Username: name,
          Userstatus: "online",
          Official: false,
        });
        const Online = await newOnlineUser.save();
        const all = await Onlineuser.findOne({ Official: true });
        if (all) {
          adminOnly = all.socketid;
        }
      }

      //taking 0 number with all connected user name this is his starting sending number
      mssages[name] = i;

      //taking a default notification number against every connected user
      var Notificationavailable = NotificationsOfMsg.find(
        (data) => data.Username == name
      );

      if (!Notificationavailable) {
        NotificationsOfMsg.push({ Username: name, numberofmsg: i });
      }

      //when new user and also existing user connected then sending the fresh onlineusers-list to admin
      const allusers = await Onlineuser.find(
        { Official: false },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            //if user is new then again we are sending fresh list to admin
            io.to(adminOnly).emit("allonlineuser", { allonlineuser: docs });
          }
        }
      );

      callback();
    });

    //------------------------------Myty_Homepage_Creating_Connection_Complete------------------------------------------------

    //-----------------------------BlogAdmin && BlogVisitor user Creating Connection-----------------------------
    socket.on(
      "user connected",
      async (
        {
          name,
          adminOnlly,
          subDomain,
          BlogAdminName,
          userImageUrl,
          userId,
          firebasetoken,
          adminAsUserName,
          adminImageUrl,
          Uuid,
          Status,
          logedInUsername,
        },
        callback
      ) => {
        console.log(
          "new user connected",
          name,
          adminOnlly,
          BlogAdminName,
          userImageUrl,
          socket.id,
          subDomain,
          Uuid,
          Status,
          adminImageUrl,
          adminAsUserName
        );
        console.log("name:firebasetoken", name, firebasetoken);

        //if BlogAdminName value have that means this user is blog-visitor even Ragister(who is logedIn and visiting to thers users link or blog) or un-Ragister both
        if (BlogAdminName) {
          //when blog-visitor come then first check him in list and then update his blog-admin name and his image because
          //blog-visitor with same name can connect to multiple blog admin this will help when we send his blog-admin a fresh online-list include him
          // const updatinginfo = await AdminsOnlineuser.findOneAndUpdate(
          //   { Username: name },
          //   { $set: { AdminName: BlogAdminName, userImageUrl: userImageUrl } },
          //   { new: true }
          // );
          // console.log(
          //   "updatinginfo,userImageUrl************",
          //   updatinginfo,
          //   userImageUrl
          // );

          //when Blog-visitor is Ragistered User(logedIn user) and visiting to anyother user link or blog
          if (Status == "adminAsUser") {
            console.log("adminAsUser**************");
            //first find this user (who is also a blog-admin register user but visiting some other user blog)
            // finding this user that is he already visited before in this blog-admins blog
            const availableAdminAsUser = await AdminAsUser.find({
              $and: [{ Username: name }, { AdminName: BlogAdminName }],
            });

            // console.log(
            //   "database me admin as a user blogadmin ke sath save h ki nhi h ki nhi ",
            //   availableAdminAsUser
            // );

            //  availableAdminAsUser value comes it means Ragistered user already visited before so we are just updating some information
            if (availableAdminAsUser.length > 0) {
              ClickedUserOfAdminAsUser = BlogAdminName;

              console.log(
                "when adminasuser clicked on anyuser then set his user name on ",
                ClickedUserOfAdminAsUser
              );
              const updateAdminasUserInfo = await AdminAsUser.findOneAndUpdate(
                { AdminName: BlogAdminName, Username: name },
                {
                  $set: {
                    socketid: socket.id,
                    Userstatus: "online",
                    messageNotification: 0,
                    userImageUrl: userImageUrl,
                    adminImageUrl: adminImageUrl,
                    Subdomain: subDomain,
                    DeviceToken: firebasetoken,
                    Uuid,
                  },
                },
                { new: true }
              );
              // console.log(
              //   "jab dobara admin as a user kisi ke blog me jayega to kuch info save karega updateAdminasUserInfo ",
              //   updateAdminasUserInfo
              // );
            } else {
              //if Register user come for the first time in Blog-admin blog then adding him in list with all info and save it
              const newAdminasUser = new AdminAsUser({
                socketid: socket.id,
                Username: name,
                Userstatus: "online",
                messageNotification: 0,
                Subdomain: subDomain,
                userImageUrl: userImageUrl,
                adminImageUrl: adminImageUrl,
                AdminName: BlogAdminName,
                adminImageUrl: adminImageUrl,
                Subdomain: subDomain,
                DeviceToken: firebasetoken,
                Uuid,
              });
              const DataSaved = await newAdminasUser.save();
              // console.log(
              //   "save kar dia h database me jab admin as a user kisi ke blog par visit kar rha h",
              //   DataSaved
              // );
            }

            //when Register user come first time then sending a list of users in which he is visited visited list
            const allusersofAdminasUser = await AdminAsUser.find({
              Username: adminAsUserName,
            });

            io.to(socket.id).emit("adminAsUserList", {
              allusersofAdminasUser: allusersofAdminasUser,
            });

            io.to(viewUser[logedInUsername]).emit("adminAsUserList", {
              allusersofAdminasUser: allusersofAdminasUser,
            });

            // console.log(
            //   "abhi tak admin kitne loge ke blog me as a user ja chuka h or kis socketid me bhej raha h ",
            //   allusersofAdminasUser,
            //   socket.id
            // );
          }
        }

        //this is we are doiong again when non-register user come to any admins-blog then we have to add him in chatnotification model list
        // we are storing user a,b,c visiting and msging to shubham link or blog like {shubham:{a:1,b:3,c:0}} and we are using admin domian
        //to save user a,b,c
        if (BlogAdminName) {
          //first find his admin that is he already added on chatnotification model or not
          const foundAdmin = await chatNotificationModel.findOne({
            subDomain: subDomain,
          });

          // console.log("foundAdmin first in collection", foundAdmin);
          //if admin is not added in list then add his admin first in chatnotification model
          if (!foundAdmin) {
            const created = await chatNotificationModel({
              subDomain: subDomain,
              adminName: BlogAdminName,
              userMsgNotification: [],
            });
            const saved = await created.save();
            // console.log("admin ko collection me add kar dia gya h", saved);
            // also find that this user is already added in admins array or not
            const found = await chatNotificationModel.findOne({
              subDomain: subDomain,
              "userMsgNotification.userName": name,
            });

            // console.log("admin ke array me ye user mila ki nhi", found);
            //if this user is not added in admins chatnotification array list then add him
            if (!found) {
              const updated = await chatNotificationModel.findOneAndUpdate(
                { subDomain: subDomain },
                {
                  $push: {
                    userMsgNotification: { userName: name, numberOfMsg: 0 },
                  },
                },
                { new: true }
              );
              // console.log(
              //   "admin ke array me user add nhi tha add kar dia h",
              //   updated
              // );
            }
          }
          //if this user admin already added in chatnotification array then
          if (foundAdmin) {
            console.log("admin ke array me ye user mila ki nhi", subDomain);
            //if admin is already added then first search this user that is he already added in admins array or not
            const found = await chatNotificationModel.findOne({
              subDomain: subDomain,
              "userMsgNotification.userName": name,
            });

            //if user is not added in admin chatnotification array then add him in that array
            if (!found) {
              const updated = await chatNotificationModel.findOneAndUpdate(
                { subDomain: subDomain },
                {
                  $push: {
                    userMsgNotification: { userName: name, numberOfMsg: 0 },
                  },
                },
                { new: true }
              );
              // console.log(
              //   "admin ke array me user add nhi tha add kar dia h",
              //   updated
              // );
              //%%% End of if statement braket
            }
            //%%% End of if statement braket
          }
          //after adding him in admins array sending chatnotification list to his admin
          const foundAdminAgain = await chatNotificationModel.findOne({
            subDomain: subDomain,
          });
          io.to(viewUser[BlogAdminName]).emit("chatNotification", {
            allMsgNotification: foundAdminAgain.userMsgNotification,
          });
        }

        //This is Registered Blog-admin is coming****
        if (adminOnlly === false) {
          console.log("subDomain when admin false ", subDomain);
          //we are sending him chatnotification array if his like this  {shubham:{a:1,b:3,c:0}}
          // so first searching him in that chatnotification model
          const foundAdmin = await chatNotificationModel.findOne({
            subDomain: subDomain,
          });
          // console.log("admin add h ki nhi collection", foundAdmin);

          if (foundAdmin) {
            // console.log(
            //   "admin ke users ka notification",
            //   foundAdmin.userMsgNotification
            // );
            // if he found inside chatnotification model then sending him his list {shubham:{a:1,b:3,c:0}}
            io.to(socket.id).emit("chatNotification", {
              allMsgNotification: foundAdmin.userMsgNotification,
            });
            //%%% End of if statement braket
          }

          //if he did not find,that means he is new Register Blog-admin then adding in chatnotification model
          if (!foundAdmin) {
            const created = await chatNotificationModel({
              subDomain: subDomain,
              adminName: name,
              userMsgNotification: [],
            });
            const saved = await created.save();
            // console.log("admin ko collection me add kar dia gya h", saved);

            //send him his chatnotification list  after getting from findone
            const foundadmin = await chatNotificationModel.findOne({
              subDomain: subDomain,
            });

            io.to(socket.id).emit("chatNotification", {
              allMsgNotification: foundadmin.userMsgNotification,
            });
            //%%% End of if statement braket
          }

          //this will work for both new register or old register
          // we are finding amd sending list of , (this admin as a user kitne logo ke blog or link me visit kar chuka h)
          const allusersofAdminasUser = await AdminAsUser.find({
            Username: adminAsUserName,
          });
          // console.log(
          //   "admin ke online aane par as a user jitne blog me gya tha uski info de rhe h when he is coming as a admin",
          //   allusersofAdminasUser
          // );
          io.to(socket.id).emit("adminAsUserList", {
            allusersofAdminasUser: allusersofAdminasUser,
          });

          //if register user come again after offline then updating his online status to all other Blog-admins online-users list
          //matlab register admin as a user jis jis ke blog or link me visit kiya tha un sab ki online list me status online se offline change karna h
          if (Status === "admin") {
            // console.log("blog admin h status admin h");
            const res = await AdminAsUser.updateMany(
              { AdminName: name },
              { Userstatus: "online" }
            );
            // console.log("res after upding his status", res);
            const respons = await AdminsOnlineuser.updateMany(
              { Username: adminAsUserName },
              { socketid: socket.id, Userstatus: "online" }
            );

            viewUser[adminAsUserName] = socket.id;
          }
          //%%% End of if statement braket
        }

        //now i have one model AdminsOnline user where all the Admins plus his link or blog visited users are available
        //yhi se mai every admin or register user ki Online-users list nikalta hu
        //so in every condition this will work chahe Register user ho ya uske online-user yani visitors
        //getting users name then updating all the info which is required
        const updatinginfo = await AdminsOnlineuser.findOneAndUpdate(
          { Username: name },
          {
            $set: {
              socketid: socket.id,
              Userstatus: "online",
              DeviceToken: firebasetoken,
              Uuid,
            },
          },
          { new: true }
        );
        // console.log("updatinginfo", updatinginfo);

        //getting allprevious msg of connected users & admin because if anyone goes online and some one send him msg it will store in database
        //when ever he will come back he can retrive all his msge's
        const allmsg = await ChatMsg.find(
          { $or: [{ sendername: name }, { receivername: name }] },
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              io.to(socket.id).emit("allmsg", { allMsg: docs });
            }
          }
        );

        //saving his socket id with user name in locally because we can use it quickly
        //changing and adding the socket id of any connected user eighter BlogVisitorUser or user
        viewUser[name] = socket.id;

        //taking a msg notification number of every user inside mssges array  when user is coming again or first time
        //this was using previously
        NumberOfMsg[name] = i;

        //EXISTING BLOG-ADMIN------------------
        //searching his online-users or searching is he already available in Adminonlineusers array
        //*** should change - here we can check from upper updating info that is he already available in Adminonlineusers array or not
        const available = await AdminsOnlineuser.find({ AdminName: name });
        const availableAdmin = await AdminsOnlineuser.findOne({
          Username: name,
        });

        //if he is available or Blog-admin as well checking from adminOnlly type false
        // saving his socket id with his name and sending his online status to all others his users that i have come online
        //also sending his online-users list of him
        if (availableAdmin && adminOnlly === false) {
          // console.log("i am a existing Blog admin");
          // console.log("admin ke onlineuser", available);
          // const adminAsUser = await AdminsOnlineuser.find({ AdminName: name });
          AdminsOnly[name] = socket.id;
          available.map((data) => {
            io.to(data.socketid).emit("AdminStatus", {
              AdminStatus: "online",
              AdminName: name,
            });
            viewUser[data.Username] = data.socketid;
          });
          console.log("\nSending all onlineuser list", available.length, {
            id: socket.id,
          });
          io.to(socket.id).emit("online", { available });

          // io.to(socket.id).emit("notification", { Notification, ClickedUser });
        }

        //NEW BLOG-ADMIN----------------------
        //if new blog-admin h then creating his instance in AdminOnlineuser model
        if (!availableAdmin && adminOnlly === false) {
          // console.log("i am new Blog admin");
          const newAdminsOnlineuser = new AdminsOnlineuser({
            socketid: socket.id,
            Username: name,
            Userstatus: "online",
            Admin: true,
            DeviceToken: firebasetoken,
            Uuid,
          });
          const OnlineUserOfAdmin = await newAdminsOnlineuser.save();
          AdminsOnly[name] = socket.id;
          //*** this can remove because admin is new then no need of sending  online-users list  */
          io.to(socket.id).emit("online", { available });
          // io.to(socket.id).emit("notification", { Notification, ClickedUser });
        }

        //if you have the value of BlogAdminName it means you are a visitor either new or old visitor
        if (BlogAdminName && name) {
          socket.emit("message", {
            user: BlogAdminName,
            text: `welcome to my Blog`,
          });

          const updatinginformation = await AdminsOnlineuser.findOneAndUpdate(
            { Username: name, AdminName: BlogAdminName },
            { $set: { socketid: socket.id, Userstatus: "online" } },
            { new: true }
          );

          // console.log(
          //   "registered user ka es admin ke sath pahle se add h AdminsOnlineuser me ",
          //   updatinginformation
          // );
          // EXISTING BLOGVISITORUSER---------------
          //updating info means you have updated you value it means you are already came before
          //means you are old blog-visitor
          if (updatinginformation) {
            console.log("i am a existing BlogVistor user", BlogAdminName, name);
            //finding your blog-admin information like socket id
            const availableAdmin = await AdminsOnlineuser.findOne({
              Username: BlogAdminName,
            });

            viewUser[availableAdmin?.Username] = availableAdmin?.socketid;
            // telling to his admin i have viewd all your msg's
            io.to(viewUser[BlogAdminName]).emit("delivertoadmin2", {
              name: name,
            });

            //WELCOME-MSG to the Connected User
            //giving a welcome msg to old visitor
            // NEW BLOGVISITORUSER-----------------------------------------
            //if you have your BlogadminName value but you are not updated ur info that means you are new blog-visitor
            // if (!updatinginfo) {
            //   ClickedUser = "";
            //   //creating his instance and adding him to admin online-user list
            //   const newAdminsOnlineuser = new AdminsOnlineuser({
            //     socketid: socket.id,
            //     Username: name,
            //     Userstatus: "online",
            //     AdminName: BlogAdminName,
            //     userImageUrl: userImageUrl,
            //     DeviceToken: firebasetoken,
            //     Uuid,
            //   });
            //   const OnlineUserOfAdmin = await newAdminsOnlineuser.save();
            //   // console.log(
            //   //   "i am new Blogvisitor user and inserting my info database",
            //   //   OnlineUserOfAdmin
            //   // );
            //   //WELCOME-MSG to the Connected User
            //   socket.emit("message", {
            //     user: BlogAdminName,
            //     text: `Welcome User`,
            //   });

            //   BlogVisitorUser[name] = BlogAdminName;
            // }
            //finding new blog-visitor user admin info like socket id
            const availableUsers = await AdminsOnlineuser.find({
              AdminName: BlogAdminName,
            });

            //after adding blog-visitor to admins online-user list sending a new online-user list to his admin
            // const availableAdmin = await AdminsOnlineuser.findOne({
            //   Username: BlogAdminName,
            // });

            // viewUser[availableAdmin?.Username] = availableAdmin?.socketid;

            io.to(viewUser[BlogAdminName]).emit("online", {
              available: availableUsers,
            });
          }
        }

        callback();
      }
    );

    //-----------------------------BlogAdmin && BlogVisitor user Creating Connection complete----------------------------

    //-------------------------------------------Myty_Homepage_Event_Start-----------------------------------------------

    //doing 0 number of msg when admin clicked on a user in frontend online-userslist in admin panel
    socket.on("changeMessage", ({ ClickedUserName }, callback) => {
      receiveClickedUserName = ClickedUserName;
      if (ClickedUserName) {
        mssages[ClickedUserName] = 0;
        NotificationsOfMsg.map((data) =>
          data.Username == ClickedUserName ? (data.numberofmsg = 0) : null
        );
      }
    });

    socket.on("gettingallmsg", async ({ name }, callback) => {
      const allmsg = await ChatMsg.find(
        { $or: [{ sendername: name }, { receivername: name }] },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            io.to(socket.id).emit("sendingallmsg", { allMsg: docs });
          }
        }
      );
    });
    socket.on("gettingallmsges", async ({ name, Blogadmin }, callback) => {
      // console.log("name,Blogadmin", name, Blogadmin);
      const allmsg = await ChatMsg.find(
        {
          $or: [
            { sendername: name, receivername: Blogadmin },
            { sendername: Blogadmin, receivername: name },
          ],
        },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            // console.log("docs", docs);
            io.to(socket.id).emit("sendingallmsg", { allMsg: docs });
          }
        }
      );
    });

    //deleteUser from online list
    socket.on("deleteUser", async ({ deleteUsername, name }, callback) => {
      const deletedUser = await Onlineuser.findOneAndDelete({
        Username: deleteUsername,
      });
      if (deletedUser) {
        const allusers = await Onlineuser.find(
          { Official: false },
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              //if user is new then again we are sending fresh list to admin
              io.to(adminOnly).emit("allonlineuser", { allonlineuser: docs });
            }
          }
        );
        const allmsg = await ChatMsg.deleteMany({
          $or: [
            { sendername: deleteUsername },
            { receivername: deleteUsername },
          ],
        });

        const allmsges = await ChatMsg.find({
          $or: [{ sendername: name }, { receivername: name }],
        });

        io.to(adminOnly).emit("AfterDeletingUser", { allmsges: allmsges });
        io.to(viewUsers[deleteUsername]).emit(
          "AfterDeletingUserfromAdminlist",
          { remove: true }
        );
        io.to(viewUsers[deleteUsername]).emit("message", {
          user: name,
          text: `your session has been expired please refresh your page for a new session`,
        });
        receiveClickedUserName = "";
      }
    });

    //using this event for typing indicator for BlogAdmin && BlogVisitorUser
    socket.on("TypingSignal", ({ typing, name, receiver, admin }) => {
      if (receiver) {
        io.to(viewUsers[receiver]).emit("typing", {
          typing: typing,
          name: name,
        });
      }
      if (admin == true) {
        io.to(adminOnly).emit("typing", {
          typing: typing,
          name: name,
        });
      }
    });

    // this event is using for changing the message status 'sent' to 'delivert' when user receive the msg
    socket.on(
      "Deliverysignaltoserver",
      async ({ msgid, delivery, User, adminan, name }) => {
        if (msgid) {
          let updateddoc = await ChatMsg.findOneAndUpdate(
            { messageid: msgid },
            { messagestatus: "delivered" },
            {
              new: true,
            }
          );

          if (adminan) {
            io.to(viewUsers[adminan]).emit("delivertoadmin", {
              msgid,
              delivery,
            });
          }

          if (User) {
            io.to(viewUsers[User]).emit("delivertouser", { msgid, delivery });
          }
        }
      }
    );

    // this event is using for storing the msg with msg deatils
    socket.on(
      "Chatmessage",
      async (
        { messagge, messagestatus, name, receiver, msgid, time, User },
        callback
      ) => {
        const newChatMsg = new ChatMsg({
          message: messagge,
          messageid: msgid,
          messagestatus: messagestatus,
          sendername: name,
          receivername: receiver,
          time: time,
          User: User,
        });
        const chatmsg = await newChatMsg.save();
      }
    );

    //handling the msg event in server side & this event is coming from the client side
    socket.on(
      "sendMessage",
      ({ messagge, name, receiver, msgid, time, Mobile, User }, callback) => {
        if (receiveClickedUserName !== name) {
          mssages[name]++;
          NotificationsOfMsg.map((data) =>
            data.Username == name
              ? (data.numberofmsg = data.numberofmsg + 1)
              : null
          );
        } else {
          console.log(
            "something is inside ClickedUser",
            receiveClickedUserName
          );
        }

        // Emiting other user,s msg to adminOnly
        mytyBot("/Chat", `UserName : ${name}`, messagge);
        if (!receiver) {
          io.to(adminOnly).emit("message", {
            user: name,
            text: messagge,
            msgnum: "true",
            whom: "shubhamtiwari",
            msgid: msgid,
            messagestatus: "sent",
            nummsg: mssages[name],
            time: time,
            User: User,
          });
        }

        !Mobile
          ? io.to(socket.id).emit("message", {
              user: name,
              text: messagge,
              whom: receiver,
              msgid: msgid,
              messagestatus: "sent",
              time: time,
              User: User,
            })
          : null;

        io.to(viewUsers[receiver]).emit("message", {
          user: name,
          text: messagge,
          whom: receiver,
          msgid: msgid,
          messagestatus: "sent",
          time: time,
          User: User,
        });
        callback();
      }
    );

    //-------------------------------------------Myty_Homepage_Event_Complete-----------------------------------------------

    //----------------------------------------BlogAdmin && BlogVisitor Event Start-------------------------------------------

    async function Msgincrement(name, subDomain, receiver) {
      console.log("name, subDomain, receiver", name, subDomain, receiver);
      const updatinginfo = await chatNotificationModel.findOneAndUpdate(
        { subDomain: subDomain, "userMsgNotification.userName": name },
        { $inc: { "userMsgNotification.$.numberOfMsg": 1 } },
        { new: true }
      );
      // console.log("incrementing,subDomain,name", updatinginfo, subDomain, name);

      if (!updatinginfo && ClickedUserOfAdminAsUser !== name) {
        const updateAdminasUserInfo = await AdminAsUser.findOneAndUpdate(
          { AdminName: name, Username: receiver },
          {
            $inc: {
              messageNotification: 1,
            },
          },
          { new: true }
        );
        // console.log(
        //   "admin as user me user ne increment mara h",
        //   updateAdminasUserInfo
        // );
        if (updateAdminasUserInfo) {
          const allusersofAdminasUser = await AdminAsUser.find({
            Username: receiver,
          });
          // console.log(
          //   "msg increment hote hi adminasuser ko emit kar dia h,viewUser[receiver]",
          //   allusersofAdminasUser,
          //   viewUser[receiver]
          // );
          io.to(viewUser[receiver]).emit("adminAsUserList", {
            allusersofAdminasUser: allusersofAdminasUser,
          });
        }
      }
    }

    async function Msgdecrement(name, subDomain) {
      const updatinginfo = await chatNotificationModel.findOneAndUpdate(
        { subDomain: subDomain, "userMsgNotification.userName": name },
        { $set: { "userMsgNotification.$.numberOfMsg": 0 } },
        { new: true }
      );
      // console.log("zero hua kya collection me numberOfMsg", updatinginfo);
    }

    socket.on("getAnalyticsData", async ({ name }, callback) => {
      try {
        // console.log("getAnalyticsData", name);

        const available = AdminsOnlineuser.find({
          AdminName: name,
          Userstatus: "online",
        });
        // const all = AdminsOnlineuser.find({
        //   AdminName: name,
        // });

        const [online] = await Promise.all([available]);
        callback({ online });
      } catch (error) {
        console.log("error in setAnalyticsData", error);
      }
    });

    socket.on("setAnalyticsData", async (data, callback) => {
      try {
        const savedData = await UserAnalytics.insertMany(data);
        // console.log("savedData", savedData);
        callback(savedData);
      } catch (error) {
        console.log("error in setAnalyticsData", error);
      }
      // console.log("savedData in database", savedData);

      // const available = await AdminsOnlineuser.find({
      //   AdminName: name,
      //   Userstatus: "online",
      // });
    });

    socket.on("gettingallmsg", async ({ name }, callback) => {
      const available = await AdminsOnlineuser.find({ AdminName: name });
      io.to(socket.id).emit("online", { available });
      const allmsg = await ChatMsg.find(
        { $or: [{ sendername: name }, { receivername: name }] },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            io.to(socket.id).emit("sendingallmsg", { allMsg: docs });
          }
        }
      );
    });
    socket.on("gettingallmsgesofBoth", async ({ name, receiver }, callback) => {
      // console.log("gettingallmsgesofBoth,name, receiver", name, receiver);
      const allmsg = await ChatMsg.find(
        {
          $or: [
            { sendername: name, receivername: receiver },
            { sendername: receiver, receivername: name },
          ],
        },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            io.to(socket.id).emit("sendingallmsg", { allMsg: docs });
          }
        }
      );
    });

    //Making clear the name in clicked user
    socket.on("ClearClickedUser", ({ UserName, subDomain }, callback) => {
      ClickedUser = "";
    });

    //giving a fresh list
    socket.on(
      "RequestingForAdminasUserList",
      async ({ username }, callback) => {
        const allusersofAdminasUser = await AdminAsUser.find({
          Username: username,
        });
        // console.log(
        //   "receiving the request emit a fresh list ",
        //   viewUser[username],
        //   allusersofAdminasUser
        // );
        io.to(socket.id).emit("adminAsUserList", {
          allusersofAdminasUser: allusersofAdminasUser,
        });
      }
    );

    socket.on(
      "ClearAdminasUserClickedUser",
      ({ UserName, subDomain }, callback) => {
        ClickedUserOfAdminAsUser = "";
        console.log(
          "ClickedUserOfAdminAsUser,UserName,subDomain",
          ClickedUserOfAdminAsUser,
          UserName,
          subDomain
        );
      }
    );

    //Doing zero on notification number of that clicked user
    socket.on("changeMessagess", ({ UserName, subDomain }, callback) => {
      Msgdecrement(UserName, subDomain);
      ClickedUser = UserName;
      if (UserName) {
        NumberOfMsg[UserName] = 0;
      }
    });

    //deleting user who is also a blog admin from adminAsUser list
    socket.on("deleteBlogAdmin", async ({ name, deleteUsername }, callback) => {
      const deletedUser = await AdminAsUser.findOneAndDelete({
        AdminName: deleteUsername,
        Username: name,
      });
      // console.log(
      //   "deleting user who is also a blog admin from adminAsUser list",
      //   deletedUser
      // );
      if (deletedUser) {
        const availableUsers = await AdminAsUser.find({
          Username: name,
        });
        // console.log(
        //   "after deleting viewUser[name],availableUsers",
        //   viewUser[name],
        //   availableUsers
        // );
        io.to(viewUser[name]).emit("adminAsUserList", {
          allusersofAdminasUser: availableUsers,
        });
      }
    });

    //deleting users from onlineusers list
    socket.on("deletedUser", async ({ deleteUsername, name }, callback) => {
      const deletedUser = await AdminsOnlineuser.findOneAndDelete({
        Username: deleteUsername,
      });

      if (deletedUser) {
        ClickedUser = "";

        const availableUsers = await AdminsOnlineuser.find({
          AdminName: name,
        });
        io.to(viewUser[name]).emit("online", {
          available: availableUsers,
        });

        const allmsg = await ChatMsg.deleteMany({
          $or: [
            { sendername: deleteUsername, receivername: name },
            { sendername: name, receivername: deleteUsername },
          ],
        });
        // console.log("allMsg of deleted user", allmsg);

        const allmsges = await ChatMsg.find({
          $or: [{ sendername: name }, { receivername: name }],
        });

        io.to(viewUser[name]).emit("afterDeleteUsername", {
          allmsges: allmsges,
        });

        io.to(viewUser[deleteUsername]).emit("message", {
          user: name,
          text: `your session has been expired please refresh your page for a new session`,
        });
        io.to(viewUser[deleteUsername]).emit(
          "AfterDeletingUserfromAdminslist",
          { remove: true }
        );
      }
    });

    //When BlogAdmin start and stop typing then sending this signal to BlogVisitor user
    socket.on("signalone", ({ typeStart, receiver, name }) => {
      // console.log("admin se signal a rha h", viewUser[receiver], name);
      io.to(viewUser[receiver]).emit("signalonetouser", {
        typeStart: typeStart,
        name: name,
      });
    });

    //When Blog visitor user start and stop typing then sending this signal to BlogAdmin
    socket.on("signalforTyping", ({ typeStart, BlogAdmin, name }) => {
      io.to(viewUser[BlogAdmin]).emit("signalofTyping", {
        typeStart: typeStart,
        name: name,
      });
    });

    //Msg delivery signal to Blog visitor User
    socket.on(
      "DeliverysignaltoBlogVisitor",
      async ({ msgid, delivery, User, name }) => {
        if (msgid) {
          let updateddoc = await ChatMsg.findOneAndUpdate(
            { messageid: msgid },
            { messagestatus: "delivered" },
            {
              new: true,
            }
          );
        }
        io.to(viewUser[User]).emit("delivertouserr", { msgid, delivery });
      }
    );

    //Msg delivery signal to BlogAdmin
    socket.on("Deliverysignaltoadmin", async ({ msgid, blogAdmin, name }) => {
      if (msgid) {
        let updateddoc = await ChatMsg.findOneAndUpdate(
          { messageid: msgid },
          { messagestatus: "delivered" },
          {
            new: true,
          }
        );
      }
      io.to(viewUser[blogAdmin]).emit("delivertoadmin", { msgid, name });
    });

    // this event is using for storing the msg with msg deatils
    socket.on(
      "ChatmessageforUser",
      async (
        {
          messagge,
          messageMetadata,
          messagestatus,
          name,
          receiver,
          msgid,
          time,
          User,
          BlogAdmin,
          userstatus,
          _Self_Image_url,
          havepreviousmsg,
        },
        callback
      ) => {
        console.log("havepreviousmsg, %%%%%%", havepreviousmsg);
        if (BlogAdmin && !havepreviousmsg) {
          console.log("%%%%%%havepreviousmsg", havepreviousmsg);
          const available = await AdminsOnlineuser.findOne({
            Username: name,
            AdminName: BlogAdmin,
          });
          // console.log(
          //   "msg or user dono pahle se add nhi h list me esliye ab add karenge",
          //   available
          // );
          console.log("available%%%%%%%%%%%%%%%%%%%", _Self_Image_url);
          if (!available) {
            const newAdminsOnlineuser = new AdminsOnlineuser({
              socketid: socket.id,
              Username: name,
              Userstatus: "online",
              AdminName: BlogAdmin,
              userImageUrl: _Self_Image_url?._selfImage_url ?? "",
              DeviceToken: _Self_Image_url?.firebasetoken ?? "",
              Uuid: _Self_Image_url?.Uuid ?? "", // ! analytics might have problem
            });
            const OnlineUserOfAdmin = await newAdminsOnlineuser.save();
            const availableUsers = await AdminsOnlineuser.find({
              AdminName: BlogAdmin,
            });
            io.to(viewUser[BlogAdmin]).emit("online", {
              available: availableUsers,
            });
          }
        }
        // console.log("User coming", User);
        const newChatMsg = new ChatMsg({
          message: messagge,
          messageMetadata,
          messageid: msgid,
          messagestatus: messagestatus,
          sendername: name,
          receivername: receiver,
          time: time,
          User: User,
        });
        const chatmsg = await newChatMsg.save();
      }
    );

    //handling the msg event in server side whenever any BlogUser or BlogAdmin is sending msg,s
    socket.on(
      "sendMessagetoUser",
      async (
        {
          messagge,
          messageMetadata,
          name,
          receiver,
          subDomain,
          msgid,
          BlogAdmin,
          time,
          Mobile,
          User,
          blogadmin,
        },
        callback
      ) => {
        if (ClickedUser !== name) {
          // console.log("ClickedUser !== name is running");
          Msgincrement(name, subDomain, receiver);
          NumberOfMsg[name]++;
        } else console.log("we have something in ClickedUser", ClickedUser);

        // this event is not not sunning purhabs
        if (!receiver) {
          console.log(
            "!receiver is ruuning",
            receiver,
            "name",
            name,
            "socket id viewUser[BlogAdmin]",
            viewUser[BlogAdmin]
          );
          io.to(viewUser[BlogAdmin]).emit("message", {
            user: name,
            text: messagge,
            messageMetadata,
            msgnum: "true",
            whom: BlogAdmin,
            msgid: msgid,
            messagestatus: "sent",
            nummsg: NumberOfMsg[name],
            time: time,
            User: User,
          });
        }

        // Sending Msg to self eighter he is BlogAdmin or BlogVisitor user
        if (!Mobile) {
          // console.log(
          //   "!Mobile is running",
          //   !Mobile,
          //   "socket id in viewUser[name] ",
          //   viewUser[name]
          // );
          io.to(viewUser[name]).emit("message", {
            user: name,
            text: messagge,
            messageMetadata,
            whom: receiver,
            msgid: msgid,
            messagestatus: "sent",
            time: time,
            User: User,
          });
        }

        // this event is running for both admin-user and user-admin
        if (receiver) {
          console.log(
            "receiver, messagge, name, subDomain,blogadmin ***********************when msg send",
            receiver,
            messagge,
            name,
            subDomain,
            blogadmin,
            viewUser[receiver]
          );
          Notification(receiver, messagge, name, subDomain, blogadmin);
          io.to(viewUser[receiver]).emit("message", {
            user: name,
            text: messagge,
            messageMetadata,
            whom: receiver,
            msgid: msgid,
            messagestatus: "sent",
            msgnum: "true",
            nummsg: NumberOfMsg[name],
            time: time,
            User: User,
          });
        }
        callback();
      }
    );

    //----------------------------------BlogAdmin && BlogVisitor Event End--------------------------------

    //DISCONNECTION EVENT----------------
    socket.on("disconnect", async () => {
      // console.log("disconnected socked id", socket.id);

      const UserSearched = await AdminsOnlineuser.findOne({
        socketid: socket.id,
      });
      // console.log(
      //   "blogadmin or blogvisitor disconnected",
      //   UserSearched,
      //   socket.id
      // );
      const UserSearchedagain = await Onlineuser.findOne({
        socketid: socket.id,
      });

      //-------------------------------MyTy_Homepage_User_or_SuperAdmin_Disconnect-------------------------------------------------------
      if (UserSearchedagain) {
        //updating  disconnected userstatus 'online' to 'offline' in mongodb
        if (socket.id !== adminOnly) {
          // console.log("myty HOME page user disconnected");
          let updateddocumentt = await Onlineuser.findOneAndUpdate(
            { socketid: socket.id },
            { Userstatus: "offline" },
            {
              new: true,
            }
          );

          //after disconnectin of user sending a fresh online user-list to admin
          const allusers = await Onlineuser.find(
            { Official: false },
            function (err, docs) {
              if (err) {
                console.log(err);
              } else {
                //here we are sending fresh list to admin
                io.to(adminOnly).emit("allonlineuser", { allonlineuser: docs });
              }
            }
          );
        }

        // if admin is going offline then sending the offline status of admin to all users
        if (socket.id == adminOnly) {
          // console.log("myty superadmin disconnected");
          receiveClickedUserName = "";
          const allusers = await Onlineuser.find({}, function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              console.log("telling to all users that admin went offline");
            }
          });

          allusers.map((data) => {
            io.to(data.socketid).emit("adminStatusToUser", {
              admin: "offline",
            });
          });
        }
      }

      //-------------------------------When_MyTy_Homepage_User_or_SuperAdmin_Disconnect-------------------------------------------------------

      //------------------------------When BlogVisitorUser or BlogAdmin Disconnect--------------------------------------------------------
      if (UserSearched) {
        try {
          const DisconnectedUser = await AdminsOnlineuser.find({
            socketid: socket.id,
          });

          // console.log("DisconnectedUser info", DisconnectedUser);

          if (DisconnectedUser) {
            var removedUserName = DisconnectedUser[0]?.Username;
            //BLOGADMIN DISCONNECTED---------------------
            if (DisconnectedUser[0]?.Admin === true) {
              // console.log("Blog Admin disconnected", DisconnectedUser);
              const available = await AdminsOnlineuser.find({
                AdminName: removedUserName,
              });
              ClickedUser = "";
              if (available) {
                available.map((data) => {
                  return io.to(data.socketid).emit("AdminStatus", {
                    AdminStatus: "offline",
                    AdminName: removedUserName,
                  });
                });

                const res = await AdminAsUser.updateMany(
                  { AdminName: removedUserName },
                  { Userstatus: "offline" }
                );
              }
            }

            //BLOGVISITOR USER DISCONNECTED------------------
            if (DisconnectedUser[0]?.AdminName) {
              // console.log("BlogVisitor User disconnected", DisconnectedUser);
              const updateddocument = await AdminsOnlineuser.findOneAndUpdate(
                { Username: DisconnectedUser[0].Username },
                { $set: { socketid: socket.id, Userstatus: "offline" } },
                { new: true }
              );
              // console.log(
              //   "BlogVisitorUserStatusOffline teeling to his admin",
              //   updateddocument
              // );
              const FindAdmin = await AdminsOnlineuser.find({
                socketid: socket.id,
              });

              var BlogAdmin = FindAdmin[0]?.AdminName;

              const available = await AdminsOnlineuser.find({
                AdminName: BlogAdmin,
              });
              // console.log(
              //   "emiting fresh onlineuser list after visitor disconnected",
              //   available,
              //   AdminsOnly[BlogAdmin]
              // );
              io.to(AdminsOnly[BlogAdmin]).emit("online", { available });
            }
            if (DisconnectedUser[1]?.AdminName) {
              // console.log("BlogVisitor User disconnected", DisconnectedUser);
              const updateddocument = await AdminsOnlineuser.findOneAndUpdate(
                { Username: DisconnectedUser[1].Username },
                { $set: { socketid: socket.id, Userstatus: "offline" } },
                { new: true }
              );
              // console.log(
              //   "BlogVisitorUserStatusOffline teeling to his admin",
              //   updateddocument
              // );
              const FindAdmin = await AdminsOnlineuser.find({
                socketid: socket.id,
              });
              // console.log(
              //   "FindAdmin jiska user disconnect hua h usko dhundo",
              //   FindAdmin
              // );
              var BlogAdmin = FindAdmin[1]?.AdminName;

              const available = await AdminsOnlineuser.find({
                AdminName: BlogAdmin,
              });
              // console.log(
              //   "emiting fresh onlineuser list after visitor disconnected",
              //   available,
              //   AdminsOnly[BlogAdmin]
              // );
              io.to(AdminsOnly[BlogAdmin]).emit("online", { available });
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
      //------------------------------When BlogVisitorUser or BlogAdmin Disconnect--------------------------------------------------------
    });
  });
};
module.exports = sockets;
