(function () {
  var box = document.getElementById('filter');
  var list = document.getElementById('doclist');
  var count = document.getElementById('filtercount');
  if (!box || !list) return;
  var rows = Array.prototype.slice.call(list.children);
  var total = rows.length;

  function apply() {
    var q = box.value.trim().toLowerCase();
    var shown = 0;
    rows.forEach(function (r) {
      var hit = !q || r.textContent.toLowerCase().indexOf(q) !== -1;
      r.style.display = hit ? '' : 'none';
      if (hit) shown++;
    });
    if (count) count.textContent = q ? (shown + ' of ' + total + ' records') : (total + ' records');
  }

  box.addEventListener('input', apply);
  apply();
})();
