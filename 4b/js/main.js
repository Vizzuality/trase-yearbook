'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datavis = function () {
  _createClass(Datavis, [{
    key: '_setListeners',
    value: function _setListeners() {
      window.addEventListener('setActive', this._handleEvent);
    }
  }, {
    key: '_render',
    value: function _render() {
      this.root.innerHTML = '';
      this.root.appendChild(this.render());
    }
  }]);

  function Datavis(props) {
    var _this = this;

    _classCallCheck(this, Datavis);

    this._handleEvent = function (e) {
      _this[e.type].apply(_this, _toConsumableArray(e.detail)) || _this._render();
    };

    this.loop = null;
    this.active = 1975;
    this.options = [1975, 1985, 1995, 2005, 2015];

    this.setActive = function (active, loop) {
      _this.active = active;
      if (!loop && _this.interval) {
        clearInterval(_this.interval);
      }
    };

    this.root = document.querySelector(props.selector);
    this._setListeners();
    this.didMount();
    this.render();
  }

  _createClass(Datavis, [{
    key: 'didMount',
    value: function didMount() {
      var _this2 = this;

      this.interval = setInterval(function () {
        var index = _this2.options.indexOf(_this2.active);
        var option = _this2.options[index + 1] || _this2.options[0];
        dispatch('setActive', option, true);
      }, 1000);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return function () {
        var _elem = document.createElement('div');

        _elem.setAttribute('class', 'container');

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem2 = document.createElement('h1');

        _elem2.setAttribute('class', 'title');

        _elem2.appendChild(document.createTextNode('\n          Pace of expansion and invesment'));

        var _elem3 = document.createElement('br');

        _elem2.appendChild(_elem3);

        _elem2.appendChild(document.createTextNode('in soy industry\n        '));

        _elem.appendChild(_elem2);

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem4 = document.createElement('div');

        _elem4.setAttribute('class', 'map');

        _elem4.appendChild(document.createTextNode('\n          '));

        var _expr = Array.from(Array(3).keys()).map(function (index) {
          return function () {
            var _elem6 = document.createElement('div');

            _elem6.setAttribute('class', 'map-item');

            _elem6.setAttribute('style', 'background-image: url(assets/' + _this3.active + '-' + index + '.jpg)');

            return _elem6;
          }();
        }),
            _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

        if (_res instanceof Array) {
          for (var _i3 = 0; _i3 < _res.length; _i3 += 1) {
            _elem4.appendChild(_res[_i3] instanceof Node || _res[_i3] instanceof Array ? _res[_i3] : document.createTextNode(_res[_i3]));
          }
        } else _elem4.appendChild(_res);

        _elem4.appendChild(document.createTextNode('\n          '));

        var _elem5 = document.createElement('img');

        _elem5.setAttribute('class', 'map-legend');

        _elem5.setAttribute('alt', 'map legend');

        _elem5.setAttribute('src', 'assets/legend.svg');

        _elem4.appendChild(_elem5);

        _elem4.appendChild(document.createTextNode('\n        '));

        _elem.appendChild(_elem4);

        _elem.appendChild(document.createTextNode('\n        '));

        var _expr2 = YearSelector({ options: _this3.options, title: "select a year", active: _this3.active }),
            _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

        if (_res2 instanceof Array) {
          for (var _i4 = 0; _i4 < _res2.length; _i4 += 1) {
            _elem.appendChild(_res2[_i4] instanceof Node || _res2[_i4] instanceof Array ? _res2[_i4] : document.createTextNode(_res2[_i4]));
          }
        } else _elem.appendChild(_res2);

        _elem.appendChild(document.createTextNode('\n      '));

        return _elem;
      }();
    }
  }]);

  return Datavis;
}();

document.addEventListener("DOMContentLoaded", function () {
  return new Datavis({ selector: '#root' });
});
window.dispatch = function (event) {
  for (var _len = arguments.length, detail = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    detail[_key - 1] = arguments[_key];
  }

  return dispatchEvent(new CustomEvent(event, { detail: detail }));
};
"use strict";

function YearSelector(props) {
  return function () {
    var _elem = document.createElement("div");

    _elem.setAttribute("class", "year-selector");

    _elem.appendChild(document.createTextNode("\n        "));

    var _elem2 = document.createElement("p");

    _elem2.setAttribute("class", "year-selector-title");

    var _expr = props.title,
        _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

    if (_res instanceof Array) {
      for (var _i3 = 0; _i3 < _res.length; _i3 += 1) {
        _elem2.appendChild(_res[_i3] instanceof Node || _res[_i3] instanceof Array ? _res[_i3] : document.createTextNode(_res[_i3]));
      }
    } else _elem2.appendChild(_res);

    _elem.appendChild(_elem2);

    _elem.appendChild(document.createTextNode("\n        "));

    var _elem3 = document.createElement("div");

    _elem3.setAttribute("class", "year-selector-list");

    _elem3.appendChild(document.createTextNode("\n          "));

    var _expr2 = props.options.map(function (year) {
      return function () {
        var _elem4 = document.createElement("div");

        _elem4.setAttribute("class", "year-selector-item");

        _elem4.setAttribute("onClick", "dispatch('setActive', " + year + ")");

        _elem4.appendChild(document.createTextNode("\n              "));

        var _elem5 = document.createElement("div");

        _elem5.setAttribute("class", "year-selector-circle-container");

        _elem5.appendChild(document.createTextNode("\n                "));

        var _elem6 = document.createElement("b");

        _elem6.setAttribute("class", "year-selector-circle " + (props.active === year ? 'active' : ''));

        _elem5.appendChild(_elem6);

        _elem5.appendChild(document.createTextNode("\n              "));

        _elem4.appendChild(_elem5);

        _elem4.appendChild(document.createTextNode("\n              "));

        var _elem7 = document.createElement("p");

        _elem7.setAttribute("class", "year-selector-label");

        var _expr3 = year,
            _res3 = _expr3 instanceof Node || _expr3 instanceof Array ? _expr3 : document.createTextNode(_expr3);

        if (_res3 instanceof Array) {
          for (var _i5 = 0; _i5 < _res3.length; _i5 += 1) {
            _elem7.appendChild(_res3[_i5] instanceof Node || _res3[_i5] instanceof Array ? _res3[_i5] : document.createTextNode(_res3[_i5]));
          }
        } else _elem7.appendChild(_res3);

        _elem4.appendChild(_elem7);

        _elem4.appendChild(document.createTextNode("\n            "));

        return _elem4;
      }();
    }),
        _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

    if (_res2 instanceof Array) {
      for (var _i6 = 0; _i6 < _res2.length; _i6 += 1) {
        _elem3.appendChild(_res2[_i6] instanceof Node || _res2[_i6] instanceof Array ? _res2[_i6] : document.createTextNode(_res2[_i6]));
      }
    } else _elem3.appendChild(_res2);

    _elem3.appendChild(document.createTextNode("\n        "));

    _elem.appendChild(_elem3);

    _elem.appendChild(document.createTextNode("\n      "));

    return _elem;
  }();
}
