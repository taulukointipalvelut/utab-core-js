"use strict";

var mongoose = require('mongoose')
var assert = require('assert')
var ObjectId = mongoose.Types.ObjectId

var RoundInfoSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, default: 'testtournament'},
    total_round_num: {type: Number, default: 4},
    current_round_num: {type: Number, default: 1},
    style: {type: String, default: 'NA'},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var AllocationSchema = new mongoose.Schema({
    r: {type: Number, required: true, unique: true},
    squares: {type: mongoose.Schema.Types.Mixed, required: true}
})

/*

Entitites

 */

var AdjudicatorSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    preev: {type: Number, default: 0},
    name: {type: String, default: ""},
    //institutions: {type: [Number], default: []},
    available: {type: Boolean, default: true},
    institutions: {type: [Number], default: []},
    conflicts: {type: [Number], default: []},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var TeamSchema = new mongoose.Schema({//TESTED//
    id: {type: Number, required: true, unique: true},
    name: {type: String, default: ""},
    //institutions: {type: [Number], default: []},
    available: {type: Boolean, default: true},
    institutions: {type: [Number], default: []},
    debaters_by_r: {type: [mongoose.Schema.Types.Mixed], default: []},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var VenueSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    priority: {type: Number, default: 1},
    available: {type: Number, default: true},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var DebaterSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var InstitutionSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

/*

Results

 */

var RawDebaterResultSchema = new mongoose.Schema({
    id: {type: Number, required: true, index: true},//target to evaluate
    from_id: {type: Number, required: true, index: true},//sender
    r: {type: Number, required: true, index: true},
    weight: {type: Number, default: 1},
    scores: {type: [Number], required: true},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})
RawDebaterResultSchema.index({id: 1, from_id: 1, r: 1}, {unique: true})

var RawTeamResultSchema = new mongoose.Schema({
    id: {type: Number, required: true, index: true},
    from_id: {type: Number, required: true, index: true},
    r: {type: Number, required: true, index: true},
    weight: {type: Number, default: 1},
    win: {type: Number, required: true},
    opponents: {type: [Number], required: true},
    side: {type: String, required: true},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})
RawTeamResultSchema.index({id: 1, from_id: 1, r: 1}, {unique: true})

var RawAdjudicatorResultSchema = new mongoose.Schema({
    id: {type: Number, required: true, index: true},
    from_id: {type: Number, required: true, index: true},
    r: {type: Number, required: true, index: true},
    weight: {type: Number, default: 1},
    score: {type: Number, required: true},
    judged_teams: {type: [Number], required: true},
    comment: {type: String, default: ""},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})
RawAdjudicatorResultSchema.index({id: 1, from_id: 1, r: 1}, {unique: true})

exports.RoundInfoSchema = RoundInfoSchema
exports.AllocationSchema = AllocationSchema
exports.AdjudicatorSchema = AdjudicatorSchema
exports.TeamSchema = TeamSchema
exports.VenueSchema = VenueSchema
exports.DebaterSchema = DebaterSchema
exports.InstitutionSchema = InstitutionSchema
exports.RawDebaterResultSchema = RawDebaterResultSchema
exports.RawTeamResultSchema = RawTeamResultSchema
exports.RawAdjudicatorResultSchema = RawAdjudicatorResultSchema
