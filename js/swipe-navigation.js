/**
 * Chapter Navigation
 * Supports keyboard arrows and mobile swipe gestures
 */
(function() {
  'use strict';

  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent) || window.innerWidth <= 480;

  var touchStartX = 0;
  var touchStartY = 0;
  var touchEndX = 0;
  var touchEndY = 0;
  var minSwipeDistance = 80;
  var maxVerticalDistance = 100;

  var prevUrl = null;
  var nextUrl = null;
  var leftIndicator = null;
  var rightIndicator = null;

  function init() {
    // Get navigation URLs from pagination links
    var prevLink = document.querySelector('.pagination .prev a[href]');
    var nextLink = document.querySelector('.pagination .next a[href]');

    if (prevLink && prevLink.getAttribute('href')) {
      prevUrl = prevLink.getAttribute('href');
    }
    if (nextLink && nextLink.getAttribute('href')) {
      nextUrl = nextLink.getAttribute('href');
    }

    // Don't initialize if no navigation available
    if (!prevUrl && !nextUrl) return;

    // Keyboard navigation works on all devices
    bindKeyboardEvents();

    // Touch navigation only on mobile
    if (isMobile) {
      createIndicators();
      bindTouchEvents();
      showSwipeHint();
    }
  }

  function bindKeyboardEvents() {
    document.addEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(e) {
    // Ignore if user is typing in an input field
    var tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
      return;
    }

    // Left arrow -> previous page
    if (e.key === 'ArrowLeft' && prevUrl) {
      e.preventDefault();
      navigateTo(prevUrl);
    }
    // Right arrow -> next page
    else if (e.key === 'ArrowRight' && nextUrl) {
      e.preventDefault();
      navigateTo(nextUrl);
    }
  }

  function createIndicators() {
    // Create left indicator (previous chapter)
    if (prevUrl) {
      leftIndicator = document.createElement('div');
      leftIndicator.className = 'swipe-indicator left';
      leftIndicator.innerHTML = '&#8592;';
      leftIndicator.setAttribute('aria-hidden', 'true');
      document.body.appendChild(leftIndicator);
    }

    // Create right indicator (next chapter)
    if (nextUrl) {
      rightIndicator = document.createElement('div');
      rightIndicator.className = 'swipe-indicator right';
      rightIndicator.innerHTML = '&#8594;';
      rightIndicator.setAttribute('aria-hidden', 'true');
      document.body.appendChild(rightIndicator);
    }
  }

  function showSwipeHint() {
    // Show hint only once per session
    if (sessionStorage.getItem('swipeHintShown')) return;

    var hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.textContent = '左右滑动翻页';
    document.body.appendChild(hint);

    setTimeout(function() {
      hint.classList.add('show');
    }, 1000);

    setTimeout(function() {
      hint.classList.remove('show');
      setTimeout(function() {
        if (hint.parentNode) {
          hint.parentNode.removeChild(hint);
        }
      }, 300);
    }, 4000);

    sessionStorage.setItem('swipeHintShown', 'true');
  }

  function bindTouchEvents() {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    if (!touchStartX) return;

    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;
    var diffX = touchStartX - currentX;
    var diffY = Math.abs(touchStartY - currentY);

    // Only show indicators for horizontal swipes
    if (diffY > maxVerticalDistance) return;

    if (diffX > 30 && rightIndicator) {
      rightIndicator.classList.add('active');
      if (leftIndicator) leftIndicator.classList.remove('active');
    } else if (diffX < -30 && leftIndicator) {
      leftIndicator.classList.add('active');
      if (rightIndicator) rightIndicator.classList.remove('active');
    } else {
      if (leftIndicator) leftIndicator.classList.remove('active');
      if (rightIndicator) rightIndicator.classList.remove('active');
    }
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    var diffX = touchStartX - touchEndX;
    var diffY = Math.abs(touchStartY - touchEndY);

    // Hide indicators
    if (leftIndicator) leftIndicator.classList.remove('active');
    if (rightIndicator) rightIndicator.classList.remove('active');

    // Check if it's a valid horizontal swipe
    if (Math.abs(diffX) < minSwipeDistance || diffY > maxVerticalDistance) {
      resetTouch();
      return;
    }

    if (diffX > 0 && nextUrl) {
      // Swipe left -> go to next chapter
      navigateTo(nextUrl);
    } else if (diffX < 0 && prevUrl) {
      // Swipe right -> go to previous chapter
      navigateTo(prevUrl);
    }

    resetTouch();
  }

  function navigateTo(url) {
    window.location.href = url;
  }

  function resetTouch() {
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
