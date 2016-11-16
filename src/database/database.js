"use strict";
var mongoose = require('mongoose')
var schemas = require('./schemas.js')
//var asyncwrapper = require('./async/asyncwrapper.js')
//var async = require('async')
//var _ = require('underscore/underscore.js')
//var tools = require('./tools/tools.js')
//var keys = require('./tools/keys.js')
mongoose.Promise = global.Promise

class DBHandler {
    constructor(url) {
        var conn = mongoose.createConnection('mongodb://localhost/test'+url.toString())
        conn.on('error', console.error.bind(console, 'connection error:'))
        conn.once('open', function() {
            console.log('database connected')
        })

        var Team = conn.model('Team', schemas.TeamSchema)
        var Adjudicator = conn.model('Adjudicator', schemas.AdjudicatorSchema)
        var Venue = conn.model('Venue', schemas.VenueSchema)
        var Debater = conn.model('Debater', schemas.DebaterSchema)
        var Institution = conn.model('Institution', schemas.InstitutionSchema)
        var RawTeamResult = conn.model('RawTeamResult', schemas.RawTeamResultSchema)
        var RawDebaterResult = conn.model('RawDebaterResult', schemas.RawDebaterResultSchema)
        var RawAdjudicatorResult = conn.model('RawAdjudicatorResult', schemas.RawAdjudicatorResultSchema)

        this.teams = new CollectionHandler(Team)
        this.adjudicators = new CollectionHandler(Adjudicator)
        this.venues = new CollectionHandler(Venue)
        this.debaters = new CollectionHandler(Debater)
        this.institutions = new CollectionHandler(Institution)
        this.raw_team_results = new CollectionHandler(RawTeamResult)
        this.raw_debater_results = new CollectionHandler(RawDebaterResult)
        this.raw_adjudicator_results = new CollectionHandler(RawAdjudicatorResult)
    }
}

class CollectionHandler {
    constructor(Model) {
        this.Model = Model
    }
    read(callback) {
        return this.Model.find(callback)
    }
    create(dict, callback) {
        var M = this.Model
        return this.find({id: dict.id}, function (err, docs) {
            if (docs.length !== 0) {
                throw new Error('AlreadyExists')
            } else {
                var model = new M(dict)
                model.save(callback)
            }
        })
    }
    update(dict, new_dict, callback) {
        var M = this.Model
        return this.find({id: dict.id}, function (err, docs) {
            if (docs.length === 0) {
                throw new Error('DoesNotExist')
            } else {
                M.findOneAndUpdate({id: dict.id}, {$set: new_dict}, callback)
            }
        })
    }
    delete(dict, callback) {
        var M = this.Model
        return this.find({id: dict.id}, function (err, docs) {
            if (docs.length === 0) {
                throw new Error('DoesNotExist')
            } else {
                M.findOneAndRemove(dict, callback)
            }
        })
    }
    find(dict, callback) {
        return this.Model.find(dict, callback)
    }
}

exports.DBHandler = DBHandler
/*
var db = new DB(4, "test")
console.log(db.team_to_debaters.get()[0])
console.log(db.team_to_debaters.get()[0].get())
*/
/*
var dbh = new DBHandler("test201611151")
console.log(dbh.teams.get())
console.log(dbh.teams.add({id: 3}))
console.log(dbh.teams.get({id: 3}))
setTimeout(()=>console.log(dbh.teams.get()), 3000)
*/


var dbh = new DBHandler("test201611155")

//dbh.teams.create({id: 6}, (e, d) => console.log(e, d))
dbh.teams.read((e, ds) => console.log(ds))
//dbh.teams.read((e, ds) => ds).then(v => console.log(v))
//dbh.teams.delete({id: 5}, (e, d) => console.log(e, d))
//dbh.teams.find({id: 5}).then(vs => console.log(vs))
//dbh.teams.update({id: 3}, {id: 5, institutions: [3, 4]}, (e, d) => console.log(d))
//dbh.teams.read((e, ds) => console.log(ds))
/*
async function test() {
    //let team = await dbh.teams.add({id: 3})
    let teams = await dbh.teams.get()
    console.log(teams, "teams")
    //console.log(team)
    //return [teams, team]
}
test()
*/

/*
async function test2() {
    let teams = await test()
    console.log(teams, "hi")
}

test()
test2()
*/
