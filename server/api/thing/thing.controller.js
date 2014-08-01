/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

// Get list of things
exports.index = function(req, res) {

    res.json((function() {
        var myString = "D 10 0 2013-085T23:30:00 2013-086T07:00:00 3 0 14 1024 8 0 0 0 '25 (0085)' 0";
        myString = myString.split(/\s/);
        return {
            start: myString[2],
            end: myString[3],
            user: myString[13] + myString[14]
        }
    })());

};

 // D 10 0 2013-085T23:30:00 2013-086T07:00:00 3 0 14 1024 8 0 0 0 "25 (0085)" 0
 // D 10 0 2013-085T06:00:00 2013-085T10:50:00 3 0 112 1024 8 0 0 0 "45 (0085)" 0
 // D 10 0 2013-085T17:35:00 2013-085T23:40:00 3 0 210 1024 8 0 0 0 "55 (0085)" 0
