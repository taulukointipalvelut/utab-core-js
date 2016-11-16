var mongoose = require('mongoose')
var assert = require('assert')
var ObjectId = mongoose.Types.ObjectId

var AdjudicatorSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    institutions: {type: [Number], default: []},
    available: {type: Boolean, default: true},
    conflicts: {type: [Number], default: []},
    url: {type: String, default: ""}
})

var TeamSchema = new mongoose.Schema({//TESTED//
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    institutions: {type: [Number], default: []},
    //debaters_by_r: {type: [{r: Number, debaters: []}], default: []},
    //debaters_by_r: {1: [0, 3], 2: [3, 4]}
    debaters_by_r: {type: {Number: [Number]}, default: {}},
    available: {type: Boolean, default: true},
    url: {type: String, default: ""}
})

TeamSchema.methods.read_debaters = function (dict) {//TESTED//
    if (!this.debaters_by_r.hasOwnProperty(dict.r)) {
        throw new Error('DoesNotExist')
    } else {
        return this.debaters_by_r[dict.r]
    }
}
/*
TeamSchema.methods.create_debaters = function (dict) {
    if (this.debaters_by_r.hasOwnProperty(dict.r)) {
        throw new Error('AlreadyExists')
    } else {
        return this.debaters_by_r[dict.r]
    }
}*/

/*
TeamSchema.methods.update_debaters = function (dict) {
    if (!this.debaters_by_r.hasOwnProperty(dict.r)) {
        throw new Error('DoesNotExist')
    } else {

        return this.model('Team').update({id: dict.id}, {id: 4})
        //, {$set: {debaters_by_r: {dict.r: dict.debaters}}}
        this.url = "lkdsajf;lkadjs"
        console.log("update",this.debaters_by_r)
        this.debaters_by_r[dict.r] = dict.debaters
        console.log("updated", this.debaters_by_r)


    }
}
*/

//

var VenueSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    priority: {type: Number, default: 1},
    available: {type: Number, default: true},
    url: {type: String, default: ""}
})

var InstitutionSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    url: {type: String, default: ""}
})

var DebaterSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    url: {type: String, default: ""}
})

var RawDebaterResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {type: Number, required: true},
    r: {type: Number, required: true},
    scores: {type: [Number], required: true}
})

var RawTeamResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {type: Number, required: true},
    r: {type: Number, required: true},
    win: {type: Number, required: true},
    opponents: {type: Number, required: true},
    side: {type: Number, required: true},
    margin: {type: [Number], required: true}
})

var RawAdjudicatorResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {type: Number, required: true},
    r: {type: Number, required: true},
    score: {type: [Number], required: true},
    watched_teams: {type: [Number], required: true},
    comment: {type: String, default: ""}
})

/*
var NameSchema = mongoose.Schema({
    uid: {type: Number, required: true},
    name: {type: String, required: true}
})
*/

var TournamentSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //name: {type: String, default: ""},
    //uid: {type: Number, default: parseInt(new ObjectId, 16)},
    total_round_num: {type: Number, default: 1},
    current_round_num: {type: Number, default: 1}
})

/*
var Test2Schema = new mongoose.Schema({
    id: Number//,
    //uid: {type: String, default: parseInt(new ObjectId, 16)}
})
exports.Test2Schema = Test2Schema
*/

AdjudicatorSchema.methods.uid = function() {
    return parseInt(this._id, 16)
}

TeamSchema.methods.uid = function() {
    return parseInt(this._id, 16)
}

VenueSchema.methods.uid = function() {
    return parseInt(this._id, 16)
}

DebaterSchema.methods.uid = function() {
    return parseInt(this._id, 16)
}

InstitutionSchema.methods.uid = function() {
    return parseInt(this._id, 16)
}

RawTeamResultSchema.methods.uid = function() {
    return parseInt(this._id, 16)
}

RawDebaterResultSchema.methods.uid = function() {
    return parseInt(this._id, 16)
}

RawAdjudicatorResultSchema.methods.uid = function() {
    return parseInt(this._id, 16)
}

exports.AdjudicatorSchema = AdjudicatorSchema
exports.TeamSchema = TeamSchema
exports.VenueSchema = VenueSchema
exports.DebaterSchema = DebaterSchema
exports.InstitutionSchema = InstitutionSchema
exports.RawDebaterResultSchema = RawDebaterResultSchema
exports.RawTeamResultSchema = RawTeamResultSchema
exports.RawAdjudicatorResultSchema = RawAdjudicatorResultSchema
exports.TournamentSchema = TournamentSchema


//tests

//var Adjudicator = mongoose.model('Adjudicator', AdjudicatorSchema);
