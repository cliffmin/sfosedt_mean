'use strict';

var _ = require('lodash');
var events = require('./events')


var pathFile = 'server/backend/dc057a.02.sfos';

// Get list of datas
exports.index = function(req, res) {
  res.json(new events.Sfosjson(pathFile));
};