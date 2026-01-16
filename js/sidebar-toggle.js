/**
 * Sidebar Toggle - Desktop collapsible sidebar
 * Allows users to collapse/expand the sidebar for focused reading
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'lingaoqiming_sidebar_collapsed';
  var sidebar = null;
  var toggleBtn = null;

  function init() {
    sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    toggleBtn = sidebar.querySelector('.sidebar-toggle');
    if (!toggleBtn) return;

    loadState();
    bindEvents();
  }

  function loadState() {
    try {
      var collapsed = localStorage.getItem(STORAGE_KEY) === 'true';
      if (collapsed) {
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
        updateAriaLabel(true);
      }
    } catch (e) {
      console.warn('Failed to load sidebar state:', e);
    }
  }

  function saveState(collapsed) {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save sidebar state:', e);
    }
  }

  function bindEvents() {
    toggleBtn.addEventListener('click', toggle);
  }

  function toggle() {
    var isCollapsed = sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    updateAriaLabel(isCollapsed);
    saveState(isCollapsed);
  }

  function updateAriaLabel(collapsed) {
    var label = collapsed ? '展开目录' : '收起目录';
    toggleBtn.setAttribute('aria-label', label);
    toggleBtn.setAttribute('title', label);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
