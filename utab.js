"use strict";
/**
* @module utab
* @author taulukointipalvelut@gmail.com (nswa17)
* @file Interfaces for UTab core. Github Page is [here]{@link https://github.com/taulukointipalvelut/utab-core}.
* @version 2.1
* @example
* var utab = require('./utab.js')
*
* var t1 = new utab.Tournament({name: 't1', style: 'NA'})//create a tournament named 't1'
* t1.teams.read().then(console.log)//show all teams
*
* t1.close()//close connection to t1 database
*/

const loggers = require('./src/general/loggers.js')//Must be the first to require
loggers.init()
const alloc = require('./src/allocations.js')
const res = require('./src/results.js')
const controllers = require('./src/controllers.js')
const _ = require('underscore/underscore.js')

function values (obj) {
    return Object.keys(obj).map(key => obj[key])
}

function convert_draw (draw) {
    let new_draw = {
        r: draw.r,
        allocation: []
    }
    for (let square of draw.allocation) {
        let new_square = Object.assign({}, square)
        delete new_square.teams
        if (square.teams.length === 2) {
            new_square.teams = {
                og: square.teams[0],
                oo: square.teams[1]
            }
        } else {
            new_square.teams = {
                og: square.teams[0],
                oo: square.teams[1],
                cg: square.teams[2],
                co: square.teams[3]
            }
        }
        new_draw.allocation.push(new_square)
    }
    return new_draw
}

function reconvert_draw (draw) {
    let new_draw = {
        r: draw.r,
        allocation: []
    }
    for (let square of draw.allocation) {
        let new_square = Object.assign({}, square)
        delete new_square.teams
        new_square.teams = values(square.teams)
        new_draw.allocation.push(new_square)
    }
    return new_draw
}
/**
* Represents a pair/set of teams in a venue. A minimum unit to be an allocation.
* @typedef Square
* @property {Number} id id of the Square
* @property {Number[]} teams teams in the Square
* @property {Number[]} chairs chairs in the Square
* @property {Number[]} panels adjudicators(panels) in the Square
* @property {Number[]} trainees adjudicators(trainees) in the Square
* @property {String[]} warnings warnings
* @property {Number} venue
*/

/**
* Represents a team.
* @typedef Team
* @property {Number} id id of the Team
* @property {String} name name of the Team
* @property {Boolean} available available
* @property {Object} user_defined_data user defined data
*/

/**
* Represents an adjudicator.
* @typedef Adjudicator
* @property {Number} id id of the Adjudicator
* @property {Number} preev pre evaluation(judge test) of the Adjudicator
* @property {String} name name of the Adjudicator
* @property {Boolean} available available
* @property {Object} user_defined_data user defined data
*/

/**
* Represents a venue.
* @typedef Venue
* @property {Number} id id of the Venue
* @property {Number} priority priority of the Venue
* @property {String} name name of the Venue
* @property {Boolean} available available
* @property {Object} user_defined_data user defined data
*/

/**
* Represents an institution.
* @typedef Institution
* @property {Number} id id of the Institution
* @property {String} name name of the Institution
* @property {Boolean} available available
* @property {Object} user_defined_data user defined data
*/

/**
* Represents raw team result.
* @typedef RawTeamResult
* @property {Number} id id of the team to evaluate
* @property {Number} from_id id of the sender
* @property {Number} r round number at which the result is sent
* @property {Number} win in NA it's either 1(win) or 0(lose), in BP it's the win-points
* @property {Number[]} opponents opponents of the team
* @property {String} side side of the team
* @property {Object} user_defined_data user defined data
* @example
* {
*   id: 1,
*   from_id: 2,
*   r: 1,
*   win: 1,
*   opponents: [2],
*   side: "gov"
* }
*/

/**
* Represents raw speaker result.
* @typedef RawSpeakerResult
* @property {Number} id id of the speaker to evaluate
* @property {Number} from_id id of the sender
* @property {Number} r round number at which the result is sent
* @property {Number[]} scores scores the sender writes
* @property {Object} user_defined_data user defined data
* @example
* {
*   id: 1,
*   from_id: 2,
*   r: 1,
*   scores: [75, 0, 36.5]
* }
*/

/**
* Represents raw adjudicator result.
* @typedef RawAdjudicatorResult
* @property {Number} id id of the adjudicator to evaluate
* @property {Number} from_id id of the sender
* @property {Number} r round number at which the result is sent
* @property {Number} score the score of the adjudicator the sender writes
* @property {Number[]} judged_teams teams the adjudicator watched
* @property {String} comment the comment for the adjudicator from the sender
* @property {Object} user_defined_data user defined data
*/

/**
* Represents debate style.
* @typedef Style
* @property {String} name style name
* @property {Number} speaker_num_per_team number of speakers per team
* @property {Number} team_num number of team in a [Square]{@link Square}
* @property {Number[]} score_weights weights of the scores
* @property {Number} replies candidates of replies (Necessary only for testing)
* @property {Number} reply_num number of replies in a [Square]{@link Square} (Necessary only for testing)
* @example
* {
* name: "ASIAN",
*  speaker_num_per_team: 3,
*  team_num: 2,
*  score_weights: [1, 1, 1, 0.5],
*  replies: [0, 1],
*  reply_num: 1
* }
*/

/**
* Represents a tournament.
* @typedef TournamentInformation
* @property {String} name name of the tournament
* @property {Style} style style of the tournament
*/


/**
* A class to operate a tournament.
*/
class TournamentHandler {
    /**
    * @param {Object} [options] necessary for new tournament. if the tournament already exists, it's just ignored
    * @param {String} db_url database url
    * @param {String} [options.id=0] tournament id
    * @param {String} [options.name='testtournament'] tournament name
    * @param {Style} [options.style='NA'] debate style
    * @param {Number} [options.user_defined_data={}] user defined data
    */
    constructor (db_url, {
            id: id=0,
            name: name,
            style: style,
            user_defined_data: user_defined_data={}
        }={}) {
        loggers.results('constructor of TournamentHandler is called')
        loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))

        var con = new controllers.CON(db_url, {
            id: id,
            name: name,
            style: style,
            user_defined_data: user_defined_data
        })
        var utab = this

        /**
        * Provides Interfaces related to teams
        * @memberof Tournament
        * @namespace Tournament.teams
        */
        this.teams = con.teams
        /**
        * returns all teams(No side effect)
        * @name Tournament.teams.read
        * @memberof! Tournament.teams
        * @function Tournament.teams.read
        * @return {Promise.<Team[]>} Teams
        */

        /**
        * creates team.//TESTED//
        * Attention: It throws an error if the specified team already exists.
        * @name Tournament.teams.create
        * @memberof! Tournament.teams
        * @function Tournament.teams.create
        * @param team
        * @param {Number} team.id id of the team to create
        * @param {Number} [team.name=""] name of the team to create
        * @param {Number} [team.available=true] id of the team to create
        * @return {Promise.<Team>} Created team
        * @throws {Promise} AlreadyExists
        */
        /**
        * deletes specified team.//TESTED//
        * Attention: It throws an error if the specified team does not exist.
        * @name Tournament.teams.delete
        * @memberof! Tournament.teams
        * @function Tournament.teams.delete
        * @param team
        * @param {Number} team.id id of the team to delete
        * @return {Promise.<Team>} Deleted team
        * @throws {Promise} DoesNotExist
        */
        /**
        * finds on specified condition(No side effect)//TESTED//
        * @name Tournament.teams.find
        * @memberof! Tournament.teams
        * @function Tournament.teams.find
        * @param team
        * @param {Number} [team.id] id of the team to find
        * @param {Number} [team.name] name of the team to find
        * @param {Number} [team.available] id of the team to find
        * @return {Promise.<Team[]>} Teams
        */
        /**
        * updates specified team//TESTED//
        * Attention: It throws an error if the specified team does not exist.
        * @name Tournament.teams.update
        * @memberof! Tournament.teams
        * @function Tournament.teams.update
        * @param team
        * @param {Number} team.id id of the team to update
        * @param {Number} [team.name=""] name of the team to update
        * @param {Number} [team.available=true] id of the team to update
        * @return {Promise.<Team>} Updated team
        * @throws DoesNotExist
        */
        /**
        * checks whether specified team exists
        * @name Tournament.teams.update
        * @memberof! Tournament.teams
        * @function Tournament.teams.update
        * @param team
        * @param {Number} [team.id] id of the team to update
        * @param {Number} [team.name] name of the team to update
        * @param {Number} [team.available] id of the team to update
        * @return {Promise.<Boolean>}
        * @throws DoesNotExist
        */
        /**
        * @namespace Tournament.teams.results
        * @memberof Tournament.teams
        */
        /**
        * reads all raw team results(No side effect)
        * @name Tournament.teams.results.read
        * @memberof! Tournament.teams.results
        * @function Tournament.teams.results.read
        * @returns {Promise.<RawTeamResult[]>}
        */
        /**
        * Summarizes team results(No side effect)
        * @alias Tournament.teams.results.organize
        * @memberof! Tournament.teams.results
        * @param  {Number[]} rs round numbers used to summarize results.
        * @param options [options] for summarization
        * @param {Boolean} [options.simple=false] only use team results. No speaker results is considered thus unable to output team points
        * @param {Boolean} [options.force=false] if true, it does not check raw results(not recommended)
        * @return {Promise} summarized team results
        */
        this.teams.results.organize = function(rs, {simple: simple=false, force: force=false}={}) {
            loggers.results('teams.results.organize is called')
            loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
            return Promise.all([con.teams.read(), con.speakers.read(), con.teams.results.read(), con.speakers.results.read(), con.config.read()]).then(function (vs) {
                var [teams, speakers, raw_team_results, raw_speaker_results, config] = vs

                var team_num = config.style.team_num
                if (!force) {
                    if (!simple) {
                        rs.map(r => res.precheck(teams, speakers, r))
                        rs.map(r => res.speakers.precheck(raw_speaker_results, speakers, r, team_num))
                    }
                    rs.map(r => res.teams.precheck(raw_team_results, teams, r, team_num))
                }
                if (simple) {
                    return res.teams.simple_compile(teams, raw_team_results, rs, config.style)
                } else {
                    return res.teams.compile(teams, speakers, raw_team_results, raw_speaker_results, rs, config.style)
                }
            })
        }

        /**
        * Interfaces related to teams to speakers
        * @namespace Tournament.teams.speakers
        * @memberof Tournament.teams
        */
        /**
        * returns teams to speakers(No side effect)
        * @name Tournament.teams.speakers.read
        * @memberof! Tournament.teams.speakers
        * @function Tournament.teams.speakers.read
        * @return {Promise} Teams to speakers
        */
        /**
        * sets speakers to a team.
        * Attention: It throws an error if the specified team has speakers.
        * @name Tournament.teams.speakers.create
        * @memberof! Tournament.teams.speakers
        * @function Tournament.teams.speakers.create
        * @param dict
        * @param {Number} dict.id id of the team to set speakers
        * @param {Number[]} dict.speakers speakers to set
        * @param {Number} dict.r round where the team has the speakers
        * @return {Promise} Created team
        * @throws {Promise} AlreadyExists
        */
        /**
        * deletes speakers from specified team.
        * Attention: It throws an error if the specified team does not exist.
        * @deprecated
        * @name Tournament.teams.speakers.delete
        * @memberof! Tournament.teams.speakers
        * @function Tournament.teams.speakers.delete
        * @param options
        * @param {Number} options.id id of the team to delete
        * @param {Number} options.r round where the team has the speakers
        * @return {Promise} Team
        * @throws {Promise} DoesNotExist
        */
        /**
        * finds on specified condition(No side effect)
        * @name Tournament.teams.speakers.find
        * @memberof! Tournament.teams.speakers
        * @function Tournament.teams.speakers.find
        * @param options
        * @param {Number} [options.id] id of the team to delete
        * @param {Number} [options.r] round where the team has the speakers
        * @param {Number[]} [options.speakers] speakers
        * @return {Promise} Teams
        */
        /**
        * updates speakers of specified team
        * Attention: It throws an error if the specified team does not exist.
        * @name Tournament.teams.speakers.update
        * @memberof! Tournament.teams.speakers
        * @function Tournament.teams.speakers.update
        * @param options
        * @param {Number} options.id id of the team
        * @param {Number} options.r round where the team has the speakers
        * @param {Number[]} options.speakers speakers of the team
        * @return {Promi} Team
        * @throws DoesNotExist
        */

        /**
        * Provides interefaces related to teams to institutions
        */

        /**
        * Provides interfaces related to adjudicators
        * @namespace Tournament.adjudicators
        * @memberof Tournament
        */
        this.adjudicators = con.adjudicators
        /**
        * @namespace Tournament.adjudicators.results
        * @memberof Tournament.adjudicators
        */
        /**
        * Summarizes adjudicator results(No side effect)
        * @alias Tournament.adjudicators.results.organize
        * @memberof! Tournament.adjudicators.results
        * @param  {Number[]} rs round number(s) used to summarize results
        * @param [options]
        * @param {Boolean} [options.force=false] if true, it does not check raw results(not recommended)
        * @return {Promise} summarized adjudicator results
        */
        this.adjudicators.results.organize = function(rs, {force: force=false}={}) {
            loggers.results('adjudicators.results.organize is called')
            loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
            return Promise.all([con.adjudicators.read(), con.adjudicators.results.read(), con.config.read()]).then(function(vs) {
                var [adjudicators, raw_adjudicator_results, config] = vs

                var team_num = config.style.team_num
                if (!force) {
                     rs.map(r => res.adjudicators.precheck(raw_adjudicator_results, adjudicators, r, team_num))
                }
                return res.adjudicators.compile(adjudicators, raw_adjudicator_results, rs)
            })
        }
        this.rounds = con.rounds
        /**
        * Interfaces related to tournament operation
        * @namespace Tournament.config
        * @memberof Tournament
        */
        this.config = con.config
        /**
        * Interfaces related to venues
        * @namespace Tournament.venues
        * @memberof Tournament
        */
        this.venues = con.venues
        /**
        * Interfaces related to speakers
        * @namespace Tournament.speakers
        * @memberof Tournament
        */
        this.speakers = con.speakers
        /**
        * Interfaces related to speaker results
        * @namespace Tournament.speakers.results
        * @memberof Tournament.speakers
        */
        /**
        * Summarizes speaker results(No side effect)
        * @alias Tournament.speakers.results.organize
        * @memberof! Tournament.speakers.results
        * @param  {Number[]} rs round number(s) used to summarize results
        * @param [options]
        * @param {Boolean} [options.force=false] if true, it does not check raw results(not recommended)
        * @return {Promise} summarized speaker results
        */
        this.speakers.results.organize = function(rs, {force: force=false}={}) {
            loggers.results('speakers.results.organize is called')
            loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
            return Promise.all([con.speakers.read(), con.speakers.results.read(), con.config.read()]).then(function(vs) {
                var [speakers, raw_speaker_results, config] = vs

                var team_num = config.style.team_num
                if (!force) {
                    rs.map(r => res.speakers.precheck(raw_speaker_results, speakers, r, team_num))
                }
                return res.speakers.compile(speakers, raw_speaker_results, config.style, rs)
            })
        }

        /*/**
        * checks speaker results are all gathered
        * @alias Tournament.speakers.results.check
        * @memberof! Tournament.speakers.results
        * @throws error
        */
        //this.speakers.results.check = checks.speakers.check
        /**
        * Interfaces related to institutions
        * @namespace Tournament.institutions
        * @memberof Tournament
        */
        this.institutions = con.institutions

        /**
        * Provides interfaces related to draws
        * @namespace Tournament.draws
        * @memberof Tournament
        */
        this.draws = con.draws
        this.draws.get = function(_for, {options: options={}}={}) {
            return Promise.all([con.config.read()])
                .then(function(vs) {
                    var [config] = vs

                    var options_for_team_allocation = _.clone(options)
                    var options_for_adjudicator_allocation = _.clone(options)
                    var options_for_venue_allocation = _.clone(options)
                    if (options.hasOwnProperty('team_allocation_algorithm')) {
                        options_for_team_allocation.algorithm = options.team_allocation_algorithm
                    }
                    if (options.hasOwnProperty('team_allocation_algorithm_options')) {
                        options_for_team_allocation.algorithm_options = options.team_allocation_algorithm_options
                    }
                    if (options.hasOwnProperty('adjudicator_allocation_algorithm')) {
                        options_for_adjudicator_allocation.algorithm = options.adjudicator_allocation_algorithm
                    }
                    if (options.hasOwnProperty('adjudicator_allocation_algorithm_options')) {
                        options_for_adjudicator_allocation.algorithm_options = options.adjudicator_allocation_algorithm_options
                    }
                    if (options.hasOwnProperty('venue_allocation_algorithm_options')) {
                        options_for_venue_allocation.algorithm_options = options.adjudicator_allocation_algorithm_options
                    }

                    return utab.draws.teams.get(_for, options_for_team_allocation)
                    .then(reconvert_draw)
                    .then(function (team_draw) {
                        return utab.draws.adjudicators.get(_for, team_draw, options_for_adjudicator_allocation)
                    })
                    .then(reconvert_draw)
                    .then(function (adjudicator_draw) {
                        return utab.draws.venues.get(_for, adjudicator_draw, options_for_venue_allocation)
                    })
                })
        }
        /**
        * Provides interfaces related to team draw
        * @namespace Tournament.draws.teams
        * @memberof Tournament.draws
        */
        this.draws.teams = {
            //@param  {String[]} [options.adjudicator_filters=['by_bubble', 'by_strength', 'by_attendance', 'by_conflict', 'by_institution', 'by_past']] filters on computing adjudicator draw
            //@param  {Square[]} [options.allocation] if specified, adjudicator/venue allocation will be created based on the allocation
            /**
            * get draw(No side effect)
            * @alias Tournament.draws.teams.get
            * @memberof! Tournament.draws.teams
            * @param {Object} [options]
            * @param  {Boolean} [options.simple=false] if true, it does not use speaker results
            * @param {Boolean} [options.force=false] if true, it does not check the database before creating matchups. (false recommended)
            * @param {String} [options.algorithm='standard'] it computes the allocation using specified algorithm
            * @param {Object} [options.algorithm_options]
            * @param  {String[]} [options.algorithm_options.filters=['by_strength', 'by_side', 'by_past_opponent', 'by_institution']] filters to compute team allocation in `standard` algorithm
            * @return {Promise.<Square[]>} allocation
            */
            get: function(_for, {
                    by: by,
                    simple: simple = false,
                    force: force=false, // ignores warnings
                    algorithm: algorithm = 'standard',
                    algorithm_options: algorithm_options = {}
                }={}) {
                loggers.draws('draws.teams.get is called')
                loggers.draws('debug', 'arguments are: '+JSON.stringify(arguments))
                let rs = by ? by : _.range(1, _for)
                return Promise.all([con.config.read(), con.teams.read(), utab.teams.results.organize(rs, {simple: simple, force: force}), con.institutions.read()])
                    .then(function (vs) {
                        var [config, teams, compiled_team_results, institutions] = vs
                        var team_num = config.style.team_num
                        if (!force) {
                            alloc.teams.precheck(teams, institutions, config.style, _for)
                        }
                        if (algorithm === 'standard') {
                            var new_draw = alloc.teams.standard.get(_for, teams, compiled_team_results, algorithm_options, config)
                        } else {
                            var new_draw = alloc.teams.strict.get(_for, teams, compiled_team_results, config, algorithm_options)
                        }
                        return new_draw
                    })
                    .then(convert_draw)
            }//,
            /**
            * checks allocation(No side effect)
            * @memberof! Tournament.allocations.teams
            * @function Tournament.allocations.teams.check
            * @param allocation
            * @return {Promise.<Square[]>}
            */
        }
        /**
        * Provides interfaces related to adjudicator draw
        * @namespace Tournament.draws.adjudicators
        * @memberof Tournament.draws
        */
        this.draws.adjudicators = {
            get: function(_for, draw, {
                    by: by,
                    simple: simple = false,
                    force: force = false,
                    algorithm: algorithm = 'standard',
                    algorithm_options: algorithm_options = {},
                    numbers_of_adjudicators: numbers_of_adjudicators = {chairs: 1, panels: 2, trainees: 0}
                }={}) {
                loggers.draws('draws.adjudicators.get is called')
                loggers.draws('debug', 'arguments are: '+JSON.stringify(arguments))
                let rs = by ? by : _.range(1, _for)
                return Promise.all([con.config.read(), con.teams.read(), con.adjudicators.read(), con.institutions.read(), utab.teams.results.organize(rs, {force: force, simple: simple}), utab.adjudicators.results.organize(rs, {force: force})])
                    .then(function (vs) {
                        var [config, teams, adjudicators, institutions, compiled_team_results, compiled_adjudicator_results] = vs

                        if (!force) {
                            alloc.adjudicators.precheck(teams, adjudicators, institutions, config.style, _for, numbers_of_adjudicators)
                        }
                        if (algorithm === 'standard') {
                            var new_draw = alloc.adjudicators.standard.get(_for, draw, adjudicators, teams, compiled_team_results, compiled_adjudicator_results, numbers_of_adjudicators, config, algorithm_options)
                        } else if (algorithm === 'traditional') {
                            var new_draw = alloc.adjudicators.traditional.get(_for, draw, adjudicators, teams, compiled_team_results, compiled_adjudicator_results, numbers_of_adjudicators, config, algorithm_options)
                        }
                        return new_draw
                    })
                    .then(convert_draw)
            }
        }
        /**
        * Provides interfaces related to venue draw
        * @namespace Tournament.draws.venues
        * @memberof Tournament.draws
        */
        this.draws.venues = {
            /**
            * get venue draw from draw
            * @param  {Square[]} draw draw
            * @param  {Object} options
            * @param  {Boolean} [options.shuffle=false] if true, it randomly allocates venues to squares so that no one can guess the current rankings of teams.
            * @return {Promise.<Square[]>}
            */
            get: function(_for, draw, {by: by, simple: simple=false, force: force=false, shuffle: shuffle=false}) {
                loggers.draws('draws.venues.get is called')
                loggers.draws('debug', 'arguments are: '+JSON.stringify(arguments))
                let rs = by ? by : _.range(1, _for)

                return Promise.all([con.config.read(), con.teams.read(), con.venues.read(), con.teams.results.organize(rs, {simple: simple, force: force})])
                    .then(function (vs) {
                        var [config, teams, venues, compiled_team_results] = vs

                        if (!force) {
                            alloc.venues.precheck(teams, venues, config.style, _for)
                        }
                        var new_draw = alloc.venues.standard.get(_for, draw, venues, compiled_team_results, config, shuffle)
                        //new_draw = checks.draws.venues.check(new_draw, venues)

                        return new_draw
                    })
                    .then(convert_draw)
            }
        }
        /**
        * closes connection to the tournament database.
        * @memberof! Tournament
        * @function Tournament.close
        */
        this.close = con.close
    }
}

exports.TournamentHandler = TournamentHandler
