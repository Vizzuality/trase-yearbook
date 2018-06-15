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
  }]);

  function Datavis(selector) {
    var _this = this;

    _classCallCheck(this, Datavis);

    this._handleEvent = function (e) {
      return _this[e.type].apply(_this, _toConsumableArray(e.detail)) || _this.render();
    };

    this.active = 2015;
    this.title = "Pace of expansion and invesment in soy industry";
    this.options = [1975, 1985, 1995, 2005, 2015];

    this.setActive = function (active) {
      _this.active = active;
    };

    this.root = document.querySelector(selector);
    this.render();
    this._setListeners();
  }

  _createClass(Datavis, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.root.innerHTML = '';
      console.log(this.active);
      this.root.appendChild(function () {
        var _elem = document.createElement('div');

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem2 = document.createElement('p');

        var _expr = _this2.title,
            _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

        if (_res instanceof Array) {
          for (var _i3 = 0; _i3 < _res.length; _i3 += 1) {
            _elem2.appendChild(_res[_i3] instanceof Node || _res[_i3] instanceof Array ? _res[_i3] : document.createTextNode(_res[_i3]));
          }
        } else _elem2.appendChild(_res);

        _elem.appendChild(_elem2);

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem3 = document.createElement('div');

        _elem3.setAttribute('class', 'map');

        _elem3.setAttribute('style', 'background-image: url(assets/' + _this2.active + '.jpg)');

        _elem.appendChild(_elem3);

        _elem.appendChild(document.createTextNode('\n        '));

        var _expr2 = YearSelector({ options: _this2.options, title: "select a year", setActive: _this2.setActive }),
            _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

        if (_res2 instanceof Array) {
          for (var _i4 = 0; _i4 < _res2.length; _i4 += 1) {
            _elem.appendChild(_res2[_i4] instanceof Node || _res2[_i4] instanceof Array ? _res2[_i4] : document.createTextNode(_res2[_i4]));
          }
        } else _elem.appendChild(_res2);

        _elem.appendChild(document.createTextNode('\n      '));

        return _elem;
      }());
    }
  }]);

  return Datavis;
}();

document.addEventListener("DOMContentLoaded", function () {
  return new Datavis('#root');
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

    _elem.appendChild(document.createTextNode("\n      "));

    var _elem2 = document.createElement("p");

    var _expr = props.title,
        _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

    if (_res instanceof Array) {
      for (var _i3 = 0; _i3 < _res.length; _i3 += 1) {
        _elem2.appendChild(_res[_i3] instanceof Node || _res[_i3] instanceof Array ? _res[_i3] : document.createTextNode(_res[_i3]));
      }
    } else _elem2.appendChild(_res);

    _elem.appendChild(_elem2);

    _elem.appendChild(document.createTextNode("\n      "));

    var _expr2 = props.options.map(function (year) {
      return function () {
        var _elem3 = document.createElement("button");

        _elem3.setAttribute("data-value", year);

        _elem3.setAttribute("onclick", "dispatch('setActive', " + year + ")");

        var _expr3 = year,
            _res3 = _expr3 instanceof Node || _expr3 instanceof Array ? _expr3 : document.createTextNode(_expr3);

        if (_res3 instanceof Array) {
          for (var _i5 = 0; _i5 < _res3.length; _i5 += 1) {
            _elem3.appendChild(_res3[_i5] instanceof Node || _res3[_i5] instanceof Array ? _res3[_i5] : document.createTextNode(_res3[_i5]));
          }
        } else _elem3.appendChild(_res3);

        return _elem3;
      }();
    }),
        _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

    if (_res2 instanceof Array) {
      for (var _i6 = 0; _i6 < _res2.length; _i6 += 1) {
        _elem.appendChild(_res2[_i6] instanceof Node || _res2[_i6] instanceof Array ? _res2[_i6] : document.createTextNode(_res2[_i6]));
      }
    } else _elem.appendChild(_res2);

    _elem.appendChild(document.createTextNode("\n    "));

    return _elem;
  }();
}
