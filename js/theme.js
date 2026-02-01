window.Numberle = window.Numberle || {};

window.Numberle.Theme = {
  STORAGE_KEY: 'numberle_theme',

  init: function () {
    var saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.setTheme(saved);
    }

    var toggle = document.getElementById('toggle-theme');
    if (toggle) {
      toggle.checked = saved === 'dark';
      toggle.addEventListener('change', function () {
        var theme = toggle.checked ? 'dark' : 'light';
        this.setTheme(theme);
        localStorage.setItem(this.STORAGE_KEY, theme);
      }.bind(this));
    }
  },

  setTheme: function (theme) {
    document.documentElement.dataset.theme = theme;
    var metaColor = document.querySelector('meta[name="theme-color"]');
    if (metaColor) {
      metaColor.setAttribute('content', theme === 'dark' ? '#121213' : '#4a90d9');
    }
  }
};
