'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datavis = function () {
  _createClass(Datavis, [{
    key: '_setListeners',
    value: function _setListeners() {}
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

    this.root = document.querySelector(props.selector);
    this._setListeners();
    this._render();
  }

  _createClass(Datavis, [{
    key: 'render',
    value: function render() {
      return function () {
        var _elem = document.createElement('div');

        _elem.setAttribute('class', 'container');

        _elem.appendChild(document.createTextNode('\n        '));

        var _expr = new MapComponent({
          selector: '.map',
          getPolygonClassName: function getPolygonClassName() {
            return 'poly';
          }
        }),
            _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

        if (_res instanceof Array) {
          for (var _i2 = 0; _i2 < _res.length; _i2 += 1) {
            _elem.appendChild(_res[_i2] instanceof Node || _res[_i2] instanceof Array ? _res[_i2] : document.createTextNode(_res[_i2]));
          }
        } else _elem.appendChild(_res);

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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapComponent = function () {
  _createClass(MapComponent, [{
    key: '_setListeners',
    value: function _setListeners() {
      window.addEventListener('setFeatures', this._handleEvent);
    }
  }, {
    key: '_render',
    value: function _render() {
      return Object.assign(this.render(), { didMount: this.didMount.bind(this) });
    }
  }], [{
    key: 'getFeaturesBox',
    value: function getFeaturesBox(featureBounds) {
      var errors = [Math.abs(featureBounds[0][0]) === Infinity, Math.abs(featureBounds[0][1]) === Infinity, Math.abs(featureBounds[1][0]) === Infinity, Math.abs(featureBounds[1][1]) === Infinity];
      if (errors.includes(true)) {
        throw new Error('Incorrect feature bounds values.');
      }
      return {
        x: featureBounds[0][0],
        y: featureBounds[0][1],
        width: featureBounds[1][0] - featureBounds[0][0],
        height: featureBounds[1][1] - featureBounds[0][1]
      };
    }
  }, {
    key: 'fitGeoInside',
    value: function fitGeoInside(featureBounds, width, height) {
      var bbox = MapComponent.getFeaturesBox(featureBounds);
      var scale = 1 / Math.max(bbox.width / width, bbox.height / height);
      var trans = [-(bbox.x + bbox.width / 2) * scale + width / 2, -(bbox.y + bbox.height / 2) * scale + height / 2];

      return { scale: scale, trans: trans };
    }
  }, {
    key: 'capitalize',
    value: function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }]);

  function MapComponent(props) {
    var _this = this;

    _classCallCheck(this, MapComponent);

    this._handleEvent = function (e) {
      _this[e.type].apply(_this, _toConsumableArray(e.detail)) || _this._render();
      _this.didUpdate();
    };

    this.features = [];

    this.props = props;
    this._setListeners();
    this.willMount();
    return this._render();
  }

  _createClass(MapComponent, [{
    key: 'setFeatures',
    value: function setFeatures(topo) {
      this.features = topo.features;
    }
  }, {
    key: 'willMount',
    value: function willMount() {
      fetch('world.topo.json').then(function (res) {
        return res.ok ? res.json() : Promise.reject(res.status);
      }).then(function (topo) {
        return dispatch('setFeatures', topojson.feature(topo, topo.objects.countries));
      });
    }
  }, {
    key: 'didMount',
    value: function didMount() {}
  }, {
    key: 'didUpdate',
    value: function didUpdate() {
      var _props = this.props,
          selector = _props.selector,
          getPolygonClassName = _props.getPolygonClassName,
          showTooltipCallback = _props.showTooltipCallback,
          hideTooltipCallback = _props.hideTooltipCallback,
          customProjection = _props.customProjection;

      if (this.features.length === 0) {
        return;
      }
      var d3Container = d3.select(selector);
      var containerComputedStyle = window.getComputedStyle(d3Container.node());
      var width = parseInt(containerComputedStyle.width);
      var height = parseInt(containerComputedStyle.height);

      var svg = d3Container.append('svg').attr('width', width).attr('height', height);

      var geoParent = svg.append('g');
      var container = geoParent.append('g');
      var projection = customProjection ? d3['geo' + MapComponent.capitalize(customProjection)]() : d3.geoMercator();
      var path = d3.geoPath().projection(projection);

      var polygons = container.selectAll('path').data(this.features).enter().append('path').attr('class', function (d) {
        return 'polygon ' + getPolygonClassName(d);
      }).attr('d', path);

      if (typeof showTooltipCallback !== 'undefined') {
        polygons.on('mousemove', function (d) {
          return showTooltipCallback(d, d3.event.clientX + 10, d3.event.clientY + window.scrollY + 10);
        }).on('mouseout', function () {
          return hideTooltipCallback();
        });
      }

      var collection = { 'type': 'FeatureCollection', 'features': this.features };
      var featureBounds = path.bounds(collection);

      var _MapComponent$fitGeoI = MapComponent.fitGeoInside(featureBounds, width, height),
          scale = _MapComponent$fitGeoI.scale,
          trans = _MapComponent$fitGeoI.trans;

      container.attr('transform', 'translate(' + trans + ') scale(' + scale + ')');

      container.selectAll('path').style('stroke-width', .5 / scale);
    }
  }, {
    key: 'render',
    value: function render() {
      return function () {
        var _elem = document.createElement('div');

        _elem.setAttribute('class', 'map');

        return _elem;
      }();
    }
  }]);

  return MapComponent;
}();
