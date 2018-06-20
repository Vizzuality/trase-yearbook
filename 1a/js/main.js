'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
      e.stopPropagation();
      _this[e.type].apply(_this, _toConsumableArray(e.detail)) || _this._render();
      dispatch('Datavis:didUpdate');
    };

    this.state = {
      commodity: 'soy',
      features: [],
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

    this.props = props;
    this.root = document.querySelector(props.selector);
    this._setListeners();
    this.willMount();
    this._render();
  }

  _createClass(Datavis, [{
    key: 'setFeatures',
    value: function setFeatures(topo) {
      this.state = _extends({}, this.state, { features: topo.features });
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
      fetch('world.topo.json').then(function (res) {
        return res.ok ? res.json() : Promise.reject(res.status);
      }).then(function (topo) {
        return dispatch('setFeatures', topojson.feature(topo, topo.objects.countries));
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          features = _state.features,
          commodity = _state.commodity,
          selector = _state.selector;

      return function () {
        var _elem = document.createElement('div');

        _elem.setAttribute('class', 'container');

        _elem.appendChild(document.createTextNode('\n        '));

        var _expr = new Selector({
          open: selector,
          active: commodity,
          options: ['soy', 'beef', 'coffee'],
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

        var _expr2 = new MapComponent({
          features: features,
          commodity: commodity,
          selector: '.map',
          customProjection: 'robinson',
          getPolygonClassName: function getPolygonClassName() {
            return 'poly';
          }
        }),
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
      window.addEventListener('Datavis:didUpdate', this.didUpdate);
    }
  }, {
    key: '_render',
    value: function _render() {
      return this.render();
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
    };

    this.map = null;

    this.didUpdate = function () {
      if (_this.props.features.length > 0) {
        if (!_this.map) {
          _this.renderMap();
        }
        _this.renderBubbles();
      }
    };

    this.props = props;
    this._setListeners();
    return this._render();
  }

  _createClass(MapComponent, [{
    key: 'renderMap',
    value: function renderMap() {
      var _props = this.props,
          selector = _props.selector,
          features = _props.features,
          getPolygonClassName = _props.getPolygonClassName,
          customProjection = _props.customProjection;

      var d3Container = d3.select(selector);
      var containerComputedStyle = window.getComputedStyle(d3Container.node());
      var width = parseInt(containerComputedStyle.width);
      var height = parseInt(containerComputedStyle.height);

      this.map = d3Container.append('svg').attr('width', width).attr('height', height);

      var geoParent = this.map.append('g');
      var container = geoParent.append('g');
      var projection = customProjection ? d3['geo' + MapComponent.capitalize(customProjection)]() : d3.geoMercator();
      var path = d3.geoPath().projection(projection);
      container.selectAll('path').data(features).enter().append('path').attr('class', function (d) {
        return 'polygon ' + getPolygonClassName(d);
      }).attr('d', path);

      var collection = { type: 'FeatureCollection', features: features };
      var featureBounds = path.bounds(collection);

      var _MapComponent$fitGeoI = MapComponent.fitGeoInside(featureBounds, width, height),
          scale = _MapComponent$fitGeoI.scale,
          trans = _MapComponent$fitGeoI.trans;

      container.attr('transform', 'translate(' + trans + ') scale(' + scale + ')');
    }
  }, {
    key: 'renderBubbles',
    value: function renderBubbles() {
      var commodity = this.props.commodity;

      var testData = [{
        "size": 189744,
        "centroid": [656.526050761282, 153.59300416971516]
      }, {
        "size": 474360,
        "centroid": [526.6430952165599, 283.09644598407925]
      }, {
        "size": 94872,
        "centroid": [533.4723138369542, 129.25835802870276]
      }, {
        "size": 94872,
        "centroid": [624.7122237279438, 184.33762334979284]
      }, {
        "size": 379488,
        "centroid": [305.3703446682553, 355.4622045454013]
      }, {
        "size": 569232,
        "centroid": [600.1119993205066, 132.52966376726522]
      }, {
        "size": 284616,
        "centroid": [535.2563339091782, 627.758530882346]
      }, {
        "size": 569232,
        "centroid": [665.6112561684752, 401.72936754876696]
      }, {
        "size": 284616,
        "centroid": [839.350805377589, 322.60063032436443]
      }, {
        "size": 379488,
        "centroid": [517.5938018612011, 105.04964044794005]
      }, {
        "size": 284616,
        "centroid": [606.9392703698508, 132.49814615853282]
      }, {
        "size": 284616,
        "centroid": [559.85328480189, 259.02335284015675]
      }, {
        "size": 379488,
        "centroid": [492.2222200729133, 92.66689913382153]
      }, {
        "size": 0,
        "centroid": [486.24110678369584, 224.0927085101528]
      }, {
        "size": 664104,
        "centroid": [475.26708719965217, 216.85582096687196]
      }, {
        "size": 664104,
        "centroid": [720.9526750731229, 184.39563522797624]
      }, {
        "size": 94872,
        "centroid": [547.2654497767121, 123.4732605377174]
      }, {
        "size": 284616,
        "centroid": [271.97019703385934, 179.4738834385287]
      }, {
        "size": 664104,
        "centroid": [527.5511752096703, 118.2330130938836]
      }, {
        "size": 189744,
        "centroid": [554.7177626937378, 80.07659908800954]
      }, {
        "size": 664104,
        "centroid": [243.21383551032872, 203.37969942537543]
      }, {
        "size": 569232,
        "centroid": [307.4591388895363, 295.4941220979017]
      }, {
        "size": 189744,
        "centroid": [338.54254443505397, 280.1198497584087]
      }, {
        "size": 284616,
        "centroid": [786.759985009227, 237.46550167453077]
      }, {
        "size": 758976,
        "centroid": [721.5119805414155, 173.8090648897076]
      }, {
        "size": 664104,
        "centroid": [543.4474207056993, 310.65182983046134]
      }, {
        "size": 0,
        "centroid": [534.3973909194542, 232.4739177958415]
      }, {
        "size": 0,
        "centroid": [221.067688274, -0.4521182625892723]
      }, {
        "size": 664104,
        "centroid": [501.674448071063, 108.30091502600169]
      }, {
        "size": 474360,
        "centroid": [288.69347444588027, 372.6857464621172]
      }];
      var bubbles = commodity === 'soy' ? testData : testData.map(function (d) {
        return _extends({}, d, { centroid: [d.centroid[1], d.centroid[0]] });
      });
      var radius = d3.scaleSqrt().domain([0, 1e6]).range([0, 15]);

      this.map.append('g').attr('class', 'bubble').selectAll('circle').data(bubbles).enter().append('circle').attr('transform', function (d) {
        return 'translate(' + d.centroid + ')';
      }).attr('r', function (d) {
        return radius(d.size);
      }).exit().remove();
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
