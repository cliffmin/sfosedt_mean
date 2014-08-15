/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var pathFile = 'server/backend/dc057a.02.sfos';
var fs = require('fs');

// Get list of things
exports.index = function(req, res) {
  res.json(
    sfosParser(pathFile)
  );
};

function sfosParser(pathFile) {
    return fs.readFileSync(pathFile).toString().split('\n');
}