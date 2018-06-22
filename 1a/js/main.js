'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datavis = function () {
  _createClass(Datavis, [{
    key: '_setListeners',
    value: function _setListeners() {
      window.addEventListener('setFeatures', this._handleEvent);
      window.addEventListener('setCommodity', this._handleEvent);
      window.addEventListener('setSelector', this._handleEvent);
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
      _this.updateSmartComponents();
    };

    this.state = {
      commodity: 'soy',
      features: null,
      selector: false
    };

    this.onBackgroundClick = function (_ref) {
      var target = _ref.target;

      var selector = document.querySelector('.selector');
      if (!selector.contains(target)) {
        window.removeEventListener('click', _this.onBackgroundClick);
        dispatch('setSelector', false);
      }
    };

    this.smartComponents = {
      map: new MapComponent({
        features: this.state.features,
        commodity: this.state.commodity,
        selector: '.map',
        customProjection: 'robinson',
        getPolygonClassName: function getPolygonClassName() {
          return 'poly';
        }
      })
    };

    this.props = props;
    this.root = document.querySelector(props.selector);
    this._setListeners();
    this.willMount();
    this._render();
  }

  _createClass(Datavis, [{
    key: 'setFeatures',
    value: function setFeatures(topo) {
      var features = topo.features.reduce(function (acc, next) {
        return _extends({}, acc, _defineProperty({}, next.properties.iso2, next));
      }, {});
      this.state = _extends({}, this.state, { features: features });
    }
  }, {
    key: 'setCommodity',
    value: function setCommodity(commodity) {
      this.state = _extends({}, this.state, { commodity: commodity, selector: false });
    }
  }, {
    key: 'setSelector',
    value: function setSelector(selector) {
      var _this2 = this;

      if (selector) {
        requestAnimationFrame(function () {
          return window.addEventListener('click', _this2.onBackgroundClick);
        });
      }
      this.state = _extends({}, this.state, { selector: selector });
    }
  }, {
    key: 'willMount',
    value: function willMount() {
      fetch('data/world.topo.json').then(function (res) {
        return res.ok ? res.json() : Promise.reject(res.status);
      }).then(function (topo) {
        dispatch('setFeatures', topojson.feature(topo, topo.objects.world));
      });
    }
  }, {
    key: 'updateSmartComponents',
    value: function updateSmartComponents() {
      var _state = this.state,
          commodity = _state.commodity,
          features = _state.features;

      dispatch('updateMap', {
        commodity: commodity,
        features: features
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var map = this.smartComponents.map;
      var _state2 = this.state,
          commodity = _state2.commodity,
          selector = _state2.selector;

      return function () {
        var _elem = document.createElement('div');

        _elem.setAttribute('class', 'container');

        _elem.appendChild(document.createTextNode('\n        '));

        var _expr = new Selector({
          open: selector,
          active: commodity,
          options: ['soy', 'sugar', 'oil-palm'],
          selectOptionAction: 'setCommodity',
          toggleOpenAction: 'setSelector'
        }),
            _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

        if (_res instanceof Array) {
          for (var _i3 = 0; _i3 < _res.length; _i3 += 1) {
            _elem.appendChild(_res[_i3] instanceof Node || _res[_i3] instanceof Array ? _res[_i3] : document.createTextNode(_res[_i3]));
          }
        } else _elem.appendChild(_res);

        _elem.appendChild(document.createTextNode('\n        '));

        var _expr2 = map,
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
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapComponent = function () {
  _createClass(MapComponent, [{
    key: '_setListeners',
    value: function _setListeners() {
      window.addEventListener('updateMap', this._handleEvent);
      window.addEventListener('setFlowsData', this._handleEvent);
      window.addEventListener('setChoropleth', this._handleEvent);
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
    _classCallCheck(this, MapComponent);

    _initialiseProps.call(this);

    this.props = props;
    this._setListeners();
    return this.render();
  }

  _createClass(MapComponent, [{
    key: 'setFlowsData',
    value: function setFlowsData(flows) {
      this.state = _extends({}, this.state, { flows: flows });
      this.renderBubbles();
      this.renderExporterCountries();
    }
  }, {
    key: 'setChoropleth',
    value: function setChoropleth(exporter) {
      this.state = _extends({}, this.state, { choropleth: exporter });
      this.renderChoropleth();
    }
  }, {
    key: 'getCommodityData',
    value: function getCommodityData() {
      var commodity = this.props.commodity;

      d3.json('data/' + commodity + '.json', function (data) {
        return dispatch('setFlowsData', data);
      });
    }
  }, {
    key: 'getProjectionConfig',
    value: function getProjectionConfig(projection) {
      var _props = this.props,
          features = _props.features,
          selector = _props.selector;

      var d3Container = d3.select(selector);
      var containerComputedStyle = window.getComputedStyle(d3Container.node());
      var width = parseInt(containerComputedStyle.width);
      var height = parseInt(containerComputedStyle.height);

      var path = d3.geoPath().projection(projection);
      var collection = { type: 'FeatureCollection', features: Object.values(features) };
      var featureBounds = path.bounds(collection);

      var _MapComponent$fitGeoI = MapComponent.fitGeoInside(featureBounds, width, height),
          scale = _MapComponent$fitGeoI.scale,
          trans = _MapComponent$fitGeoI.trans;

      return { scale: scale, trans: trans, path: path };
    }
  }, {
    key: 'renderMap',
    value: function renderMap() {
      var _props2 = this.props,
          selector = _props2.selector,
          features = _props2.features,
          customProjection = _props2.customProjection;

      var d3Container = d3.select(selector);
      var containerComputedStyle = window.getComputedStyle(d3Container.node());
      var width = parseInt(containerComputedStyle.width);
      var height = parseInt(containerComputedStyle.height);

      this.map = d3Container.append('svg').attr('width', width).attr('height', height);

      var geoParent = this.map.append('g');
      var container = geoParent.append('g');
      var projection = customProjection ? d3['geo' + MapComponent.capitalize(customProjection)]() : d3.geoMercator();
      container.selectAll('path');

      var _getProjectionConfig = this.getProjectionConfig(projection),
          path = _getProjectionConfig.path,
          scale = _getProjectionConfig.scale,
          trans = _getProjectionConfig.trans;

      this.polygons = container.selectAll('path').data(Object.values(features)).enter().append('path').attr('class', function () {
        return 'polygon';
      }).attr('d', path);

      container.attr('transform', 'translate(' + trans + ') scale(' + scale + ')');
    }
  }, {
    key: 'renderBubbles',
    value: function renderBubbles() {
      var customProjection = this.props.customProjection;
      var flows = this.state.flows;

      var radius = d3.scaleSqrt().domain([0, 1e8]).range([0, 15]);
      var projection = customProjection ? d3['geo' + MapComponent.capitalize(customProjection)]() : d3.geoMercator();

      var _getProjectionConfig2 = this.getProjectionConfig(projection),
          scale = _getProjectionConfig2.scale,
          trans = _getProjectionConfig2.trans;

      var bubbles = Object.keys(flows);
      var centroids = bubbles.map(function (fao) {
        return FAO_TO_ISO2[parseInt(fao, 10)];
      }).filter(function (iso) {
        return typeof iso !== 'undefined';
      }).map(function (iso) {
        return projection(COUNTRIES_COORDINATES[iso]);
      });

      var getTons = function getTons(index) {
        var fao = parseInt(bubbles[index], 10);
        var flow = flows[fao];
        return flow && flow.tons;
      };

      var getExporter = function getExporter(index) {
        return flows[bubbles[index]];
      };

      this.map.select('.bubbles').remove();

      this.map.append('g').attr('class', 'bubbles').selectAll('circle').data(centroids).enter().append('circle').on('click', function (d, i) {
        return dispatch('setChoropleth', getExporter(i));
      }).attr('cx', function (d) {
        return d[0];
      }).attr('cy', function (d) {
        return d[1];
      }).attr('transform', function () {
        return 'translate(' + trans + ') scale(' + scale + ')';
      }).attr('fill', function () {
        return 'pink';
      }).attr('r', function (d, i) {
        return radius(getTons(i));
      });
    }
  }, {
    key: 'renderExporterCountries',
    value: function renderExporterCountries() {
      var _this = this;

      var getPolygonClassName = function getPolygonClassName(d) {
        var flows = _this.state.flows;

        var fao = ISO2_TO_FAO[d.properties.iso2];
        return flows[fao] ? 'polygon -initial' : 'polygon';
      };
      this.polygons.each(function (d) {
        var polygon = d3.select(this);
        if (polygon) {
          polygon.attr('class', function () {
            return getPolygonClassName(d);
          });
        }
      });
    }
  }, {
    key: 'renderChoropleth',
    value: function renderChoropleth() {
      debugger;
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

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._handleEvent = function (e) {
    _this2[e.type].apply(_this2, _toConsumableArray(e.detail));
  };

  this.state = {
    flows: null,
    choropleth: null
  };
  this.polygons = null;
  this.map = null;

  this.updateMap = function (props) {
    var prevProps = _this2.props;
    _this2.props = _extends({}, prevProps, props);
    if (_this2.props.features !== null) {
      if (!_this2.map) {
        _this2.renderMap();
        _this2.getCommodityData();
      }
      if (prevProps.commodity !== _this2.props.commodity) {
        _this2.getCommodityData();
      }
    }
  };
};
'use strict';

function Selector(props) {
  var options = props.options,
      open = props.open,
      active = props.active,
      selectOptionAction = props.selectOptionAction,
      toggleOpenAction = props.toggleOpenAction;

  return function () {
    var _elem = document.createElement('div');

    _elem.setAttribute('class', 'selector ' + (open ? '-open' : ''));

    _elem.appendChild(document.createTextNode('\n      '));

    var _elem2 = document.createElement('button');

    _elem2.setAttribute('class', 'selector-button selector-text');

    _elem2.setAttribute('onClick', 'dispatch(\'' + toggleOpenAction + '\', ' + !open + ')');

    var _expr = active,
        _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

    if (_res instanceof Array) {
      for (var _i3 = 0; _i3 < _res.length; _i3 += 1) {
        _elem2.appendChild(_res[_i3] instanceof Node || _res[_i3] instanceof Array ? _res[_i3] : document.createTextNode(_res[_i3]));
      }
    } else _elem2.appendChild(_res);

    _elem.appendChild(_elem2);

    _elem.appendChild(document.createTextNode('\n      '));

    var _elem3 = document.createElement('ul');

    _elem3.setAttribute('class', 'selector-list');

    _elem3.appendChild(document.createTextNode('\n        '));

    var _expr2 = options.map(function (option) {
      return function () {
        var _elem4 = document.createElement('li');

        _elem4.setAttribute('class', 'selector-list-item');

        _elem4.setAttribute('onClick', 'dispatch(\'' + selectOptionAction + '\', \'' + option + '\')');

        _elem4.appendChild(document.createTextNode('\n            '));

        var _elem5 = document.createElement('span');

        _elem5.setAttribute('class', 'selector-list-item-name selector-text');

        _elem5.appendChild(document.createTextNode('\n              '));

        var _expr3 = option,
            _res3 = _expr3 instanceof Node || _expr3 instanceof Array ? _expr3 : document.createTextNode(_expr3);

        if (_res3 instanceof Array) {
          for (var _i5 = 0; _i5 < _res3.length; _i5 += 1) {
            _elem5.appendChild(_res3[_i5] instanceof Node || _res3[_i5] instanceof Array ? _res3[_i5] : document.createTextNode(_res3[_i5]));
          }
        } else _elem5.appendChild(_res3);

        _elem5.appendChild(document.createTextNode('\n            '));

        _elem4.appendChild(_elem5);

        _elem4.appendChild(document.createTextNode('\n          '));

        return _elem4;
      }();
    }),
        _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

    if (_res2 instanceof Array) {
      for (var _i6 = 0; _i6 < _res2.length; _i6 += 1) {
        _elem3.appendChild(_res2[_i6] instanceof Node || _res2[_i6] instanceof Array ? _res2[_i6] : document.createTextNode(_res2[_i6]));
      }
    } else _elem3.appendChild(_res2);

    _elem3.appendChild(document.createTextNode('\n      '));

    _elem.appendChild(_elem3);

    _elem.appendChild(document.createTextNode('\n    '));

    return _elem;
  }();
}
