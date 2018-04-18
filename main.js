var admin = require("firebase-admin");
var nodemailer = require('nodemailer');

// Fetch the service account key JSON file contents
var serviceAccount = require("./serviceAccountKey.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://assignment3-aa2c7.firebaseio.com"  // IMPORTANT: repalce the url with yours 
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("/motionSensorData"); // channel name
ref.on("value", function(snapshot) {   //this callback will be invoked with each new object
    console.log(snapshot.val());         // How to retrive the new added object
  }, function (errorObject) {             // if error
    console.log("The read failed: " + errorObject.code);
  });


var bone = require('bonescript');
var led = 'P8_10';
var sensor = 'P9_12';


var date = Math.round((new Date()).getTime()/1000);
var start = date
var t1 = 1;
var t2 = 5;
var l = 0;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fit3140.s12018.team19M@gmail.com',
        pass: 'fit3140@19'
    }
});

var mailOptions = {
    from: 'fit3140.s12018.team19M@gmail.com',
    to: 'engsoon94@hotmail.com',
    subject: 'Motion Detected!',
    text: ':)'
};
  

bone.pinMode(sensor,bone.INPUT);

setInterval(checkSensor, 2000);

function checkSensor(){
    var input = bone.digitalRead(sensor);
    if (input == 1){
        l++;

        if (l > t1 && l < t2){
            // Function 2.2.1: send email if motion length is in t1<l<t2
            console.log("Motion detected!");
            var end = Math.round((new Date()).getTime()/1000);
            ref.push({
                Timestamp: date,
                startMotion: start,
                endMotion: end
            });
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
        } else if (l > t2){
            // Function 2.2.3: clears database if l>t2
            ref.remove();
            console.log("Database has been reset");
            l = 0;
        }
    } else{
        l = 0;
        console.log("No motion detected...");
    }
};





