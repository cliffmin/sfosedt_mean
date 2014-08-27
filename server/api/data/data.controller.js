'use strict';

var _ = require('lodash');
var Sfosjson = require('./Sfosjson');
var fs = require('fs');


var pathFile = 'server/backend/dc057a.02.sfos';

exports.index = function(req, res) {
    res.json(new Sfosjson.Sfosjson(pathFile));
};




