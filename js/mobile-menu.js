/**
 * Mobile Menu Toggle
 * Handles hamburger menu for responsive navigation based on screen width
 */
(function() {
  'use strict';

  var menuToggle = null;
  var sidebar = null;
  var overlay = null;
  var isOpen = false;
  var MOBILE_BREAKPOINT = 900; // Show hamburger menu below this width

  function isMobileView() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function init() {
    menuToggle = document.querySelector('.menu-toggle');
    sidebar = document.getElementById('sidebar');
    overlay = document.querySelector('.menu-overlay');

    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener('click', toggleMenu);

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });

    // Close menu when clicking a link
    var sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    // Handle resize events
    window.addEventListener('resize', handleResize);
    handleResize();
  }

  function handleResize() {
    if (!isMobileView() && isOpen) {
      closeMenu();
    }
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    isOpen = true;
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', '关闭目录');
    sidebar.classList.add('active');
    if (overlay) {
      overlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开目录');
    sidebar.classList.remove('active');
    if (overlay) {
      overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
