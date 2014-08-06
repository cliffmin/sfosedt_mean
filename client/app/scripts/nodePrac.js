// exports.index = function(req, res) {

//     res.json((function() {
//         var myString = "D 10 0 2013-085T23:30:00 2013-086T07:00:00 3 0 14 1024 8 0 0 0 '25 (0085)' 0";
//         myString = myString.split(/\s/);
//         return {
//             start: myString[2],
//             end: myString[3],
//             user: myString[13] + myString[14]
//         }
//     })());

// };

//break into events sections and toss into function


// var myNewArray = [];
// var fs = require('fs');

// function readLines(input, func) {
//   var remaining = '';

//   input.on('data', function(data) {
//     remaining += data;
//     var index = remaining.indexOf('\n');
//     var last  = 0;
//     while (index > -1) {
//       var line = remaining.substring(last, index);
//       last = index + 1;
//       func(line);
//       index = remaining.indexOf('\n', last);
//     }

//     remaining = remaining.substring(last);
//   });

//   input.on('end', function() {
//     if (remaining.length > 0) {
//       func(remaining);
//     }
//   });
// }

// function func(data){
//     console.log(data);
// }

// var input = fs.createReadStream('lib/dc057a.02.sfos');
// readLines(input, func);

'use strict';

var fs = require('fs');




fs.readFile('lib/dc057a.02.sfos', function(err, f) {
    var sfosArray = f.toString().split('\n');
    console.log(eventsParser(sfosArray, sectionIndexes));
});

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

function eventsParser(sfosArray, sectionIndexes) {
    var sfosIndexes = sectionIndexes(sfosArray);
    var eventsArray = {
        'D': [],
        'P': [],
        'V': [],
        'E': [],
        'Q': [],
        'eventsNumber': 0,
        'matchesSFOS': null
    };
    var currLine = "";

    for (var i = sfosIndexes.eventsIndex; i < sfosIndexes.eofIndex; i++) {
        currLine = sfosArray[i];
        switch (currLine.charAt(0)) {
            case 'D':
                {
                    eventsArray.D.push((function(thisArray, length) {
                        return {
                            'type': thisArray[0],
                            'start': thisArray[3],
                            'end': thisArray[4],
                            'text': thisArray[length - 3] + thisArray[length - 2]
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
    return eventsArray;
}

// arrayOfLines = lineString.match(/[^\r\n]+/g);
