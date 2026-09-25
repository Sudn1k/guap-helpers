/*
 * dc-lite.js — маленький движок, который оживляет экраны прототипа без сервера.
 * Понимает то, что используется в макетах:
 *   {{ путь }} в тексте и атрибутах, <sc-if value>, <sc-for list as>,
 *   <dc-import name ...props>, onClick / onInput / onChange, setState.
 * Шаблон каждого экрана лежит в <template id="tpl-ИмяЭкрана">,
 * логика — в js/components/ИмяЭкрана.js.
 */
(function () {
  'use strict';

  var registry = {};
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var SINGLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var BOOL_ATTRS = { disabled: 1, checked: 1, hidden: 1, selected: 1, readonly: 1, required: 1 };

  function DCLogic(props) {
    this.props = props || {};
    this.state = {};
  }
  DCLogic.prototype.setState = function (patch) {
    var next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, next);
    if (this.__schedule) this.__schedule();
  };
  DCLogic.prototype.forceUpdate = function () {
    if (this.__schedule) this.__schedule();
  };
  DCLogic.prototype.renderVals = function () { return {}; };
  window.DCLogic = DCLogic;

  function lookup(expr, scope) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    if (/^'.*'$/.test(expr) || /^".*"$/.test(expr)) return expr.slice(1, -1);
    var parts = expr.split('.');
    var v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  function interpolate(str, scope) {
    return str.replace(HOLE, function (_, e) {
      var v = lookup(e, scope);
      return v == null ? '' : String(v);
    });
  }

  function propName(attr) {
    return attr.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
  }

  function createInstance(name, props) {
    var Cls = registry[name];
    if (!Cls) throw new Error('Компонент не найден: ' + name);
    var inst = new Cls(props || {});
    inst.props = props || {};
    if (!inst.state) inst.state = {};
    inst.__name = name;
    inst.__children = {};
    return inst;
  }

  function renderComponent(inst, schedule) {
    inst.__schedule = schedule;
    var tpl = document.getElementById('tpl-' + inst.__name);
    if (!tpl) throw new Error('Шаблон не найден: ' + inst.__name);
    var vals = inst.renderVals() || {};
    var ctx = { owner: inst, schedule: schedule, idx: 0 };
    var frag = document.createDocumentFragment();
    renderChildren(tpl.content, vals, ctx, frag);
    return frag;
  }

  function renderChildren(parent, scope, ctx, out) {
    var kids = parent.childNodes;
    for (var i = 0; i < kids.length; i++) renderNode(kids[i], scope, ctx, out);
  }

  function renderNode(node, scope, ctx, out) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      out.appendChild(document.createTextNode(t.indexOf('{{') >= 0 ? interpolate(t, scope) : t));
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.localName;

    if (tag === 'helmet') return;

    if (tag === 'sc-if') {
      var cond = node.getAttribute('value') || '';
      var m = cond.match(SINGLE);
      var ok = m ? lookup(m[1], scope) : cond;
      if (ok) renderChildren(node, scope, ctx, out);
      return;
    }

    if (tag === 'sc-for') {
      var lm = (node.getAttribute('list') || '').match(SINGLE);
      var list = lm ? lookup(lm[1], scope) : null;
      var as = node.getAttribute('as') || 'item';
      if (list && list.length) {
        for (var j = 0; j < list.length; j++) {
          var child = Object.create(scope);
          child[as] = list[j];
          child.$index = j;
          renderChildren(node, child, ctx, out);
        }
      }
      return;
    }

    if (tag === 'dc-import') {
      var name = node.getAttribute('name');
      var props = {};
      for (var a = 0; a < node.attributes.length; a++) {
        var at = node.attributes[a];
        if (at.name === 'name' || at.name.indexOf('hint-') === 0) continue;
        var sm = at.value.match(SINGLE);
        props[propName(at.name)] = sm ? lookup(sm[1], scope) : (at.value.indexOf('{{') >= 0 ? interpolate(at.value, scope) : at.value);
      }
      var key = name + '#' + (ctx.idx++);
      var inst = ctx.owner.__children[key];
      if (!inst) {
        inst = createInstance(name, props);
        ctx.owner.__children[key] = inst;
      } else {
        inst.props = props;
      }
      out.appendChild(renderComponent(inst, ctx.schedule));
      return;
    }

    var el = node.namespaceURI && node.namespaceURI !== 'http://www.w3.org/1999/xhtml'
      ? document.createElementNS(node.namespaceURI, node.tagName)
      : document.createElement(tag);

    var after = [];
    for (var k = 0; k < node.attributes.length; k++) {
      var attr = node.attributes[k];
      var aname = attr.name;
      var val = attr.value;
      if (val.indexOf('{{') < 0) { el.setAttribute(aname, val); continue; }
      var single = val.match(SINGLE);
      if (!single) { el.setAttribute(aname, interpolate(val, scope)); continue; }
      var raw = lookup(single[1], scope);
      if (aname.indexOf('on') === 0 && typeof raw === 'function') {
        el.addEventListener(aname.slice(2).toLowerCase(), raw);
      } else if (BOOL_ATTRS[aname]) {
        if (raw) el.setAttribute(aname, '');
        if (aname === 'checked') after.push(function (e, r) { return function () { e.checked = !!r; }; }(el, raw));
      } else if (aname === 'value') {
        var sv = raw == null ? '' : String(raw);
        el.setAttribute('value', sv);
        after.push(function (e, s) { return function () { e.value = s; }; }(el, sv));
      } else if (raw == null) {
        // пропускаем пустое значение
      } else {
        el.setAttribute(aname, String(raw));
      }
    }
    renderChildren(node, scope, ctx, el);
    for (var q = 0; q < after.length; q++) after[q]();
    out.appendChild(el);
  }

  function pathOf(el, root) {
    var p = [];
    while (el && el !== root && el.parentNode) {
      p.unshift(Array.prototype.indexOf.call(el.parentNode.children, el));
      el = el.parentNode;
    }
    return el === root ? p : null;
  }
  function nodeAt(root, p) {
    var n = root;
    for (var i = 0; n && i < p.length; i++) n = n.children[p[i]];
    return n;
  }

  function saveUI(root) {
    var s = { scroll: [], focus: null };
    var all = root.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (e.scrollTop || e.scrollLeft) s.scroll.push([pathOf(e, root), e.scrollTop, e.scrollLeft]);
    }
    var a = document.activeElement;
    if (a && root.contains(a)) {
      s.focus = { path: pathOf(a, root), start: a.selectionStart, end: a.selectionEnd };
    }
    return s;
  }
  function restoreUI(root, s) {
    s.scroll.forEach(function (r) {
      var e = r[0] && nodeAt(root, r[0]);
      if (e) { e.scrollTop = r[1]; e.scrollLeft = r[2]; }
    });
    if (s.focus && s.focus.path) {
      var f = nodeAt(root, s.focus.path);
      if (f && f.focus) {
        f.focus({ preventScroll: true });
        try { if (s.focus.start != null) f.setSelectionRange(s.focus.start, s.focus.end); } catch (err) { /* не текстовое поле */ }
      }
    }
  }

  function mount(name, container, props) {
    var inst = createInstance(name, props);
    var pending = false;
    function render() {
      var ui = saveUI(container);
      var frag = renderComponent(inst, schedule);
      container.replaceChildren(frag);
      restoreUI(container, ui);
    }
    function schedule() {
      if (pending) return;
      pending = true;
      Promise.resolve().then(function () { pending = false; render(); });
    }
    render();
    return inst;
  }

  // ссылки-заглушки «#» не прыгают наверх страницы
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  window.DCLite = {
    define: function (name, Cls) { registry[name] = Cls; },
    mount: mount
  };
})();
