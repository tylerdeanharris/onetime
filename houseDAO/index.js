
var mongoose = require('mongoose');
var fs = require('fs');
var path  = require('path');
mongoose.connect("mongodb://localhost/homeautos");


fs.readdirSync(__dirname + "/../models").forEach(function(filename){
    if(~filename.indexOf('.js')) require(__dirname + "/../models/" + filename);
});

daoFunctions = {};

//daoFunctions.getLogs = function(callback){
//    var doc = mongoose.model("Log").findOne({name: "light01"}, function(err, doc){
//        console.log("blarrttt" + doc.name);
//        callback(doc.onTime );
//    });
//
//};
daoFunctions.retrieveWattage = function(device, callback){
    var doc = mongoose.model("Log").findOne({name: device}, function(err, doc) {
        if (err) {
            console.log(err);
        }
        if (!doc) {
            console.log("doc martin");
        }
        callback(doc.watts);
    });

    };


daoFunctions.retreiveTimeArrayDiffrences = function(device,callback){
    var shortestArray;
    var longestArray;
    var differenceArray = [];
    var doc = mongoose.model("Log").findOne({name: device}, function(err, doc) {
        if(doc.onTime.length > doc.offTime.length){
            shortestArray = doc.offTime;
            longestArray = doc.onTime;
        }else{
            shortestArray = doc.onTime;
            longestArray = doc.offTime;
        }
        for(var i = 0; i < shortestArray.length; i++){
            differenceArray.push(((doc.onTime[i] - doc.offTime[i]) / 1000) /60 )/60;
            //console.log("difference value: " + differenceArray[i]);
        }
        callback (differenceArray);
    });

    };


daoFunctions.retrieveArrayAndPushTime = function(device,deviceState,callback){
    var timeSelector;
    var myDate = new Date();
    var myTime = myDate.getTime();
    var doc = mongoose.model("Log").findOne({name: device}, function(err, doc) {
        if (err) {
            console.log(err);
        }
        if (!doc) {
            console.log("docless martin");
        }
        if (deviceState === "ON") {
            timeSelector = "onTime";
        } else {
            timeSelector = "offTime";
        }
        var timeArray = doc[timeSelector];
        timeArray.push(myTime);

        callback(timeArray, timeSelector);
    });

};

daoFunctions.insertLogArray = function(arrayLog,device,timeSelector){
    if (timeSelector !== "onTime") {
        mongoose.model("Log").update({name: device}, {$set: {offTime: arrayLog}}, {multi: false}, function (err, numAffected) {
            console.log("updated offTime, number affected ");
        });
    } else {
        mongoose.model("Log").update({name: device}, {$set: {onTime: arrayLog}}, {multi: false}, function (err, numAffected) {
            console.log("updated onTime, number affected ");
        });
    }

}

daoFunctions.asyncToggleState = function(device, callback){
    //do set set state for device in db

    var doc = mongoose.model("Device").findOne({deviceName: device}, function (err, doc) {
        if (err) {
            console.log(err);
        }
        if(!doc){
            console.log("doc is null");
        }
        if (doc["deviceState"] === "OFF") {
            doc["deviceState"] = "ON";

        } else {
            doc["deviceState"] = "OFF";

        }
        mongoose.model("Device").update({deviceName: device},{$set:{ deviceState: doc.deviceState}}, {multi:false}, function(err, numAffected){
            console.log("affected: "+ numAffected.toString());
        });
        console.log("state: " + doc.deviceState);
        //pass the parameter to the callback after its new value assigned
        callback(doc.deviceState);
    });

};



daoFunctions.getState = function(device, callback){             //retreive device state from db

    //console.log("DEVICENAME: " + device);
    var doc = mongoose.model("Device")
        .findOne({deviceName: device}, function (err, doc) {
        if (!doc) {
            console.log("doc in nulls");
        }
        //console.log("state in dao " + doc.deviceState);
        callback (doc.deviceState);
    });

};

daoFunctions.turnDevicesOff = function (aroom) {
    var doc;
    doc = mongoose.model("Device").find({deviceRoom: aroom}, function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (!docs) {console.log("doc is null");
        }
        //console.log("My Docs" + docs.toString())
        docs.forEach(function (roomDoc){
            roomDoc.deviceState ="OFF";

            mongoose.model("Device").update({deviceName: roomDoc.deviceName},{$set: { deviceState: roomDoc.deviceState}}, {multi:false}, function(err, numAffected){
                console.log("affected: "+ numAffected);
            });
        });

    });
};
daoFunctions.asyncGetStates = function(devices) {
   // var roomDevices = {};
   devices.forEach(function (device) {
        var docs = mongoose.model("Device").find({deviceName: {$in: ["light01", "light02", "light03", "light04", "light05", "light06"]}}, function (err, doc) {
            if (err) {
                console.log(err);
            }
            if (!doc) {
                console.log("no Doc");
            }
            console.log("in the thing");

        });
    // callback(docs);
 });





};

module.exports = daoFunctions;

