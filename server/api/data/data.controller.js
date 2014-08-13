'use strict';

var _ = require('lodash');
var Sfosjson = require('./Sfosjson')


var pathFile = 'server/backend/dc057a.02.sfos';

// Get list of datas
exports.index = function(req, res) {
  res.json(new Sfosjson.Sfosjson(pathFile));
};