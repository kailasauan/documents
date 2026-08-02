(function () {
  var guarded = document.querySelector('.guarded');

  function isEditable(t) {
    if (!t) return false;
    var tag = t.tagName ? t.tagName.toLowerCase() : '';
    return tag === 'input' || tag === 'textarea' || t.isContentEditable;
  }

  function selectionTouches(el) {
    if (!el) return false;
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    for (var i = 0; i < sel.rangeCount; i++) {
      var r = sel.getRangeAt(i);
      if (el === r.commonAncestorContainer || el.contains(r.commonAncestorContainer)) return true;
      if (typeof r.intersectsNode === 'function' && r.intersectsNode(el)) return true;
    }
    return false;
  }

  function guardClipboard(e) {
    if (!selectionTouches(guarded)) return;
    e.preventDefault();
    if (e.clipboardData) e.clipboardData.setData('text/plain', guarded.dataset.guardCite || '');
  }

  if (guarded) {
    guarded.addEventListener('selectstart', function (e) { e.preventDefault(); });
    guarded.addEventListener('dragstart', function (e) { e.preventDefault(); });
    guarded.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('copy', guardClipboard);
    document.addEventListener('cut', guardClipboard);
  }

  // Ctrl/Cmd+C and +X are only blocked when the current selection reaches into the guarded
  // transcription, so the metadata table, citation panel and reference number stay copyable by
  // keyboard exactly as they are by mouse. Select-all, save, print and view-source act on the
  // whole page rather than a selection, so those are blocked outright on this page.
  document.addEventListener('keydown', function (e) {
    if (isEditable(e.target)) return;
    var ctrl = e.ctrlKey || e.metaKey;
    var k = e.key ? e.key.toLowerCase() : '';

    if (ctrl && !e.shiftKey && (k === 'c' || k === 'x') && selectionTouches(guarded)) {
      e.preventDefault();
      return;
    }
    if (ctrl && !e.shiftKey && (k === 'a' || k === 's' || k === 'p' || k === 'u')) {
      e.preventDefault();
      return;
    }
    if (k === 'f12' || (ctrl && e.shiftKey && (k === 'i' || k === 'j' || k === 'c'))) {
      e.preventDefault();
    }
  });

  function flash(btn, label) {
    var original = btn.textContent;
    btn.textContent = label;
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = original;
      btn.disabled = false;
    }, 1600);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.copybtn[data-copy]'), function (btn) {
    btn.addEventListener('click', function () {
      if (!navigator.clipboard || !navigator.clipboard.writeText) return;
      navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
        flash(btn, 'Copied');
      });
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll('.copybtn[data-copy-image]'), function (btn) {
    btn.addEventListener('click', function () {
      var src = btn.getAttribute('data-copy-image');
      if (!navigator.clipboard || !window.ClipboardItem) return;
      fetch(src)
        .then(function (r) { return r.blob(); })
        .then(function (blob) {
          var item = {};
          item[blob.type] = blob;
          return navigator.clipboard.write([new ClipboardItem(item)]);
        })
        .then(function () { flash(btn, 'Copied'); })
        .catch(function () { flash(btn, 'Copy failed'); });
    });
  });
})();
