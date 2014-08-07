/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

exports.index = function sfosParser(){
    var fs = require('fs');
    fs.readFile('../../../client/app/scripts/lib/dc057a.02.sfos', function(err, f) {
            var sfosArray = f.toString().split('\n');
            return {
                events: eventsParser(sfosArray, sectionIndexes)
        }
    });
}
sfosParser();
//gets section indexes for the sfos array
function sectionIndexes(array) {
    var historyIndex = null;
    var setupIndex = null;
    var pageIndex = null;
    var formatIndex = null;
    var eventsIndex = null;
    var eofIndex = null;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === '$$HISTORY') {
            historyIndex = i;
        } else if (array[i] === '$$SETUP') {
            setupIndex = i;
        } else if (array[i] === '$$PAGE') {
            pageIndex = i;
        } else if (array[i] === '$$FORMAT') {
            formatIndex = i;
        } else if (array[i] === '$$EVENTS') {
            eventsIndex = i;
        } else if (array[i] === '$$EOF') {
            eofIndex = i;
        }
    }
    return {
        'historyIndex': historyIndex,
        'setupIndex': setupIndex,
        'pageIndex': pageIndex,
        'formatIndex': formatIndex,
        'eventsIndex': eventsIndex,
        'eofIndex': eofIndex
    }
}
//returns eventsArray object
function eventsParser(sfosArray, sectionIndexes) {
    var sfosIndexes = sectionIndexes(sfosArray);
    var eventsArray = {
        'D': [],
        'P': [],
        'V': [],
        'E': [],
        'Q': [],
        'eventsNumber': 0, //set initially 0 for read events
        'matchesSFOS': false //set initially false
    };
    var currLine = '';

    for (var i = sfosIndexes.eventsIndex; i < sfosIndexes.eofIndex; i++) {
        currLine = sfosArray[i];
        switch (currLine.charAt(0)) {
            case 'D':
                {
                    eventsArray.D.push((function(lineString) {
                        return {
                            'type': currLine.charAt(0),
                            'start': lineString.match(/\d\d\d\d-.+T\d\d:\d\d:\d\d/).join().split(/\s/)[0] || 'no value found',
                            'end': lineString.match(/\d\d\d\d-.+T\d\d:\d\d:\d\d/).join().split(/\s/)[1] || 'no value found',
                            'text': currLine.match(/".*"/).join() || 'no value found'
                        }
                    })(currLine))
                }
                break;
            case 'P':
                {
                    eventsArray.P.push((function(lineString) {
                        return {
                            'type': lineString.charAt(0),
                            'time': lineString.match(/\d\d\d\d-.+T\d\d:\d\d:\d\d/).join() || 'no value found',
                            'text': lineString.match(/".*"/).join().split(/"\s"/)[0] || 'no value found',
                            'legendText': lineString.match(/".*"/).join().split(/"\s"/)[1] || 'no value found',
                            'label': lineString.match(/".*"/).join().split(/" "/)[0] + ' | ' + lineString.match(/".*"/).join().split(/" "/)[1] || 'no value found'
                        }
                    })(currLine))
                }
                break;
            case 'V':
                {
                    eventsArray.V.push((function(lineString) {
                        return {
                            'type': lineString.charAt(0),
                            'start': lineString.match(/\d\d\d\d-.+T\d\d:\d\d:\d\d/).join().split(/\s/)[0] || 'no value found',
                            'end': lineString.match(/\d\d\d\d-.+T\d\d:\d\d:\d\d/).join().split(/\s/)[1] || 'no value found',
                            'text': lineString.match(/".+"/).join() || 'no value found'

                        }
                    })(currLine))
                }
                break;
            case 'E':
                {
                    eventsArray.E.push((function(lineString) {
                        return {
                            'type': lineString.charAt(0) || 'no value found',
                            'time': lineString.match(/\d\d\d\d-.+T\d\d:\d\d:\d\d/).join() || 'no value found',
                            'text': lineString.match(/".+"/).join() || 'no value found'
                        }
                    })(currLine))
                }
                break;
            case 'Q':
                {
                    eventsArray.Q.push((function(lineString) {
                        return {
                            'type': lineString.charAt(0) || 'no value found',
                            'time': lineString.match(/\d\d\d\d-.+T\d\d+:\d\d:\d\d/).join() || 'no value found',
                            'text': lineString.match(/".+"/).join() || 'no value found'
                        }
                    })(currLine))
                }
                break;
        }
    }
    //storing the amount of read events to match input file
    eventsArray.eventsNumber = eventsArray.D.length + eventsArray.E.length + eventsArray.P.length + eventsArray.Q.length + eventsArray.V.length;
    eventsArray.matchesSFOS = (eventsArray.eventsNumber === (sfosIndexes.eofIndex - sfosIndexes.eventsIndex - 1));
    return eventsArray;
}


