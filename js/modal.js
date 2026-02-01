window.Numberle = window.Numberle || {};

window.Numberle.Modal = {
  init: function () {
    // Yardim butonu
    var btnHelp = document.getElementById('btn-help');
    if (btnHelp) {
      btnHelp.addEventListener('click', function () {
        this.open('modal-help');
      }.bind(this));
    }

    // Istatistik butonu
    var btnStats = document.getElementById('btn-stats');
    if (btnStats) {
      btnStats.addEventListener('click', function () {
        window.Numberle.Stats.renderStatsModal();
        this.open('modal-stats');
      }.bind(this));
    }

    // Ayarlar butonu
    var btnSettings = document.getElementById('btn-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', function () {
        this.open('modal-settings');
      }.bind(this));
    }

    // Kapat butonlari
    var closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        this.closeAll();
      }.bind(this));
    }.bind(this));

    // Overlay tiklama ile kapat
    var overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          this.closeAll();
        }
      }.bind(this));
    }.bind(this));

    // Escape tusu ile kapat
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        this.closeAll();
      }
    }.bind(this));
  },

  open: function (id) {
    var modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
    }
  },

  close: function (id) {
    var modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
    }
  },

  closeAll: function () {
    var modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(function (m) {
      m.classList.remove('active');
    });
  }
};
