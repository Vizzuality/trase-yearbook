"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datavis = function () {
  _createClass(Datavis, [{
    key: "_setListeners",
    value: function _setListeners() {}
  }, {
    key: "_render",
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

    this.features = [{
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[18.28125, -33.7243396617476], [16.875, -30.751277776257812], [21.09375, -33.7243396617476], [25.3125, -33.137551192346145], [29.53125, -31.95216223802496], [33.046875, -28.30438068296277], [34.453125, -21.289374355860424], [35.859375, -17.308687886770024], [40.078125, -15.961329081596647], [40.78125, -10.487811882056683], [39.375, -5.615985819155327], [39.375, -1.4061088354351594], [44.29687499999999, 2.1088986592431382], [49.92187499999999, 9.102096738726456], [50.625, 13.923403897723347], [45.703125, 11.178401873711785], [41.484375, 14.604847155053898], [40.078125, 17.97873309555617], [35.859375, 23.241346102386135], [33.75, 27.059125784374068], [31.640625, 31.353636941500987], [28.125, 32.54681317351514], [21.796875, 33.7243396617476], [18.984375, 30.751277776257812], [11.25, 36.59788913307022], [7.734374999999999, 38.272688535980976], [-0.703125, 36.59788913307022], [-8.4375, 35.460669951495305], [-11.25, 30.751277776257812], [-16.171875, 23.885837699862005], [-14.765625, 15.284185114076433], [-9.140625, 4.915832801313164], [1.40625, 6.315298538330033], [8.4375, 4.915832801313164], [9.84375, -2.108898659243126], [11.953125, -10.487811882056683], [11.25, -16.63619187839765], [14.765625, -26.431228064506424], [18.28125, -33.7243396617476]]]
      }
    }];
    this.components = {
      MapComponent: new MapComponent({
        selector: '.map',
        features: this.features,
        getPolygonClassName: function getPolygonClassName() {
          return 'poly';
        }
      })
    };

    this.root = document.querySelector(props.selector);
    this._setListeners();
    this._render();
    this.didMount();
  }

  _createClass(Datavis, [{
    key: "didMount",
    value: function didMount() {
      Object.values(this.components).forEach(function (c) {
        return c.didMount && c.didMount();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var MapComponent = this.components.MapComponent;

      return function () {
        var _elem = document.createElement("div");

        _elem.setAttribute("class", "container");

        _elem.appendChild(document.createTextNode("\n        "));

        var _expr = MapComponent,
            _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

        if (_res instanceof Array) {
          for (var _i2 = 0; _i2 < _res.length; _i2 += 1) {
            _elem.appendChild(_res[_i2] instanceof Node || _res[_i2] instanceof Array ? _res[_i2] : document.createTextNode(_res[_i2]));
          }
        } else _elem.appendChild(_res);

        _elem.appendChild(document.createTextNode("\n      "));

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapComponent = function () {
  _createClass(MapComponent, [{
    key: "_setListeners",
    value: function _setListeners() {}
  }, {
    key: "_render",
    value: function _render() {
      return Object.assign(this.render(), { didMount: this.didMount.bind(this) });
    }
  }]);

  function MapComponent(props) {
    var _this = this;

    _classCallCheck(this, MapComponent);

    this._handleEvent = function (e) {
      _this[e.type].apply(_this, _toConsumableArray(e.detail)) || _this._render();
    };

    this.features = [{
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[18.28125, -33.7243396617476], [16.875, -30.751277776257812], [21.09375, -33.7243396617476], [25.3125, -33.137551192346145], [29.53125, -31.95216223802496], [33.046875, -28.30438068296277], [34.453125, -21.289374355860424], [35.859375, -17.308687886770024], [40.078125, -15.961329081596647], [40.78125, -10.487811882056683], [39.375, -5.615985819155327], [39.375, -1.4061088354351594], [44.29687499999999, 2.1088986592431382], [49.92187499999999, 9.102096738726456], [50.625, 13.923403897723347], [45.703125, 11.178401873711785], [41.484375, 14.604847155053898], [40.078125, 17.97873309555617], [35.859375, 23.241346102386135], [33.75, 27.059125784374068], [31.640625, 31.353636941500987], [28.125, 32.54681317351514], [21.796875, 33.7243396617476], [18.984375, 30.751277776257812], [11.25, 36.59788913307022], [7.734374999999999, 38.272688535980976], [-0.703125, 36.59788913307022], [-8.4375, 35.460669951495305], [-11.25, 30.751277776257812], [-16.171875, 23.885837699862005], [-14.765625, 15.284185114076433], [-9.140625, 4.915832801313164], [1.40625, 6.315298538330033], [8.4375, 4.915832801313164], [9.84375, -2.108898659243126], [11.953125, -10.487811882056683], [11.25, -16.63619187839765], [14.765625, -26.431228064506424], [18.28125, -33.7243396617476]]]
      }
    }];

    this.props = props;
    this._setListeners();
    return this._render();
  }

  _createClass(MapComponent, [{
    key: "didMount",
    value: function didMount() {}
  }, {
    key: "render",
    value: function render() {
      return function () {
        var _elem = document.createElement("div");

        _elem.setAttribute("class", "map");

        return _elem;
      }();
    }
  }]);

  return MapComponent;
}();

document.addEventListener("DOMContentLoaded", function () {
  return new Datavis({ selector: '#root' });
});
