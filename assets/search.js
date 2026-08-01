(function () {
  var box = document.getElementById('q');
  var out = document.getElementById('results');
  var count = document.getElementById('count');
  var docs = window.UANDOCS || [];
  if (!box || !out) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function render(hits, q) {
    if (!q) {
      out.innerHTML = '<div class="empty">Type to search ' + docs.length + ' published records.</div>';
      count.textContent = '';
      return;
    }
    count.textContent = hits.length + ' of ' + docs.length + ' records';
    if (!hits.length) {
      out.innerHTML = '<div class="empty">No record matches &ldquo;' + esc(q) + '&rdquo;.</div>';
      return;
    }
    out.innerHTML = hits.map(function (d) {
      return '<div class="resitem">'
        + '<a class="resitem_t" href="' + esc(d.u) + '">' + esc(d.t) + '</a>'
        + '<div class="resitem_m">' + esc(d.c) + ' &middot; ' + esc(d.r) + ' &middot; ' + esc(d.k)
        + ' &middot; ' + esc(d.d) + '</div>'
        + '<div class="docrow_sum">' + esc(d.s) + '</div>'
        + '</div>';
    }).join('');
  }

  function run() {
    var q = box.value.trim().toLowerCase();
    var terms = q.split(/\s+/).filter(Boolean);
    var hits = !terms.length ? [] : docs.filter(function (d) {
      return terms.every(function (t) { return d.x.indexOf(t) !== -1; });
    });
    render(hits, q);
    if (history.replaceState) {
      history.replaceState(null, '', q ? ('?q=' + encodeURIComponent(box.value.trim())) : location.pathname);
    }
  }

  var initial = new URLSearchParams(location.search).get('q');
  if (initial) box.value = initial;
  box.addEventListener('input', run);
  box.focus();
  run();
})();
