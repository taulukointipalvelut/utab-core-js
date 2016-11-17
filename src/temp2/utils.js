function count(target_list, element) {
    var c = 0
    for (var target of target_list) {
        if (target === element) {
            c += 1
        }
    }
    return c
}

;(function () {


    function ignore_na(a) {
        return a === 'n/a' ? 0 : a
    }

    Array.prototype.substantial_length = function () {
        return this.length - count(this, 'n/a')
    }

    Array.prototype.sum = function () {
        if (this.substantial_length() === 0) {
            return 0
        } else {
            return this.reduce((a, b) => a + ignore_na(b))
        }
    }

    Array.prototype.adjusted_average = function () {
        var sum = this.sum()
        if (this.substantial_length() === 0) {
            return 0
        } else {
            return sum/this.substantial_length()
        }
    }

    Array.prototype.sd = function () {
        if (this.length === 0) {
            return 0
        } else {
            var mean = this.adjusted_average()
            var sd = this.map(x => (x - mean)*(x - mean)).sum()/this.length
            var sd = Math.sqrt(sd)
            return sd
        }
    }

    function compare_allocation (db, a, b) {
        var a_teams = a.teams.map(id => get_element_by_id(db.teams, id))
        var b_teams = b.teams.map(id => get_element_by_id(db.teams, id))
        var a_wins = a_teams.map(t => t.wins.sum()).sum()
        var b_wins = b_teams.map(t => t.wins.sum()).sum()
        if (a_wins > b_wins) {
            return 1
        } else {
            return -1
        }
    }

    Array.prototype.sort_allocation = function (db) {
        var sorted_allocation = tools.allocation_deepcopy(this)
        sorted_allocation.sort((a, b) => compare_allocation(db, a, b))
        return sorted_allocation
    }

    Array.prototype.shuffle = function () {
        var array = [].concat(this)
        var n = array.length
        var t
        var i

        while (n) {
            i = Math.floor(Math.random() * n--)
            t = array[n]
            array[n] = array[i]
            array[i] = t
        }
        return array
    }
})();
