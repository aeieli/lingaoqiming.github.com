/**
 * Reader Settings Panel
 * Theme, font size, and line spacing controls
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'lingaoqiming_reader_settings';
  var settingsBtn = null;
  var settingsPanel = null;
  var settingsOverlay = null;
  var isOpen = false;

  var defaultSettings = {
    theme: 'dark',
    fontSize: 18,
    lineHeight: 1.7
  };

  var currentSettings = Object.assign({}, defaultSettings);

  var themes = {
    dark: {
      name: '夜间',
      bg: '#101010',
      text: '#f0e7d5',
      headerBg: '#353535',
      sidebarBg: '#1a1a1a',
      linkColor: '#DF8744',
      borderColor: '#434343'
    },
    light: {
      name: '日间',
      bg: '#f5f5f5',
      text: '#333333',
      headerBg: '#ffffff',
      sidebarBg: '#ffffff',
      linkColor: '#0066cc',
      borderColor: '#dddddd'
    },
    sepia: {
      name: '护眼',
      bg: '#f4ecd8',
      text: '#5b4636',
      headerBg: '#e8dcc8',
      sidebarBg: '#ebe3d3',
      linkColor: '#8b4513',
      borderColor: '#d4c4a8'
    }
  };

  function init() {
    loadSettings();
    createSettingsButton();
    createSettingsPanel();
    applySettings();
  }

  function loadSettings() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        currentSettings = Object.assign({}, defaultSettings, parsed);
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }

  function createSettingsButton() {
    settingsBtn = document.createElement('button');
    settingsBtn.className = 'settings-toggle';
    settingsBtn.setAttribute('aria-label', '阅读设置');
    settingsBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>';
    settingsBtn.addEventListener('click', togglePanel);

    var header = document.getElementById('header');
    if (header) {
      header.appendChild(settingsBtn);
    }
  }

  function createSettingsPanel() {
    // Create overlay
    settingsOverlay = document.createElement('div');
    settingsOverlay.className = 'settings-overlay';
    settingsOverlay.addEventListener('click', closePanel);

    // Create panel
    settingsPanel = document.createElement('div');
    settingsPanel.className = 'settings-panel';
    settingsPanel.innerHTML = '\
      <div class="settings-header">\
        <span class="settings-title">阅读设置</span>\
        <button class="settings-close" aria-label="关闭">&times;</button>\
      </div>\
      <div class="settings-content">\
        <div class="settings-section">\
          <div class="settings-label">主题</div>\
          <div class="theme-options">\
            <button class="theme-btn" data-theme="dark">夜间</button>\
            <button class="theme-btn" data-theme="light">日间</button>\
            <button class="theme-btn" data-theme="sepia">护眼</button>\
          </div>\
        </div>\
        <div class="settings-section">\
          <div class="settings-label">字体大小 <span class="font-size-value">' + currentSettings.fontSize + 'px</span></div>\
          <div class="settings-slider">\
            <button class="slider-btn minus" data-action="fontSize" data-delta="-2">A-</button>\
            <input type="range" class="slider-input" id="fontSizeSlider" min="14" max="28" step="2" value="' + currentSettings.fontSize + '">\
            <button class="slider-btn plus" data-action="fontSize" data-delta="2">A+</button>\
          </div>\
        </div>\
        <div class="settings-section">\
          <div class="settings-label">行间距 <span class="line-height-value">' + currentSettings.lineHeight + '</span></div>\
          <div class="settings-slider">\
            <button class="slider-btn minus" data-action="lineHeight" data-delta="-0.2">-</button>\
            <input type="range" class="slider-input" id="lineHeightSlider" min="1.3" max="2.5" step="0.2" value="' + currentSettings.lineHeight + '">\
            <button class="slider-btn plus" data-action="lineHeight" data-delta="0.2">+</button>\
          </div>\
        </div>\
        <div class="settings-section">\
          <button class="reset-btn">恢复默认</button>\
        </div>\
      </div>\
    ';

    document.body.appendChild(settingsOverlay);
    document.body.appendChild(settingsPanel);

    // Bind events
    settingsPanel.querySelector('.settings-close').addEventListener('click', closePanel);

    // Theme buttons
    var themeBtns = settingsPanel.querySelectorAll('.theme-btn');
    themeBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        setTheme(this.getAttribute('data-theme'));
      });
    });

    // Font size slider
    var fontSlider = settingsPanel.querySelector('#fontSizeSlider');
    fontSlider.addEventListener('input', function() {
      setFontSize(parseInt(this.value, 10));
    });

    // Line height slider
    var lineSlider = settingsPanel.querySelector('#lineHeightSlider');
    lineSlider.addEventListener('input', function() {
      setLineHeight(parseFloat(this.value));
    });

    // +/- buttons
    var sliderBtns = settingsPanel.querySelectorAll('.slider-btn');
    sliderBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var action = this.getAttribute('data-action');
        var delta = parseFloat(this.getAttribute('data-delta'));
        if (action === 'fontSize') {
          setFontSize(currentSettings.fontSize + delta);
        } else if (action === 'lineHeight') {
          setLineHeight(currentSettings.lineHeight + delta);
        }
      });
    });

    // Reset button
    settingsPanel.querySelector('.reset-btn').addEventListener('click', resetSettings);

    updatePanelUI();
  }

  function togglePanel() {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function openPanel() {
    isOpen = true;
    settingsPanel.classList.add('active');
    settingsOverlay.classList.add('active');
  }

  function closePanel() {
    isOpen = false;
    settingsPanel.classList.remove('active');
    settingsOverlay.classList.remove('active');
  }

  function setTheme(themeName) {
    if (!themes[themeName]) return;
    currentSettings.theme = themeName;
    applySettings();
    saveSettings();
    updatePanelUI();
  }

  function setFontSize(size) {
    size = Math.max(14, Math.min(28, size));
    currentSettings.fontSize = size;
    applySettings();
    saveSettings();
    updatePanelUI();
  }

  function setLineHeight(height) {
    height = Math.max(1.3, Math.min(2.5, height));
    height = Math.round(height * 10) / 10;
    currentSettings.lineHeight = height;
    applySettings();
    saveSettings();
    updatePanelUI();
  }

  function resetSettings() {
    currentSettings = Object.assign({}, defaultSettings);
    applySettings();
    saveSettings();
    updatePanelUI();
  }

  function applySettings() {
    var theme = themes[currentSettings.theme];
    var root = document.documentElement;

    root.style.setProperty('--reader-bg', theme.bg);
    root.style.setProperty('--reader-text', theme.text);
    root.style.setProperty('--reader-header-bg', theme.headerBg);
    root.style.setProperty('--reader-sidebar-bg', theme.sidebarBg);
    root.style.setProperty('--reader-link', theme.linkColor);
    root.style.setProperty('--reader-border', theme.borderColor);
    root.style.setProperty('--reader-font-size', currentSettings.fontSize + 'px');
    root.style.setProperty('--reader-line-height', currentSettings.lineHeight);

    document.body.setAttribute('data-theme', currentSettings.theme);
  }

  function updatePanelUI() {
    if (!settingsPanel) return;

    // Update theme buttons
    var themeBtns = settingsPanel.querySelectorAll('.theme-btn');
    themeBtns.forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === currentSettings.theme);
    });

    // Update font size
    var fontSlider = settingsPanel.querySelector('#fontSizeSlider');
    var fontValue = settingsPanel.querySelector('.font-size-value');
    if (fontSlider) fontSlider.value = currentSettings.fontSize;
    if (fontValue) fontValue.textContent = currentSettings.fontSize + 'px';

    // Update line height
    var lineSlider = settingsPanel.querySelector('#lineHeightSlider');
    var lineValue = settingsPanel.querySelector('.line-height-value');
    if (lineSlider) lineSlider.value = currentSettings.lineHeight;
    if (lineValue) lineValue.textContent = currentSettings.lineHeight.toFixed(1);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
