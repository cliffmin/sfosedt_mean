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
'use strict';

var myString = "D 10 0 2013-085T23:30:00 2013-086T07:00:00 3 0 14 1024 8 0 0 0 '25 (0085)' 0 D 10 0 2013-085T06:00:00 2013-085T10:50:00 3 0 112 1024 8 0 0 0 '45 (0085)' 0 D 10 0 2013-085T17:35:00 2013-085T23:40:00 3 0 210 1024 8 0 0 0 '55 (0085)' 0";

// myString = myString.split(/\s/);
// myArray = [];
// myString = myString.slice(0, 12);
// myArray.push((function(myString) {
//     return {
//         'type': myString[0],
//         'start': myString[3],
//         'end': myString[4]
//     }
// })(myString));
// console.log(myArray);
var myArray = [];



function eventsParser(myString) {
    var myString = myString.split(/\s/);
    for (var i = 0; i < myString.length; i++) {
        if (myString[i] === 'D') {
            myArray.push((function(thisArray) {
                    return {
                        'type': thisArray[0],
                        'start': thisArray[3],
                        'end': thisArray[4]
                    }
                })(myString.slice(i, i + 11)))
            }
        }
    }
    eventsParser(myString);
console.log(myArray)