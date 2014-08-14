'use strict';

//split into each row, with their respective layers and mappings. Where does d var
//come from?

function main() {
    $.getJSON('api/data').done(function(d) {
        var sfosData = d.data;
        console.log(sfosData);
        // document.getElementById('time').innerHTML = events.SETUP['TIME'];
        var chartSpec = {
            element: document.getElementById('chart'),
            data: {
                parameterEvents: sfosData.events.P,
                dsnEvents: sfosData.events.D,
            },
            rows: [{
                title: 'DSN Coverage',
                mappings: function(d) {
                    return {
                        x: utc(d.start),
                        x2: utc(d.end)
                    };
                },
                layers: [{
                    type: 'rect',
                    from: 'dsnEvents',
                    mappings: function(d) {
                        return {
                            x: utc(d.start),
                            x2: utc(d.end),
                            text: d.text,
                            y: d.ant,
                            fill: d.color
                        }
                    }
                }, {
                    type: 'label',
                    from: 'dsnEvents',
                    mappings: function(d) {
                        return {
                            x: utc(d.start),
                            x2: utc(d.end),
                            y: d.ant,
                            text: d.user,
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
                .setHeight($win.height() - 170)
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

