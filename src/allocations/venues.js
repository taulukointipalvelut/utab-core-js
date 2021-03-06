"use strict";
var sys = require('./sys.js')
var tools = require('../general/tools.js')
var sortings = require('../general/sortings.js')
var loggers = require('../general/loggers.js')
var checks = require('./venues/checks.js')

function get_venue_draw(r, draw, venues, compiled_team_results, config, shuffle) {
    loggers.silly_logger(get_venue_draw, arguments, 'draws', __filename)
    let allocation = draw.allocation
    var available_venues = tools.filter_available(venues, r)
    var sorted_venues = sortings.sort_venues(r, available_venues)
    var new_allocation = shuffle ? math.shuffle(allocation, config.name) : sortings.sort_allocation(allocation, compiled_team_results)

    var i = 0

    for (var square of new_allocation) {
        square.venue = available_venues[i].id
        i += 1
        if (i === venues.length - 1) {
            break
        }
    }

    let new_draw = {
        r: draw.r,
        allocation: new_allocation.sort((s1, s2) => s1.venue < s2.venue)
    }
    return new_draw
}

var standard = {
    get: get_venue_draw
}

var precheck = checks.venue_allocation_precheck

exports.standard = standard
exports.precheck = precheck
