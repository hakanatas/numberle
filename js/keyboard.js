window.Numberle = window.Numberle || {};

window.Numberle.Keyboard = {
  VALID_DIGITS: '0123456789',

  STATE_PRIORITY: {
    'correct': 3,
    'present': 2,
    'absent': 1
  },

  init: function () {
    // Ekran klavyesi
    var keyboard = document.getElementById('keyboard');
    keyboard.addEventListener('click', function (e) {
      var key = e.target.closest('.key');
      if (!key) return;

      var value = key.dataset.key;
      var Game = window.Numberle.Game;

      if (value === 'Enter') {
        Game.submitGuess();
      } else if (value === 'Backspace') {
        Game.removeDigit();
      } else if (this.VALID_DIGITS.indexOf(value) !== -1) {
        Game.addDigit(value);
      }
    }.bind(this));

    // Fiziksel klavye
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Modal aciksa klavye girdilerini engelle
      var activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) return;

      var Game = window.Numberle.Game;

      if (e.key === 'Enter') {
        e.preventDefault();
        Game.submitGuess();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        Game.removeDigit();
      } else if (this.VALID_DIGITS.indexOf(e.key) !== -1) {
        e.preventDefault();
        Game.addDigit(e.key);
      }
    }.bind(this));
  },

  updateKeyState: function (digit, state) {
    var keyEl = document.querySelector('.key[data-key="' + digit + '"]');
    if (!keyEl) return;

    var currentState = null;
    if (keyEl.classList.contains('key-correct')) currentState = 'correct';
    else if (keyEl.classList.contains('key-present')) currentState = 'present';
    else if (keyEl.classList.contains('key-absent')) currentState = 'absent';

    var newPriority = this.STATE_PRIORITY[state] || 0;
    var currentPriority = currentState ? (this.STATE_PRIORITY[currentState] || 0) : 0;

    if (newPriority > currentPriority) {
      keyEl.classList.remove('key-correct', 'key-present', 'key-absent');
      keyEl.classList.add('key-' + state);
    }
  },

  resetKeys: function () {
    var keys = document.querySelectorAll('.key');
    keys.forEach(function (key) {
      key.classList.remove('key-correct', 'key-present', 'key-absent');
    });
  }
};
