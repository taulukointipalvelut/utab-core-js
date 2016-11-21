"use strict"
var sys = require('../sys.js')
var math = require('../math.js')

function error_available(square, venues) {
    var errors = []
    if (!venues.filter(v => v.id === square.venue)[0].available) {
        errors.push('ERROR: unavaiable venue appears in the square')
    }
    return errors
}

function checks (allocation, venues) {//FOR NA
    var new_allocation = sys.allocation_deepcopy(allocation)
    for (var square of new_allocation) {
        var functions = [error_available]
        for (var func of functions) {
            square.warnings = square.warnings.concat(func(square, venues))
        }
    }
    return new_allocation
}

exports.checks = checks

//console.log(checks([{venue: 1}], [{id: 1, available: false}]))
