'use strict';

var _ = require('lodash');
var Sfosjson = require('./Sfosjson');
var fs = require('fs');


var pathFile = 'server/backend/aSol563_int_seq.sfos';

// Get list of datas
exports.index = function(req, res) {
    res.json(new Sfosjson.Sfosjson(pathFile));
};

// console.log(fs.readFileSync('../../backend/dc057a.02.sfos').toString());



