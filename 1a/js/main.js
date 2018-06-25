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
      window.addEventListener('setCanResetMap', this._handleEvent);
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
      selector: false,
      canResetMap: false
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
      }),
      tooltip: new Tooltip()
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
      var features = topo.features.filter(function (feat) {
        return feat.properties.iso2 !== 'AQ';
      }).reduce(function (acc, next) {
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
    key: 'setCanResetMap',
    value: function setCanResetMap(canResetMap) {
      this.state = _extends({}, this.state, { canResetMap: canResetMap });
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
      var _smartComponents = this.smartComponents,
          map = _smartComponents.map,
          tooltip = _smartComponents.tooltip;
      var _state2 = this.state,
          commodity = _state2.commodity,
          selector = _state2.selector,
          canResetMap = _state2.canResetMap;

      return function () {
        var _elem = document.createElement('div');

        _elem.setAttribute('class', 'container');

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem2 = document.createElement('div');

        _elem2.setAttribute('class', 'map-header');

        _elem2.appendChild(document.createTextNode('\n          '));

        var _elem3 = document.createElement('h1');

        _elem3.setAttribute('class', 'title');

        _elem3.appendChild(document.createTextNode('The global landscape of commodity production and trade (2013)'));

        _elem2.appendChild(_elem3);

        _elem2.appendChild(document.createTextNode('\n          '));

        var _elem4 = document.createElement('div');

        _elem4.setAttribute('class', 'controls');

        _elem4.appendChild(document.createTextNode('\n            '));

        var _expr = new Selector({
          open: selector,
          active: commodity,
          options: ['soy', 'sugar', 'oil-palm'],
          selectOptionAction: 'setCommodity',
          toggleOpenAction: 'setSelector'
        }),
            _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

        if (_res instanceof Array) {
          for (var _i4 = 0; _i4 < _res.length; _i4 += 1) {
            _elem4.appendChild(_res[_i4] instanceof Node || _res[_i4] instanceof Array ? _res[_i4] : document.createTextNode(_res[_i4]));
          }
        } else _elem4.appendChild(_res);

        _elem4.appendChild(document.createTextNode('\n            '));

        var _elem5 = document.createElement('button');

        _elem5.setAttribute('onClick', 'dispatch(\'renderOriginBubbles\')');

        _elem5.setAttribute('class', 'reset ' + (canResetMap ? '' : '-disabled'));

        _elem5.appendChild(document.createTextNode('\n              '));

        var _elem6 = document.createElement('span');

        _elem6.setAttribute('class', 'selector-text');

        _elem6.appendChild(document.createTextNode('Reset'));

        _elem5.appendChild(_elem6);

        _elem5.appendChild(document.createTextNode('\n            '));

        _elem4.appendChild(_elem5);

        _elem4.appendChild(document.createTextNode('\n          '));

        _elem2.appendChild(_elem4);

        _elem2.appendChild(document.createTextNode('\n        '));

        _elem.appendChild(_elem2);

        _elem.appendChild(document.createTextNode('\n        '));

        var _expr2 = map,
            _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

        if (_res2 instanceof Array) {
          for (var _i5 = 0; _i5 < _res2.length; _i5 += 1) {
            _elem.appendChild(_res2[_i5] instanceof Node || _res2[_i5] instanceof Array ? _res2[_i5] : document.createTextNode(_res2[_i5]));
          }
        } else _elem.appendChild(_res2);

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem7 = document.createElement('div');

        _elem7.setAttribute('class', 'map-footer');

        _elem7.appendChild(document.createTextNode('\n          '));

        var _elem8 = document.createElement('span');

        _elem8.setAttribute('class', 'map-footer-text');

        _elem8.appendChild(document.createTextNode('\n            Click a production country to see the destination of the selected commodity\n          '));

        _elem7.appendChild(_elem8);

        _elem7.appendChild(document.createTextNode('\n        '));

        _elem.appendChild(_elem7);

        _elem.appendChild(document.createTextNode('\n        '));

        var _expr3 = tooltip,
            _res3 = _expr3 instanceof Node || _expr3 instanceof Array ? _expr3 : document.createTextNode(_expr3);

        if (_res3 instanceof Array) {
          for (var _i6 = 0; _i6 < _res3.length; _i6 += 1) {
            _elem.appendChild(_res3[_i6] instanceof Node || _res3[_i6] instanceof Array ? _res3[_i6] : document.createTextNode(_res3[_i6]));
          }
        } else _elem.appendChild(_res3);

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
      window.addEventListener('setSelectedBubble', this._handleEvent);
      window.addEventListener('renderOriginBubbles', this._handleEvent);
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
  }, {
    key: 'getChoroplethScale',
    value: function getChoroplethScale(domain) {
      var colors = ['-choro-1', '-choro-2', '-choro-3', '-choro-4', '-choro-5', '-choro-6', '-choro-7', '-choro-8', '-choro-9', '-choro-10'];

      return d3.scaleQuantile().domain(domain).range(colors);
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
      this.renderOriginBubbles();
    }
  }, {
    key: 'setSelectedBubble',
    value: function setSelectedBubble(exporter, exporterCentroid) {
      var selectedBubble = _extends({}, exporter, { exporterCentroid: exporterCentroid });
      this.state = _extends({}, this.state, { selectedBubble: selectedBubble });
      this.renderDestinationBubbles();
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
    value: function renderBubbles(flows, onClick, parentBubble) {
      var customProjection = this.props.customProjection;

      var radius = d3.scaleSqrt().domain([0, 1e6]).range([2, 4, 5, 6, 8, 9, 10, 12]);
      var projection = customProjection ? d3['geo' + MapComponent.capitalize(customProjection)]() : d3.geoMercator();

      var _getProjectionConfig2 = this.getProjectionConfig(projection),
          scale = _getProjectionConfig2.scale,
          trans = _getProjectionConfig2.trans;

      var bubbles = Object.keys(flows).filter(function (fao) {
        var iso = FAO_TO_ISO2[parseInt(fao, 10)];
        return typeof iso !== 'undefined' && typeof COUNTRIES_COORDINATES[iso] !== 'undefined';
      });

      var centroids = bubbles.map(function (fao) {
        return FAO_TO_ISO2[parseInt(fao, 10)];
      }).map(function (iso) {
        return projection(COUNTRIES_COORDINATES[iso]);
      });

      var getTons = function getTons(index) {
        var fao = parseInt(bubbles[index], 10);
        var flow = flows[fao];
        return flow && flow.tons;
      };

      var colorScale = MapComponent.getChoroplethScale(Object.values(flows).map(function (f) {
        return f.tons;
      }));

      var getExporter = function getExporter(index) {
        return flows[bubbles[index]];
      };

      this.map.select('.bubbles').remove();

      this.map.append('g').attr('class', 'bubbles').selectAll('circle').data(centroids).enter().append('circle').attr('class', function (d, i) {
        return 'bubble choro ' + colorScale(getTons(i));
      }).on('click', function (d, i) {
        return onClick && onClick(getExporter(i), d);
      }).on('mouseover', function (d, i) {
        var fao = bubbles[i];
        var name = FAO_TO_COUNTRY[parseInt(fao, 10)];
        var value = getExporter(i).tons;
        dispatch('showTooltip', name, value);
      }).on('mouseout', function () {
        return dispatch('hideTooltip');
      }).attr('cx', function (d) {
        return parentBubble ? parentBubble[0] : d[0];
      }).attr('cy', function (d) {
        return parentBubble ? parentBubble[1] : d[1];
      }).attr('transform', 'translate(' + trans + ') scale(' + scale + ')').attr('r', function (d, i) {
        return radius(getTons(i));
      });

      if (parentBubble) {
        this.map.selectAll('.bubble').each(function (d) {
          var bubble = d3.select(this);
          if (bubble) {
            bubble.transition().duration(1000).attr('cx', function () {
              return d[0];
            }).attr('cy', function () {
              return d[1];
            });
          }
        });
      }
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
          }).on('mouseover', null).on('mouseout', null);
        }
      });
    }
  }, {
    key: 'renderOriginBubbles',
    value: function renderOriginBubbles() {
      dispatch('setCanResetMap', false);
      var onClick = function onClick(exporter, exporterCentroid) {
        return dispatch('setSelectedBubble', exporter, exporterCentroid);
      };
      this.renderExporterCountries();
      this.renderBubbles(this.state.flows, onClick);
    }
  }, {
    key: 'renderDestinationBubbles',
    value: function renderDestinationBubbles() {
      var _this2 = this;

      var _state$selectedBubble = this.state.selectedBubble,
          destinations = _state$selectedBubble.destinations,
          exporterCentroid = _state$selectedBubble.exporterCentroid;

      this.renderBubbles(destinations, null, exporterCentroid);
      setTimeout(function () {
        return _this2.renderChoropleth();
      }, 3500);
    }
  }, {
    key: 'renderChoropleth',
    value: function renderChoropleth() {
      var _this3 = this;

      this.map.select('.bubbles').remove();
      var getPolygonClassName = function getPolygonClassName(d) {
        var selectedBubble = _this3.state.selectedBubble;

        var fao = ISO2_TO_FAO[d.properties.iso2];
        var destinations = selectedBubble.destinations;

        var tons = Object.values(destinations).map(function (d) {
          return d.tons;
        });

        var colorScale = MapComponent.getChoroplethScale(tons);
        var destination = destinations[fao];
        return destination && destination.tons ? 'polygon choro ' + colorScale(destination.tons) : 'polygon';
      };
      var onMouseOver = function onMouseOver(d) {
        var selectedBubble = _this3.state.selectedBubble;

        var fao = ISO2_TO_FAO[d.properties.iso2];
        var name = FAO_TO_COUNTRY[fao];
        var destinations = selectedBubble.destinations;

        var destination = destinations[fao];
        var value = destination && destination.tons;
        if (value) {
          dispatch('showTooltip', name, value);
        }
      };

      this.polygons.each(function (d) {
        var polygon = d3.select(this);
        if (polygon) {
          polygon.attr('class', function () {
            return getPolygonClassName(d);
          }).on('mouseover', onMouseOver).on('mouseout', function () {
            return dispatch('hideTooltip');
          });
        }
      });

      setTimeout(function () {
        return dispatch('setCanResetMap', true);
      }, 700);
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
  var _this4 = this;

  this._handleEvent = function (e) {
    _this4[e.type].apply(_this4, _toConsumableArray(e.detail));
  };

  this.state = {
    flows: null,
    selectedBubble: null
  };
  this.polygons = null;
  this.map = null;

  this.updateMap = function (props) {
    var prevProps = _this4.props;
    _this4.props = _extends({}, prevProps, props);
    if (_this4.props.features !== null) {
      if (!_this4.map) {
        _this4.renderMap();
        _this4.getCommodityData();
      }
      if (prevProps.commodity !== _this4.props.commodity) {
        _this4.getCommodityData();
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tooltip = function () {
  _createClass(Tooltip, [{
    key: '_setListeners',
    value: function _setListeners() {
      window.addEventListener('showTooltip', this._handleEvent);
      window.addEventListener('hideTooltip', this._handleEvent);
      document.addEventListener('mousemove', this.setTooltipPosition);
    }
  }]);

  function Tooltip(props) {
    var _this = this;

    _classCallCheck(this, Tooltip);

    this._handleEvent = function (e) {
      _this[e.type].apply(_this, _toConsumableArray(e.detail));
    };

    this.props = props;
    this._setListeners();
    return this.render();
  }

  _createClass(Tooltip, [{
    key: 'setTooltipPosition',
    value: function setTooltipPosition(e) {
      var tooltip = document.querySelector('.tooltip');
      var offsetX = 0;
      var offsetY = 0;
      if (e.clientX + tooltip.offsetWidth > window.innerWidth) {
        offsetX = -tooltip.offsetWidth;
      }
      if (e.clientY + tooltip.offsetHeight > window.innerHeight) {
        offsetY = -tooltip.offsetHeight;
      }
      tooltip.style.left = Math.max(0, e.clientX + offsetX) + 'px';
      tooltip.style.top = e.clientY + offsetY + 'px';
    }
  }, {
    key: 'showTooltip',
    value: function showTooltip(name, value) {
      var format = d3.format(',d');
      document.querySelector('.tooltip').style.opacity = 1;
      document.querySelector('.tooltip .name').innerHTML = name;
      document.querySelector('.tooltip .content .value').innerHTML = format(value);
    }
  }, {
    key: 'hideTooltip',
    value: function hideTooltip() {
      document.querySelector('.tooltip').style.opacity = 0;
    }
  }, {
    key: 'render',
    value: function render() {
      return function () {
        var _elem = document.createElement('div');

        _elem.setAttribute('class', 'tooltip');

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem2 = document.createElement('div');

        _elem2.setAttribute('class', 'name');

        _elem2.appendChild(document.createTextNode('\n          NAME\n        '));

        _elem.appendChild(_elem2);

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem3 = document.createElement('div');

        _elem3.setAttribute('class', 'content');

        _elem3.appendChild(document.createTextNode('\n          '));

        var _elem4 = document.createElement('span');

        _elem4.setAttribute('class', 'value');

        _elem4.appendChild(document.createTextNode('XXX'));

        _elem3.appendChild(_elem4);

        _elem3.appendChild(document.createTextNode('\n          '));

        var _elem5 = document.createElement('span');

        _elem5.setAttribute('class', 'unit');

        _elem5.appendChild(document.createTextNode('t'));

        _elem3.appendChild(_elem5);

        _elem3.appendChild(document.createTextNode('\n        '));

        _elem.appendChild(_elem3);

        _elem.appendChild(document.createTextNode('\n      '));

        return _elem;
      }();
    }
  }]);

  return Tooltip;
}();
