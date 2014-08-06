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

// P 08 0 2013-086T00:05:08 0 0 08 1024 8 1 'Mode ANOM_10' 'ANOM_10' 11 0
// P 08 0 2013-086T13:46:47 0 0 08 1024 8 1 'Mode ANOM_10' 'ANOM_10' 11 0
// P 06 0 2013-085T03:15:39 0 0 08 1024 8 1 'OWLT 0:21:35' '0:21:35' 3 0
// P 06 0 2013-085T06:00:00 0 9 08 1024 8 0 'OWLT 0:21:36' '0:21:36' 3 0
// P 06 0 2013-085T09:49:00 0 0 08 1024 8 1 'TWTA (1) ON' 'ON' 1 0
// P 06 0 2013-085T09:49:00 0 9 08 1024 8 1 'TWTA (2) STANDBY' 'STANDBY' 2 0
// P 06 0 2013-085T10:10:37 0 18 08 1024 8 1 'OWLT 0:21:37' '0:21:37' 3 0
// P 06 0 2013-085T12:30:38 0 0 08 1024 8 1 'OWLT 0:21:38' '0:21:38' 3 0
// P 06 0 2013-085T16:25:39 0 0 08 1024 8 1 'OWLT 0:21:39' '0:21:39' 3 0
// P 06 0 2013-085T20:25:40 0 0 08 1024 8 1 'OWLT 0:21:40' '0:21:40' 3 0
// P 06 0 2013-085T21:03:21 0 9 08 1024 8 1 'TWTA (1) STANDBY' 'STANDBY' 1 0
// P 06 0 2013-085T22:30:25 0 36 08 1024 8 1 'TWTA (1) STANDBY' 'STANDBY' 1 0
// P 06 0 2013-085T22:10:24 0 36 08 1024 8 0 'EARTHPNT ON' 'ON' 4 0
// P 06 0 2013-085T21:25:24 0 27 08 1024 8 1 'EARTHPNT OFF' 'OFF' 4 0