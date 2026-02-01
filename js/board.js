window.Numberle = window.Numberle || {};

window.Numberle.Board = {
  init: function (digitLength) {
    var board = document.getElementById('board');
    board.innerHTML = '';
    board.className = 'board-' + digitLength;

    var totalTiles = 6 * digitLength;
    for (var i = 0; i < totalTiles; i++) {
      var tile = document.createElement('div');
      tile.className = 'tile';
      board.appendChild(tile);
    }
  },

  getTile: function (row, col) {
    var Game = window.Numberle.Game;
    var board = document.getElementById('board');
    var index = row * Game.digitLength + col;
    return board.children[index];
  },

  setTileDigit: function (row, col, digit) {
    var tile = this.getTile(row, col);
    if (tile) {
      tile.textContent = digit;
      tile.classList.add('filled');
    }
  },

  clearTileDigit: function (row, col) {
    var tile = this.getTile(row, col);
    if (tile) {
      tile.textContent = '';
      tile.classList.remove('filled');
    }
  },

  revealRow: function (row, evaluations, callback) {
    var Game = window.Numberle.Game;
    var length = Game.digitLength;
    var self = this;
    var revealed = 0;

    for (var i = 0; i < length; i++) {
      (function (col) {
        var tile = self.getTile(row, col);
        var state = evaluations[col];

        setTimeout(function () {
          tile.classList.add('flip');

          setTimeout(function () {
            tile.classList.remove('flip');
            tile.classList.add(state);
            tile.classList.add('flip-out');

            setTimeout(function () {
              tile.classList.remove('flip-out');
              revealed++;
              if (revealed === length && callback) {
                callback();
              }
            }, 250);
          }, 250);
        }, col * 300);
      })(i);
    }
  },

  shakeRow: function (row) {
    var Game = window.Numberle.Game;
    var length = Game.digitLength;
    for (var i = 0; i < length; i++) {
      var tile = this.getTile(row, i);
      tile.classList.add('shake');
      (function (t) {
        setTimeout(function () {
          t.classList.remove('shake');
        }, 500);
      })(tile);
    }
  },

  bounceRow: function (row) {
    var Game = window.Numberle.Game;
    var length = Game.digitLength;
    for (var i = 0; i < length; i++) {
      var tile = this.getTile(row, i);
      (function (t, delay) {
        setTimeout(function () {
          t.classList.add('bounce');
          setTimeout(function () {
            t.classList.remove('bounce');
          }, 500);
        }, delay);
      })(tile, i * 100);
    }
  },

  clearBoard: function () {
    var board = document.getElementById('board');
    var tiles = board.querySelectorAll('.tile');
    tiles.forEach(function (tile) {
      tile.textContent = '';
      tile.className = 'tile';
    });
  }
};
