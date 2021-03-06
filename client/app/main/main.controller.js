'use strict';

//dcastill jpl, star modules documentation

angular.module('fullstackApp')
    .controller('MainCtrl', function($scope, $http) {
        $scope.awesomeThings = [];

        $scope.main = function main() {
            $.getJSON('api/data').done(function(d) {
                var sfosData = d.jsonData;
                var startTime = utc(sfosData.header.startTime);
                var stopTime = utc(sfosData.header.stopTime);
                console.log(d);
                document.getElementById('fileName').innerHTML = 'MISSION NAME: ' + sfosData.header.missionName;
                document.getElementById('fileTime').innerHTML = startTime + ' - ' + stopTime;
                document.getElementById('verify').innerHTML = function() { //for verification
                    if (sfosData.events.matchesSFOS) {
                        return '<br> Build is passing! All events are shown.'
                    } else
                        return '<br> Build has failed! sfos events # is ' + sfosData.events.sfosEventsNumber + ' which doesn\'t match the number of parsed events(' + sfosData.events.eventsNumber + ')'
                }();
                var chartSpec = {
                    element: document.getElementById('chart'),
                    data: {
                        dsnEvents: sfosData.events.D,
                        qEvents: sfosData.events.Q,
                        parameterEvents: sfosData.events.P,
                    },
                    rows: [{
                        title: 'Spacecraft States',
                        layers: [{
                            type: 'symbol',
                            color: 'blue',
                            shape: 'diamond',
                            from: 'parameterEvents',
                            mappings: function(d) {
                                return {
                                    x: utc(d.time),
                                    y: 'temp',
                                    text: d.label
                                }
                            },
                            adjustments: function(item) {
                                var size = Math.min(18, item.size);
                                return {
                                    y: item.y + size * 0.05,
                                    size: size * 0.9
                                };
                            }
                        }, {
                            type: 'label',
                            from: 'parameterEvents',
                            mappings: function(d) {
                                return {
                                    x: utc(d.time),
                                    y: d.state,
                                    text: d.text,
                                    fill: d.color
                                }
                            },
                            adjustments: function(item) {
                                var size = Math.min(18, item.size);
                                return {
                                    y: item.y + size * 0.05,
                                    size: size * 0.9
                                };
                            }
                        }]
                    }, {
                        title: 'TLM Output Modes',
                        layers: [{
                            type: 'rect',
                            color: 'blue',
                            from: 'qEvents',
                            mappings: function(d) {
                                return {
                                    x: utc(d.time),
                                    y: d.y,
                                }
                            },
                            adjustments: function(item) {
                                var size = Math.min(18, item.size);
                                return {
                                    y: item.y + size * 0.05,
                                    size: size * 0.9
                                };
                            }
                        }, {
                            type: 'label',
                            from: 'qEvents',
                            mappings: function(d) {
                                return {
                                    x: utc(d.time),
                                    y: d.y,
                                    text: d.text,
                                }
                            },
                            adjustments: function(item) {
                                var size = Math.min(18, item.size);
                                return {
                                    y: item.y + size * 0.05,
                                    size: size * 0.9
                                };
                            }
                        }]
                    }, {
                        title: 'DSN Coverage',
                        layers: [{
                            type: 'label',
                            from: 'dsnEvents',
                            mappings: function(d) {
                                return {
                                    y: d.ant,
                                    text: d.text,
                                }
                            },
                            adjustments: function(item) {
                                var size = Math.min(18, item.size);
                                return {
                                    y: item.y + size * 0.05,
                                    size: size * 0.9
                                };
                            }
                        }, {
                            type: 'rect',
                            from: 'dsnEvents',
                            mappings: function(d) {
                                return {
                                    x: utc(d.start),
                                    x2: utc(d.end),
                                    y: d.ant,
                                    text: d.text,
                                    fill: (function() {
                                        switch (d.ant) {
                                            case 'goldstone':
                                                return '#99CCFF'
                                                break;
                                            case 'canberra':
                                                return '#FF9147'
                                                break;
                                            case 'madrid':
                                                return '#FFFF99'
                                                break;
                                        }
                                    })(d)
                                }
                            }
                        }, {
                            type: 'label',
                            from: 'dsnEvents',
                            anchor: 'right',
                            fill: 'none',
                            maxItems: 50,
                            mappings: function(d) {
                                return {
                                    text: d3.time.format.utc('%H:%M')(utc(d.start)),
                                    x: utc(d.start),
                                    y: d.ant
                                };
                            },
                            adjustments: function(d) {
                                return {
                                    // Slightly shrink the start/end times relative to the main labels
                                    size: d.size * 0.4,
                                };
                            }
                        }, {
                            type: 'label',
                            from: 'dsnEvents',
                            anchor: 'left',
                            fill: 'none',
                            maxItems: 50,
                            mappings: function(d) {
                                return {
                                    text: d3.time.format.utc('%H:%M')(utc(d.end)),
                                    x: utc(d.end),
                                    y: d.ant
                                };
                            },
                            adjustments: function(d) {
                                return {
                                    // Slightly shrink the start/end times relative to the main labels
                                    size: d.size * 0.4,
                                };
                            }
                        }]
                    }]
                }
                var chart = new Timely.Chart(chartSpec);
                var $win = $(window);

                function redraw() {
                    chart.setWidth($win.width() - 50)
                        .setHeight($win.height() - 250)
                        .draw();
                }

                $win.resize(redraw);

                redraw();
            });
        }



        function row(category, label) {
            return {
                scales: {
                    y: {
                        padding: 0.3
                    }
                },
                mappings: function(d) {
                    return {
                        x: startOfTracking(d),
                        x2: endOfTracking(d),
                        y: d[category],
                        fill: d[label],
                        stroke: d[label],
                        text: d[label]
                    };
                },
                layers: [{
                    type: 'rect',
                    stroke: 'white',
                    mappings: function(d) {
                        return {
                            x: utc(d.start),
                            x2: utc(d.end)
                        };
                    }
                }, {
                    type: 'whisker'
                }, { // main labels
                    type: 'label',
                    stroke: 'black'

                }, ]
            };
        }

        function timeLabel(time, anchor) {
            return {
                type: 'label',
                anchor: anchor,
                fill: 'none',
                maxItems: 50,
                mappings: function(d) {
                    return {
                        text: d3.time.format.utc('%H:%M')(utc(time)),
                        x: utc(time)
                    };
                },
                adjustments: function(d) {
                    return {
                        // Slightly shrink the start/end times relative to the main labels
                        size: d.size * 0.8,
                    };
                }
            };
        }

        function startOfTracking(d) {
            return offsetMinutes(utc(d.start), d.su);
        }

        function endOfTracking(d) {
            return offsetMinutes(utc(d.end), -d.td);
        }

        var utc = (function() {
            var parser = d3.time.format.utc('%Y-%jT%H:%M:%S');
            console.log(parser);
            return function(d) {
                return parser.parse(d);
            };
        })();

        function offsetMinutes(date, minutes) {
            return new Date(date.getTime() + minutes * 60 * 1000)
        }

    });
