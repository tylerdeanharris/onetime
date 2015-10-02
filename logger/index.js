
var statGenerator = require('../statisticsGenerator');
var DAO = require('../houseDAO')
loggingFunctions = {};

loggingFunctions.updateDeviceLog = function(deviceName, state){
    DAO.retrieveArrayAndPushTime(deviceName, state, function (timeArray, timeSelector) {
        console.log(timeArray);
        console.log(timeSelector);
        DAO.insertLogArray(timeArray, deviceName, timeSelector);
    });
    DAO.retreiveTimeArrayDiffrences(deviceName, function (differenceArray) {
        console.log(differenceArray.toString());

        DAO.retrieveWattage(deviceName, function (power) {
            var sum = 0;
            for (var i = 0; i < differenceArray.length; i++) {
                var stat = statGenerator.calculation(power, differenceArray[i]);
                sum += stat;
            }
            console.log("total kilowatt hours usage for " + deviceName + ": " + sum);
        });
    });

};

module.exports = loggingFunctions;