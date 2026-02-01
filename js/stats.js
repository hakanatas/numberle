window.Numberle = window.Numberle || {};

window.Numberle.Stats = {
  STORAGE_KEY: 'numberle_stats',

  data: null,

  init: function () {
    this.load();
  },

  load: function () {
    var saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        this.data = this.getDefaultData();
      }
    } else {
      this.data = this.getDefaultData();
    }
  },

  save: function () {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  },

  getDefaultData: function () {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    };
  },

  recordWin: function (guessNumber) {
    this.data.gamesPlayed++;
    this.data.gamesWon++;
    this.data.currentStreak++;
    if (this.data.currentStreak > this.data.maxStreak) {
      this.data.maxStreak = this.data.currentStreak;
    }
    this.data.guessDistribution[guessNumber]++;
    this.save();
  },

  recordLoss: function () {
    this.data.gamesPlayed++;
    this.data.currentStreak = 0;
    this.save();
  },

  getWinPercentage: function () {
    if (this.data.gamesPlayed === 0) return 0;
    return Math.round((this.data.gamesWon / this.data.gamesPlayed) * 100);
  },

  renderStatsModal: function () {
    document.getElementById('stat-played').textContent = this.data.gamesPlayed;
    document.getElementById('stat-win-pct').textContent = this.getWinPercentage();
    document.getElementById('stat-current-streak').textContent = this.data.currentStreak;
    document.getElementById('stat-max-streak').textContent = this.data.maxStreak;

    var maxGuess = 0;
    for (var i = 1; i <= 6; i++) {
      if (this.data.guessDistribution[i] > maxGuess) {
        maxGuess = this.data.guessDistribution[i];
      }
    }

    for (var j = 1; j <= 6; j++) {
      var bar = document.querySelector('.dist-bar[data-guess="' + j + '"]');
      if (bar) {
        var count = this.data.guessDistribution[j];
        bar.textContent = count;
        var pct = maxGuess > 0 ? Math.max((count / maxGuess) * 100, 7) : 7;
        bar.style.width = pct + '%';
        bar.classList.toggle('highlight', count > 0);
      }
    }
  },

  generateShareText: function () {
    var Game = window.Numberle.Game;
    var won = Game.evaluations.some(function (row) {
      return row && row.every(function (s) { return s === 'correct'; });
    });

    var attempts = won ? (Game.currentRow) : 'X';
    var text = 'Numberle (' + Game.digitLength + ' basamak) ' + attempts + '/6\n\n';

    var emojiMap = {
      'correct': '\uD83D\uDFE9',
      'present': '\uD83D\uDFE8',
      'absent': '\u2B1B'
    };

    for (var i = 0; i < Game.evaluations.length; i++) {
      if (!Game.evaluations[i]) break;
      var row = Game.evaluations[i];
      for (var j = 0; j < row.length; j++) {
        text += emojiMap[row[j]] || '';
      }
      text += '\n';
    }

    return text.trim();
  },

  shareResults: function () {
    var text = this.generateShareText();

    if (navigator.share) {
      navigator.share({ text: text }).catch(function () {
        this.copyToClipboard(text);
      }.bind(this));
    } else {
      this.copyToClipboard(text);
    }
  },

  copyToClipboard: function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        window.Numberle.App.showToast('Panoya kopyalandi!');
      }).catch(function () {
        window.Numberle.App.showToast('Paylasim desteklenmiyor');
      });
    } else {
      window.Numberle.App.showToast('Paylasim desteklenmiyor');
    }
  }
};
