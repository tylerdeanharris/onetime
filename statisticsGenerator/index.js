/**
 * Created by Adam on 22/09/2015.
 */

var energyConsumed;

calcFunctions = {};

calcFunctions.calculation = function(power, time){
    energyConsumed = power * time / 1000;
    return energyConsumed;
};

module.exports = calcFunctions;