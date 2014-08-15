'use strict';

var _ = require('lodash');
var pathFile = 'server/backend/dc057a.02.sfos';
var fs = require('fs');


exports.index = function(req, res) {
    res.json(
        fileParser(pathFile)
    );
};

//get file and parse as json
function fileParser(pathFile) {
    return {
        data: fs.readFileSync(pathFile).toString().split('\n')
    }
}
