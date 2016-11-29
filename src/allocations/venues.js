var sys = require('./sys.js')
var sortings = require('../general/sortings.js')

function get_venue_allocation(allocation, venues, compiled_team_results, round_info, {shuffle: shuffle}) {
    var available_venues = venues.map(v => v.available)
    var sorted_venues = sortings.sort_venues(available_venues)
    var new_allocation = shuffle ? math.shuffle(allocation) : sortings.sort_allocation(compiled_team_results, allocation)

    var i = 0
    for (var square of new_allocation) {
        square.venue = available_venues[i].id
        i += 1
    }
    return math.shuffle(new_allocation, round_info.id)
}

var standard = {
    get: get_venue_allocation
}

exports.standard = standard