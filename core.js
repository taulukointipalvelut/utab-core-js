"use strict";
/**
 * @author taulukointipalvelut@gmail.com (nswa17)
 * @file Interfaces to manage tournament
 * @todo simple allocation
 * @version 1.1
 */

var operations = require('./src/operations.js')
var controllers = require('./src/controllers.js')
var _ = require('underscore/underscore.js')

/**
 * Represents a pair/set of teams in a venue. A minimum unit to be an allocation.
 * @typedef Square
 * @property {Number} id id of the Square
 * @property {Number[]} teams teams in the Square
 * @property {Number[]} chairs chairs in the Square
 * @property {Number[]} remaining_adjudicators adjudicators(panels) in the Square
 * @property {Number[]} remaining_adjudicators2 adjudicators(trainees) in the Square
 * @property {String[]} warnings warnings
 * @property {Number} venue
 */

 /**
  * Represents a team.
  * @typedef Team
  * @property {Number} id id of the Team
  * @property {String} name name of the Team
  * @property {Boolean} available available
  * @property {String} url url of the Team
  */

  /**
   * Represents an adjudicator.
   * @typedef Adjudicator
   * @property {Number} id id of the Adjudicator
   * @property {Number} preev pre evaluation(judge test) of the Adjudicator
   * @property {String} name name of the Adjudicator
   * @property {Boolean} available available
   * @property {String} url url of the Adjudicator
   */

/**
 * Represents a venue.
 * @typedef Venue
 * @property {Number} id id of the Venue
 * @property {Number} priority priority of the Venue
 * @property {String} name name of the Venue
 * @property {Boolean} available available
 * @property {String} url url of the Venue
 */

/**
 * Represents an institution.
 * @typedef Institution
 * @property {Number} id id of the Institution
 * @property {String} name name of the Institution
 * @property {Boolean} available available
 * @property {String} url url of the Institution
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
* Represents raw debater result.
* @typedef RawDebaterResult
* @property {Number} id id of the debater to evaluate
* @property {Number} from_id id of the sender
* @property {Number} r round number at which the result is sent
* @property {Number[]} scores scores the sender writes
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
 * @property {Number[]} watched_teams teams the adjudicator watched
 * @property {String} [comment] the comment for the adjudicator from the sender
 */

/**
 * Interfaces to operate UTab core
 */
class Main {
    /**
     * @param {(String | Number)} id - Unique ID of the tournament
     */
    constructor (id) {
        var con = new controllers.CON(id)
        var op = new operations.OP()

        var core = this
        /**
         * Provides Interfaces related to teams
         * @namespace teams
         */
        this.teams = con.teams
        /**
         * returns all teams(No side effect)
         * @name teams.read
         * @memberof! teams
         * @function teams.read
         * @return {Promise.<Team[]>} Teams
         */
        //this.teams.read
        /**
         * creates specified team.
         * Attention: It throws an error if the specified team already exists.
         * @name teams.create
         * @memberof! teams
         * @function teams.create
         * @param dict
         * @param {Number} dict.id id of the team to create
         * @param {Number} [dict.name=""] name of the team to create
         * @param {Number} [dict.available=true] id of the team to create
         * @param {Number} [dict.url=""] id of the team to create
         * @return {Promise.<Team>} Created team
         * @throws {Promise} AlreadyExists
         */
        //this.teams.create
        /**
         * deletes specified team.
         * Attention: It throws an error if the specified team does not exist.
         * @name teams.delete
         * @memberof! teams
         * @function teams.delete
         * @param dict
         * @param {Number} dict.id id of the team to delete
         * @return {Promise.<Team>} Deleted team
         * @throws {Promise} DoesNotExist
         */
        /**
         * finds on specified condition(No side effect)
         * @name teams.find
         * @memberof! teams
         * @function teams.find
         * @param dict
         * @param {Number} [dict.id] id of the team to find
         * @param {Number} [dict.name] name of the team to find
         * @param {Number} [dict.available] id of the team to find
         * @param {Number} [dict.url] id of the team to find
         * @return {Promise.<Team[]>} Teams
         */
        /**
         * updates specified team
         * Attention: It throws an error if the specified team does not exist.
         * @name teams.update
         * @memberof! teams
         * @function teams.update
         * @param dict
         * @param {Number} dict.id id of the team to update
         * @param {Number} [dict.name=""] name of the team to update
         * @param {Number} [dict.available=true] id of the team to update
         * @param {Number} [dict.url=""] id of the team to update
         * @return {Promise.<Team>} Updated team
         * @throws DoesNotExist
         */
        /**
         * @namespace teams.results
         * @memberof teams
         */
        /**
         * reads all raw team results(No side effect)
         * @name teams.results.read
         * @memberof! teams.results
         * @function teams.results.read
         * @returns {Promise.<RawTeamResult[]>}
         */
        /**
         * Summarizes team results(No side effect)
         * @alias teams.results.organize
         * @param  {(Number | Number[])} r_or_rs round number(s) used to summarize results
         * @param options options for summarization
         * @param {Boolean} options.simple only use team results. No debater results is considered thus unable to output team points
         * @return {Promise} summarized team results
         */
        this.teams.results.organize = function(r_or_rs, {simple: simple}={simple: false}) {
            if (simple) {
                if (Array.isArray(r_or_rs)) {
                    return Promise.all([con.teams.read(), con.teams.results.read()]).then(function (vs) {
                        var [teams, raw_team_results] = vs
                        return op.teams.results.simplified_compile(teams, raw_team_results, r_or_rs)
                    })
                } else {
                    return Promise.all([con.teams.read(), con.teams.results.read()]).then(function (vs) {
                        var [teams, raw_team_results] = vs
                        return op.teams.results.simplified_summarize(teams, raw_team_results, r_or_rs)
                    })
                }
            } else {
                if (Array.isArray(r_or_rs)) {
                    return Promise.all([con.teams.read(), con.teams.debaters.read(), con.teams.debaters.read(), con.teams.results.read(), con.debaters.results.read(), con.rounds.styles.read()]).then(function (vs) {
                        var [teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, style] = vs
                        return op.teams.results.compile(teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, style, r_or_rs)
                    })
                } else {
                    return Promise.all([con.teams.read(), con.teams.debaters.read(), con.teams.debaters.read(), con.teams.results.read(), con.debaters.results.read(), con.rounds.styles.read()]).then(function (vs) {
                        var [teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, style] = vs
                        return op.teams.results.summarize(teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, style, r_or_rs)
                    })
                }
            }
        }

        /**
         * Interfaces related to teams to debaters
         * @namespace debaters
         * @memberof teams
         */
        /**
         * returns teams to debaters(No side effect)
         * @name teams.debaters.read
         * @memberof! teams.debaters
         * @function teams.debaters.read
         * @return {Promise} Teams to debaters
         */
        /**
         * sets debaters to a team.
         * Attention: It throws an error if the specified team has debaters.
         * @name teams.debaters.create
         * @memberof! teams.debaters
         * @function teams.debaters.create
         * @param dict
         * @param {Number} dict.id id of the team to set debaters
         * @param {Number} dict.debaters debaters to set
         * @return {Promise} Created team
         * @throws {Promise} AlreadyExists
         */
        /**
         * sets debaters to a team. It does not throw an error even if debaters are already set to the team.
         * @name teams.debaters.createIfNotExists
         * @memberof! teams.debaters
         * @function teams.debaters.createIfNotExists
         * @param dict
         * @param {Number} dict.id id of the team to set debaters
         * @param {Number} dict.debaters debaters to set
         * @return {Promise} Created team
         */
        /**
         * deletes debaters from specified team.
         * Attention: It throws an error if the specified team does not exist.
         * @name teams.debaters.delete
         * @memberof! teams.debaters
         * @function teams.debaters.delete
         * @param dict
         * @param {Number} dict.id id of the team to delete
         * @return {Promise} Team
         * @throws {Promise} DoesNotExist
         */
        /**
         * finds on specified condition(No side effect)
         * @name teams.debaters.find
         * @memberof! teams
         * @function teams.debaters.find
         * @param dict
         * @param {Number} [dict.id] id of the team
         * @param {Number} [dict.debaters] debaters of the team
         * @return {Promise} Teams
         */
        /**
         * updates debaters of specified team
         * Attention: It throws an error if the specified team does not exist.
         * @name teams.debaters.update
         * @memberof! teams.debaters
         * @function teams.debaters.update
         * @param dict
         * @param {Number} dict.id id of the team
         * @param {Number} [dict.debaters] debaters of the team
         * @return {Promise} Team
         * @throws DoesNotExist
         */

        /**
         * Provides interefaces related to teams to institutions
         */

        /**
         * Provides interfaces related to adjudicators
         * @namespace adjudicators
         */
        this.adjudicators = con.adjudicators
        /**
         * @namespace adjudicators.results
         * @memberof adjudicators
         */
        /**
         * Summarizes adjudicator results(No side effect)
         * @alias adjudicators.results.organize
         * @memberof! adjudicators.results
         * @param  {(Number | Number[])} r_or_rs round number(s) used to summarize results
         * @return {Promise} summarized adjudicator results
         */
        this.adjudicators.results.organize = function(r_or_rs) {
            if (Array.isArray(r_or_rs)) {

                return Promise.all([con.adjudicators.read(), con.adjudicators.results.read()]).then(function(vs) {
                    var [adjudicators, raw_adjudicator_results] = vs
                    return op.adjudicators.results.compile(adjudicators, raw_adjudicator_results, r_or_rs)
                })
            } else {
                return Promise.all([con.adjudicators.read(), con.adjudicators.results.read()]).then(function(vs) {
                    var [adjudicators, raw_adjudicator_results] = vs
                    return op.adjudicators.results.summarize(adjudicators, raw_adjudicator_results, r_or_rs)
                })
            }
        }
        /**
         * Interfaces related to tournament operation
         * @namespace rounds
         * @deprecated
         */
        this.rounds = con.rounds
        /**
         * Interfaces related to venues
         * @namespace venues
         */
        this.venues = con.venues
        /**
         * Interfaces related to debaters
         * @namespace debaters
         */
        this.debaters = con.debaters
        /**
         * Interfaces related to debater results
         * @namespace debaters.results
         * @memberof debaters
         */
        /**
         * Summarizes debater results(No side effect)
         * @alias adjudicators.results.organize
         * @memberof! adjudicators.results
         * @param  {(Number | Number[])} r_or_rs round number(s) used to summarize results
         * @return {Promise} summarized adjudicator results
         */
        this.debaters.results.organize = function(r_or_rs) {
            if (Array.isArray(r_or_rs)) {
                return Promise.all([con.debaters.read(), con.debaters.results.read()]).then(function(vs) {
                    var [debaters, raw_debater_results] = vs
                    return op.debaters.results.compile(debaters, raw_debater_results, r_or_rs)
                })
            } else {
                return Promise.all([con.debaters.read(), con.debaters.results.read()]).then(function(vs) {
                    var [debaters, raw_debater_results] = vs
                    return op.debaters.results.summarize(debaters, raw_debater_results, r_or_rs)
                })
            }
        }
        /**
         * Interfaces related to institutions
         * @namespace institutions
         */
        this.institutions = con.institutions

        /**
         * Provides interfaces related to allocations
         * @namespace allocations
         */
        this.allocations = {//op.allocations
            /**
             * get allocation(No side effect)
             * @alias allocations.get
             * @memberof! allocations
             * @param {Grids}  dict
             * @param  {Boolean} dict.simple Does not use debater results
             * @param  {Boolean} dict.with_venues Allocate venues
             * @param  {Boolean} dict.with_adjudicators Allocate adjudicators
             * @param  {String[]} dict.filters filters to use on computing team allocation
             * @param  {String[]} dict.adjudicator_filters filters on computing adjudicator allocation
             * @param  {Square} [allocation] team allocation by which it creates adjudicator/venue allocation if indicated
             * @return {Promise.<Square[]>} allocation
             */
            get: function({
                    simple: simple = false,
                    with_venues: with_venues = true,
                    with_adjudicators: with_adjudicators = true,
                    filters: filter_functions_strs=['by_strength', 'by_side', 'by_past_opponent', 'by_institution'],
                    adjudicator_filters: filter_functions_adj_strs=['by_bubble', 'by_strength', 'by_attendance', 'by_conflict', 'by_institution', 'by_past']
                }, allocation) {
                try {
                    var all_filter_functions = op.allocations.teams.functions.read()
                    var [all_filter_functions_adj, all_filter_functions_adj2] = op.allocations.adjudicators.functions.read()
                    var filter_functions = filter_functions_strs.map(f_str => all_filter_functions[f_str])
                    var filter_functions_adj = filter_functions_adj_strs.filter(f_str => all_filter_functions_adj.hasOwnProperty(f_str)).map(f_str => all_filter_functions_adj[f_str])
                    var filter_functions_adj2 = filter_functions_adj_strs.filter(f_str => all_filter_functions_adj2.hasOwnProperty(f_str)).map(f_str => all_filter_functions_adj2[f_str])
                } catch(e) {
                    return Promise.reject(e)
                }
                if (simple === true) {
                    if (allocation) {
                        undefined
                    } else {
                        undefined
                    }
                } else {
                    if (allocation) {
                        return con.rounds.read().then(function (round_info) {
                            var current_round_num = round_info['current_round_num']
                            var considering_rounds = _.range(1, current_round_num)
                            return Promise.all([con.teams.read(), con.adjudicators.read(), con.venues.read(), core.teams.results.organize(considering_rounds), core.adjudicators.results.organize(considering_rounds), con.adjudicators.institutions.read(), con.adjudicators.conflicts.read()]).then(function (vs) {
                                var [teams, adjudicators, venues, compiled_team_results, compiled_adjudicator_results, adjudicators_to_institutions, adjudicators_to_conflicts] = vs

                                if (with_adjudicators) {
                                    new_allocation = op.allocations.adjudicators.get(allocation, teams, adjudicators, compiled_team_results, compiled_adjudicator_results, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)
                                }
                                if (with_venues) {
                                    new_allocation = op.allocations.venues.get(new_allocation, venues)
                                }
                                return new_allocation
                            })
                        })
                    } else {
                        return con.rounds.read().then(function (round_info) {
                            var current_round_num = round_info['current_round_num']
                            var considering_rounds = _.range(1, current_round_num)
                            return Promise.all([con.teams.read(), con.adjudicators.read(), con.venues.read(), core.teams.results.organize(considering_rounds), core.adjudicators.results.organize(considering_rounds), con.teams.institutions.read(), con.adjudicators.institutions.read(), con.adjudicators.conflicts.read()]).then(function (vs) {
                                var [teams, adjudicators, venues, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts] = vs

                                var new_allocation = op.allocations.teams.get(teams, compiled_team_results, teams_to_institutions, filter_functions)///////
                                if (with_adjudicators) {
                                    new_allocation = op.allocations.adjudicators.get(new_allocation, teams, adjudicators, compiled_team_results, compiled_adjudicator_results, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)
                                }
                                if (with_venues) {
                                    new_allocation = op.allocations.venues.get(new_allocation, venues)
                                }
                                return new_allocation
                            })
                        })
                    }
                }
            },
            /**
             * checks allocation(No side effect)
             * @param dict
             * @param  {Boolean} [dict.check_teams=true] check team allocation
             * @param  {Boolean} [dict.check_adjudicators=true] check adjudicator allocation
             * @param  {Boolean} [dict.check_venues=true] check venue allocation
             * @return {Promise.<Square[]>}
             */
            check: function({
                check_teams: check_teams = true,
                check_adjudicators: check_adjudicators = true,
                check_venues: check_venues = true
            }) {
                throw new Error('undefined')
            }
        }
        this.db = {
            close: con.close
        }
    }
}

exports.Main = Main
/*
var t = new Main( "test")
//console.log(t)

t.rounds.configure({total_round_num: 4})
t.teams.create({id: 1, institution_ids: [0]})
t.teams.create({id: 2, institution_ids: [0]})
t.teams.create({id: 3, institution_ids: [1]})
t.teams.create({id: 4, institution_ids: [1]})
t.adjudicators.create({id: 1, institution_ids: [0], conflicts: [1]})
t.adjudicators.create({id: 2, institution_ids: [2], conflicts: [3]})
t.venues.create({id: 1, priority: 1})
t.venues.create({id: 2, priority: 1})
console.log(t.teams.read({id: 1, institution_ids: [0, 1]}))
console.log(t.teams.read())
console.log(t.adjudicators.read({institution_ids: [0, 1]}))
console.log(t.allocations.read())
//console.log(t.teams.delete(1))
//console.log(t.teams.read)
*/
