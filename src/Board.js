// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var numPiecesInRow = _.reduce(row, function(total, value) {
        return total + value;
      }, 0);
      return numPiecesInRow > 1; // fixme
    },
    // time complexity, O(n)

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var context = this;
      return _.reduce(_.range(this.get('n')), function(answer, rowIndex) {
        return answer || context.hasRowConflictAt(rowIndex);
      }, false); // fixme
    },
    // time complexity, O(n^2)




    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rows = this.rows();
      var column = [];
      rows.forEach(function(row){
        column.push(row[colIndex]);
      });
      var numPiecesInCol = _.reduce(column, function(total, value) {
        return total + value;
      }, 0);
      return numPiecesInCol > 1;
    },
    // time complexity, O(n)

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var context = this;
      return _.reduce(_.range(this.get('n')), function(answer, rowIndex) {
        return answer || context.hasColConflictAt(rowIndex);
      }, false);
    },
    // time complexity O(n^2)



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var board = this.rows();
      var row = 0;
      var col = majorDiagonalColumnIndexAtFirstRow;
      var diagonal = [];
      while (row < this.get('n') && col < this.get('n')) {
        if (col >= 0) {
          diagonal.push(board[row][col]);
        }
        row++;
        col++;
      } 
      var numPiecesInMajDiag = _.reduce(diagonal, function(total, value) {
        return total + value;
      }, 0);
      return numPiecesInMajDiag > 1;
    },
    // time complexity: O(n)

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var context = this;
      return _.reduce(_.range(-1 * this.get('n') + 1, this.get('n')), function(answer, rowIndex) {
        return answer || context.hasMajorDiagonalConflictAt(rowIndex);
      }, false);
    },
    // time complexity: O(n^2)



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var board = this.rows();
      var row = 0;
      var col = minorDiagonalColumnIndexAtFirstRow;
      var diagonal = [];
      while (row < this.get('n') && col >= 0) {
        if (col < this.get('n')) {
          diagonal.push(board[row][col]);
        }
        row++;
        col--;
      } 
      var numPiecesInMinDiag = _.reduce(diagonal, function(total, value) {
        return total + value;
      }, 0);
      return numPiecesInMinDiag > 1;
    },
    // time complexity, O(n)

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var context = this;
      return _.reduce(_.range(this.get('n') * 2 - 1), function(answer, rowIndex) {
        return answer || context.hasMinorDiagonalConflictAt(rowIndex);
      }, false);
    }
    // time complexity, O(n^2)

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
