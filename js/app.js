window.Numberle = window.Numberle || {};

window.Numberle.App = {
  init: function () {
    // Modulleri baslat
    window.Numberle.Theme.init();
    window.Numberle.Modal.init();
    window.Numberle.Stats.init();
    window.Numberle.Keyboard.init();

    // Kayitli basamak uzunlugunu yukle
    var savedLength = localStorage.getItem('numberle_digitLength');
    var digitLength = savedLength ? parseInt(savedLength, 10) : 5;
    if (digitLength < 4 || digitLength > 6) digitLength = 5;

    // Uzunluk butonlarini ayarla
    this.setActiveLength(digitLength);

    // Oyunu baslat
    window.Numberle.Game.init(digitLength);

    // Uzunluk secici olaylari
    this.setupLengthSelector();

    // Yeni oyun butonu
    var btnNewGame = document.getElementById('btn-new-game');
    if (btnNewGame) {
      btnNewGame.addEventListener('click', function () {
        window.Numberle.Modal.closeAll();
        this.newGame();
      }.bind(this));
    }

    // Paylas butonu
    var btnShare = document.getElementById('btn-share');
    if (btnShare) {
      btnShare.addEventListener('click', function () {
        window.Numberle.Stats.shareResults();
      });
    }

    // Service Worker kaydi
    this.registerServiceWorker();
  },

  setupLengthSelector: function () {
    var buttons = document.querySelectorAll('.length-btn');
    var self = this;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var length = parseInt(btn.dataset.length, 10);
        var Game = window.Numberle.Game;

        // Ayni uzunluk secildiyse bir sey yapma
        if (length === Game.digitLength && !Game.isGameOver) return;

        self.setActiveLength(length);
        localStorage.setItem('numberle_digitLength', length);
        Game.digitLength = length;
        Game.reset();
      });
    });
  },

  setActiveLength: function (length) {
    var buttons = document.querySelectorAll('.length-btn');
    buttons.forEach(function (btn) {
      btn.classList.toggle('active', parseInt(btn.dataset.length, 10) === length);
    });
  },

  newGame: function () {
    var Game = window.Numberle.Game;
    Game.reset();
  },

  showToast: function (message, duration) {
    duration = duration || 1500;
    var container = document.getElementById('toast-container');
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.animationDuration = '0.15s, 0.3s';
    toast.style.animationDelay = '0s, ' + (duration - 300) + 'ms';

    container.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, duration);
  },

  registerServiceWorker: function () {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js')
          .then(function (reg) {
            console.log('Service Worker kaydedildi:', reg.scope);
          })
          .catch(function (err) {
            console.log('Service Worker kaydi basarisiz:', err);
          });
      });
    }
  }
};

// Mobilde gercek viewport yuksekligini hesapla (adres cubugu + nav bar hesaba katilir)
(function setVH() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
})();
window.addEventListener('resize', function () {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
});

// Uygulama hazir oldugunda baslat
document.addEventListener('DOMContentLoaded', function () {
  window.Numberle.App.init();
});
