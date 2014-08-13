/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

//eventually place methods into the Sfosjson prototype

var fs = require('fs');

//our exposed constructor
exports.Sfosjson = function Sfosjson(pathFile) {
    //can make an sfos object here
    this.data = sfosParser(pathFile)
}

//helper function that gets section indexes for the sfos array
function getSectionIndexes(array) {
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


//returns sfos object
function sfosParser(sfosPathFile) {
    var sfosArray = fs.readFileSync(sfosPathFile).toString().split('\n');

    var sfosIndexes = getSectionIndexes(sfosArray);
    var headerProperties = (function(startIndex, endIndex) {
        var headerString = '';
        for (var j = startIndex; j < endIndex; j++) {
            headerString += (sfosArray[j] + ' \n ');
        }
        return headerString;
    })(0, sfosIndexes.historyIndex);
    var eventsArray = { //init empty arrays to push onto
        'D': [],
        'P': [],
        'V': [],
        'E': [],
        'Q': [],
        'eventsNumber': 0, //set initially 0 for read events
        'matchesSFOS': false //set initially false
    };
    var currLine = ''; //set initially to an empty string
    for (var i = sfosIndexes.eventsIndex; i < sfosIndexes.eofIndex; i++) { //build events
        currLine = sfosArray[i];
        switch (currLine.charAt(0)) { //read line type at the beginning of line
            case 'D':
                {
                    eventsArray.D.push((function(lineString) {
                        return {
                            'type': currLine.charAt(0),
                            'start': lineString.match(/\d\d\d\d-.+T\d\d:\d\d:\d\d/).join().split(/\s/)[0] || 'no value found',
                            'end': lineString.match(/\d\d\d\d-.+T\d\d:\d\d:\d\d/).join().split(/\s/)[1] || 'no value found',
                            'ant': function(lineString) {
                                switch (lineString.match(/".*"/).join().charAt(1)) {
                                    case '1':
                                    case '2':
                                        return 'goldstone'
                                        break;
                                    case '3':
                                    case '4':
                                        return 'madrid'
                                        break;
                                    case '5':
                                    case '6':
                                        return 'canberra'
                                        break;
                                }
                            }(lineString),
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
                            'ant': function(lineString) {
                                switch (lineString.match(/".*"/).join().charAt(1)) {
                                    case '1':
                                        return 'goldstone'
                                        break;
                                    case '4':
                                        return 'madrid'
                                        break;
                                    case '6':
                                        return 'canberra'
                                        break;
                                }
                            }(lineString),
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
    return {
        header: headerProperties,
        events: eventsArray
    }
}
