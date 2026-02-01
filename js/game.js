window.Numberle = window.Numberle || {};

window.Numberle.Game = {
  digitLength: 5,
  targetNumber: '',
  currentRow: 0,
  currentCol: 0,
  currentGuess: [],
  evaluations: [],
  isGameOver: false,
  isRevealing: false,
  MAX_GUESSES: 6,

  WIN_MESSAGES: ['Dahice!', 'Muhtesem!', 'Harika!', 'Guzel!', 'Iyi!', 'Zar zor!'],

  init: function (digitLength) {
    this.digitLength = digitLength || 5;
    this.reset();
  },

  reset: function () {
    this.targetNumber = this.generateRandomNumber(this.digitLength);
    this.currentRow = 0;
    this.currentCol = 0;
    this.currentGuess = [];
    this.evaluations = [];
    this.isGameOver = false;
    this.isRevealing = false;

    window.Numberle.Board.init(this.digitLength);
    window.Numberle.Keyboard.resetKeys();
  },

  generateRandomNumber: function (length) {
    var digits = '';
    for (var i = 0; i < length; i++) {
      digits += Math.floor(Math.random() * 10).toString();
    }
    return digits;
  },

  addDigit: function (digit) {
    if (this.isGameOver || this.isRevealing) return;
    if (this.currentCol >= this.digitLength) return;

    this.currentGuess.push(digit);
    window.Numberle.Board.setTileDigit(this.currentRow, this.currentCol, digit);
    this.currentCol++;
  },

  removeDigit: function () {
    if (this.isGameOver || this.isRevealing) return;
    if (this.currentCol <= 0) return;

    this.currentCol--;
    this.currentGuess.pop();
    window.Numberle.Board.clearTileDigit(this.currentRow, this.currentCol);
  },

  submitGuess: function () {
    if (this.isGameOver || this.isRevealing) return;

    if (this.currentGuess.length < this.digitLength) {
      window.Numberle.App.showToast('Yeterli rakam yok');
      window.Numberle.Board.shakeRow(this.currentRow);
      return;
    }

    var guessStr = this.currentGuess.join('');
    var evaluation = this.evaluateGuess(guessStr, this.targetNumber);
    this.evaluations.push(evaluation);

    this.isRevealing = true;
    var self = this;

    window.Numberle.Board.revealRow(this.currentRow, evaluation, function () {
      self.isRevealing = false;

      // Klavye durumunu guncelle
      for (var i = 0; i < guessStr.length; i++) {
        window.Numberle.Keyboard.updateKeyState(guessStr[i], evaluation[i]);
      }

      // Kazanma kontrolu
      var isCorrect = evaluation.every(function (s) { return s === 'correct'; });

      if (isCorrect) {
        self.handleWin();
      } else if (self.currentRow >= self.MAX_GUESSES - 1) {
        self.handleLoss();
      } else {
        self.currentRow++;
        self.currentCol = 0;
        self.currentGuess = [];
      }
    });
  },

  evaluateGuess: function (guess, target) {
    var result = new Array(guess.length).fill('absent');
    var targetDigitCount = {};

    for (var i = 0; i < target.length; i++) {
      var d = target[i];
      targetDigitCount[d] = (targetDigitCount[d] || 0) + 1;
    }

    // GECIS 1: Dogru pozisyon (yesil)
    for (var i = 0; i < guess.length; i++) {
      if (guess[i] === target[i]) {
        result[i] = 'correct';
        targetDigitCount[guess[i]]--;
      }
    }

    // GECIS 2: Yanlis pozisyon (sari)
    for (var i = 0; i < guess.length; i++) {
      if (result[i] === 'correct') continue;
      if (targetDigitCount[guess[i]] && targetDigitCount[guess[i]] > 0) {
        result[i] = 'present';
        targetDigitCount[guess[i]]--;
      }
    }

    return result;
  },

  handleWin: function () {
    this.isGameOver = true;
    var guessNumber = this.currentRow + 1;
    var message = this.WIN_MESSAGES[guessNumber - 1] || 'Tebrikler!';

    var self = this;
    setTimeout(function () {
      window.Numberle.Board.bounceRow(self.currentRow);
    }, 100);

    setTimeout(function () {
      window.Numberle.App.showToast(message, 2000);
    }, 500);

    setTimeout(function () {
      window.Numberle.Stats.recordWin(guessNumber);
      window.Numberle.Stats.renderStatsModal();
      window.Numberle.Modal.open('modal-stats');
    }, 2500);
  },

  handleLoss: function () {
    this.isGameOver = true;
    var target = this.targetNumber;

    setTimeout(function () {
      window.Numberle.App.showToast('Sayi: ' + target, 3000);
    }, 500);

    setTimeout(function () {
      window.Numberle.Stats.recordLoss();
      window.Numberle.Stats.renderStatsModal();
      window.Numberle.Modal.open('modal-stats');
    }, 3500);
  }
};
