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
      window.addEventListener('handleInfoClick', this._handleEvent);
      window.addEventListener('handleCloseInfo', this._handleEvent);
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
      canResetMap: false,
      infoOpened: false
    };
    this.commoditiesText = {
      'soy': function () {
        var _elem = document.createElement('div');

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem2 = document.createElement('p');

        _elem2.appendChild(document.createTextNode('Soybean is a leguminous crop, grown primarily for its application, via crushing, in vegetable oils (including as biofuel) and for its properties as a high-protein constituent of animal feed.'));

        _elem.appendChild(_elem2);

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem3 = document.createElement('p');

        _elem3.appendChild(document.createTextNode('Production has increased from 27m tonnes in 1961 to '));

        var _elem4 = document.createElement('a');

        _elem4.setAttribute('href', 'http://www.fao.org/faostat/en/#home');

        _elem4.setAttribute('target', '_blank');

        _elem4.appendChild(document.createTextNode('335m tonnes in 2016'));

        _elem3.appendChild(_elem4);

        _elem3.appendChild(document.createTextNode('. The US, Brazil and Argentina dominate global production (accounting for 80%), and exports (around 86%), with Brazil being the '));

        var _elem5 = document.createElement('a');

        _elem5.setAttribute('href', 'https://apps.fas.usda.gov/Gats/default.aspx');

        _elem5.setAttribute('target', '_blank');

        _elem5.appendChild(document.createTextNode('leading export player in 2016'));

        _elem3.appendChild(_elem5);

        _elem3.appendChild(document.createTextNode(' (35% of global total exports).'));

        _elem.appendChild(_elem3);

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem6 = document.createElement('p');

        _elem6.appendChild(document.createTextNode('Historically, key importing regions for global soy production have included the US and countries in the EU but China has quickly grown to become the dominant force in soy markets, accounting for '));

        var _elem7 = document.createElement('a');

        _elem7.setAttribute('href', 'http://www.bik-f.de/root/index.php?page_id=1093');

        _elem7.setAttribute('target', '_blank');

        _elem7.appendChild(document.createTextNode('27% of global imports in 2013'));

        _elem6.appendChild(_elem7);

        _elem6.appendChild(document.createTextNode('. More recent sources suggest that Chinese imports could now be as much as 60% of global imports.'));

        _elem.appendChild(_elem6);

        _elem.appendChild(document.createTextNode('\n        '));

        var _elem8 = document.createElement('p');

        _elem8.appendChild(document.createTextNode('While soy represents an economic \u2018success story\u2019 for markets and countries in, for example, South America, supply chains are associated with various '));

        var _elem9 = document.createElement('a');

        _elem9.setAttribute('href', 'http://wwf.panda.org/our_work/food/agriculture/soy/impacts/');

        _elem9.setAttribute('target', '_blank');

        _elem9.appendChild(document.createTextNode('environmental and social impacts'));

        _elem8.appendChild(_elem9);

        _elem8.appendChild(document.createTextNode(', including the pollution of groundwater and freshwater reserves, an increase in carbon emissions from deforestation, loss of biodiversity, and the exploitation of workers. Production in biodiversity-sensitive areas in Brazil, Argentina and Paraguay means that soy has become a key target for activity to reduce deforestation risk in supply chains.'));

        _elem.appendChild(_elem8);

        _elem.appendChild(document.createTextNode('\n      '));

        return _elem;
      }(),
      'oil-palm': function () {
        var _elem10 = document.createElement('div');

        _elem10.appendChild(document.createTextNode('\n        '));

        var _elem11 = document.createElement('p');

        _elem11.appendChild(document.createTextNode('Palm oil is used in a wide range of products, including foods, cosmetics, cleaning products and fuels. It is a higher yielding crop than others used for vegetable oils, and has a lower cost of production, prompting an increasing demand and expansion of plantations.'));

        _elem10.appendChild(_elem11);

        _elem10.appendChild(document.createTextNode('\n        '));

        var _elem12 = document.createElement('p');

        _elem12.appendChild(document.createTextNode('The global production of palm oil has increased from 14 million tonnes in 1961 to '));

        var _elem13 = document.createElement('a');

        _elem13.setAttribute('href', 'http://www.fao.org/faostat/en/#home');

        _elem13.setAttribute('target', '_blank');

        _elem13.appendChild(document.createTextNode('300 million tonnes in 2016'));

        _elem12.appendChild(_elem13);

        _elem12.appendChild(document.createTextNode('. The top two producers, Indonesia and Malaysia, together accounted for 82% of total global production in 2016 (53% and, 29% respectively), and in 2013 accounted for 93% of global exports (54% and 39% respectively).'));

        _elem10.appendChild(_elem12);

        _elem10.appendChild(document.createTextNode('\n        '));

        var _elem14 = document.createElement('p');

        _elem14.appendChild(document.createTextNode('Imports of palm oil have rapidly increased along with production, and in 2013 the biggest importers of palm oil were India and China, together accounting for '));

        var _elem15 = document.createElement('a');

        _elem15.setAttribute('href', 'http://www.bik-f.de/root/index.php?page_id=1093');

        _elem15.setAttribute('target', '_blank');

        _elem15.appendChild(document.createTextNode('a third of global palm oil imports'));

        _elem14.appendChild(_elem15);

        _elem14.appendChild(document.createTextNode(' (18% and 15% respectively).'));

        _elem10.appendChild(_elem14);

        _elem10.appendChild(document.createTextNode('\n        '));

        var _elem16 = document.createElement('p');

        _elem16.appendChild(document.createTextNode('The rapid growth of palm oil production has driven a range of environmental and social problems, including the displacement of indigenous peoples, deforestation and the loss of tropical biodiversity.'));

        _elem10.appendChild(_elem16);

        _elem10.appendChild(document.createTextNode('\n      '));

        return _elem10;
      }(),
      'sugar': function () {
        var _elem17 = document.createElement('div');

        _elem17.appendChild(document.createTextNode('\n        '));

        var _elem18 = document.createElement('p');

        _elem18.appendChild(document.createTextNode('Sugar crops, comprised of both sugarcane and beet, are refined for use in both food manufacture and in the production of biofuels and bioplastics. Sugarcane is grown in tropical regions.'));

        _elem17.appendChild(_elem18);

        _elem17.appendChild(document.createTextNode('\n        '));

        var _elem19 = document.createElement('p');

        _elem19.appendChild(document.createTextNode('Globally, production of raw sugar derived from sugarcane and beet has increased from 53 million tonnes in 1961 to 179 million tonnes in 2013. Five producers account for around '));

        var _elem20 = document.createElement('a');

        _elem20.setAttribute('href', 'http://www.fao.org/faostat/en/#home');

        _elem20.setAttribute('target', '_blank');

        _elem20.appendChild(document.createTextNode('50% of total supply'));

        _elem19.appendChild(_elem20);

        _elem19.appendChild(document.createTextNode(': Brazil (20%), India (14%), China (7%), Thailand (5%) and the United states (4%).'));

        _elem17.appendChild(_elem19);

        _elem17.appendChild(document.createTextNode('\n        '));

        var _elem21 = document.createElement('p');

        _elem21.appendChild(document.createTextNode('Brazil is by far the most dominant exporter (42% of global exports in 2013) and exports over '));

        var _elem22 = document.createElement('a');

        _elem22.setAttribute('href', 'http://www.bik-f.de/root/index.php?page_id=1093');

        _elem22.setAttribute('target', '_blank');

        _elem22.appendChild(document.createTextNode('four times as much'));

        _elem21.appendChild(_elem22);

        _elem21.appendChild(document.createTextNode(' as the next largest exporting nation (Thailand, 9%).'));

        _elem17.appendChild(_elem21);

        _elem17.appendChild(document.createTextNode('\n        '));

        var _elem23 = document.createElement('p');

        _elem23.appendChild(document.createTextNode('Import of sugar is not dominated by any country in particular, but China and the US are both significant importers each accounting for 7% of global imports.'));

        _elem17.appendChild(_elem23);

        _elem17.appendChild(document.createTextNode('\n        '));

        var _elem24 = document.createElement('p');

        _elem24.appendChild(document.createTextNode('Sugar is a highly water-intensive crop, and other environmental impacts include habitat loss from land clearing, land degradation, water and air pollution from fertilizers, eroded soils and industrial waste. Sugar production in some areas of the world is also associated with poor working conditions.'));

        _elem17.appendChild(_elem24);

        _elem17.appendChild(document.createTextNode('\n      '));

        return _elem17;
      }()
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
    key: 'handleInfoClick',
    value: function handleInfoClick() {
      this.state = _extends({}, this.state, { infoOpened: true });
    }
  }, {
    key: 'handleCloseInfo',
    value: function handleCloseInfo() {
      this.state = _extends({}, this.state, { infoOpened: false });
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
          canResetMap = _state2.canResetMap,
          infoOpened = _state2.infoOpened;

      var commodityText = this.commoditiesText[commodity];
      return function () {
        var _elem25 = document.createElement('div');

        _elem25.setAttribute('class', 'container');

        _elem25.appendChild(document.createTextNode('\n        '));

        var _expr = !infoOpened ? function () {
          var _elem26 = document.createElement('div');

          _elem26.appendChild(document.createTextNode('\n            '));

          var _elem27 = document.createElement('div');

          _elem27.setAttribute('class', 'map-header');

          _elem27.appendChild(document.createTextNode('\n              '));

          var _elem28 = document.createElement('div');

          _elem28.setAttribute('class', 'title-container');

          _elem28.appendChild(document.createTextNode('\n                '));

          var _elem29 = document.createElement('h1');

          _elem29.setAttribute('class', 'title');

          _elem29.appendChild(document.createTextNode('Global trade in key deforestation risk commodities in 2013'));

          _elem28.appendChild(_elem29);

          _elem28.appendChild(document.createTextNode('\n              '));

          _elem27.appendChild(_elem28);

          _elem27.appendChild(document.createTextNode('\n              '));

          var _elem30 = document.createElement('div');

          _elem30.setAttribute('class', 'controls');

          _elem30.appendChild(document.createTextNode('\n                '));

          var _expr4 = new Selector({
            open: selector,
            active: commodity,
            options: ['soy', 'sugar', 'oil-palm'],
            selectOptionAction: 'setCommodity',
            toggleOpenAction: 'setSelector'
          }),
              _res4 = _expr4 instanceof Node || _expr4 instanceof Array ? _expr4 : document.createTextNode(_expr4);

          if (_res4 instanceof Array) {
            for (var _i7 = 0; _i7 < _res4.length; _i7 += 1) {
              _elem30.appendChild(_res4[_i7] instanceof Node || _res4[_i7] instanceof Array ? _res4[_i7] : document.createTextNode(_res4[_i7]));
            }
          } else _elem30.appendChild(_res4);

          _elem30.appendChild(document.createTextNode('\n                '));

          var _elem31 = document.createElement('button');

          _elem31.setAttribute('onClick', 'dispatch(\'renderOriginBubbles\')');

          _elem31.setAttribute('class', 'reset ' + (canResetMap ? '' : '-disabled'));

          _elem31.appendChild(document.createTextNode('\n                  '));

          var _elem32 = document.createElement('span');

          _elem32.setAttribute('class', 'selector-text');

          _elem32.appendChild(document.createTextNode('Reset'));

          _elem31.appendChild(_elem32);

          _elem31.appendChild(document.createTextNode('\n                '));

          _elem30.appendChild(_elem31);

          _elem30.appendChild(document.createTextNode('\n                '));

          var _elem33 = document.createElement('button');

          _elem33.setAttribute('onClick', 'dispatch(\'handleInfoClick\')');

          _elem33.setAttribute('class', 'reset info-button');

          _elem33.appendChild(document.createTextNode('\n                  i\n                '));

          _elem30.appendChild(_elem33);

          _elem30.appendChild(document.createTextNode('\n              '));

          _elem27.appendChild(_elem30);

          _elem27.appendChild(document.createTextNode('\n            '));

          _elem26.appendChild(_elem27);

          _elem26.appendChild(document.createTextNode('\n            '));

          var _expr5 = map,
              _res5 = _expr5 instanceof Node || _expr5 instanceof Array ? _expr5 : document.createTextNode(_expr5);

          if (_res5 instanceof Array) {
            for (var _i8 = 0; _i8 < _res5.length; _i8 += 1) {
              _elem26.appendChild(_res5[_i8] instanceof Node || _res5[_i8] instanceof Array ? _res5[_i8] : document.createTextNode(_res5[_i8]));
            }
          } else _elem26.appendChild(_res5);

          _elem26.appendChild(document.createTextNode('\n            '));

          var _elem34 = document.createElement('div');

          _elem34.setAttribute('class', 'map-footer');

          _elem34.appendChild(document.createTextNode('\n              '));

          var _expr6 = !canResetMap ? function () {
            var _elem35 = document.createElement('span');

            _elem35.setAttribute('class', 'map-footer-text');

            _elem35.appendChild(document.createTextNode('\n                  Click a production country to see the destination of the selected commodity\n                '));

            return _elem35;
          }() : '',
              _res6 = _expr6 instanceof Node || _expr6 instanceof Array ? _expr6 : document.createTextNode(_expr6);

          if (_res6 instanceof Array) {
            for (var _i9 = 0; _i9 < _res6.length; _i9 += 1) {
              _elem34.appendChild(_res6[_i9] instanceof Node || _res6[_i9] instanceof Array ? _res6[_i9] : document.createTextNode(_res6[_i9]));
            }
          } else _elem34.appendChild(_res6);

          _elem34.appendChild(document.createTextNode('\n            '));

          _elem26.appendChild(_elem34);

          _elem26.appendChild(document.createTextNode('\n          '));

          return _elem26;
        }() : '',
            _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

        if (_res instanceof Array) {
          for (var _i10 = 0; _i10 < _res.length; _i10 += 1) {
            _elem25.appendChild(_res[_i10] instanceof Node || _res[_i10] instanceof Array ? _res[_i10] : document.createTextNode(_res[_i10]));
          }
        } else _elem25.appendChild(_res);

        _elem25.appendChild(document.createTextNode('\n        '));

        var _expr2 = infoOpened ? function () {
          var _elem36 = document.createElement('div');

          _elem36.setAttribute('class', 'info-container');

          _elem36.appendChild(document.createTextNode('\n            '));

          var _elem37 = document.createElement('div');

          _elem37.setAttribute('class', 'info-container-header');

          _elem37.appendChild(document.createTextNode('\n              '));

          var _elem38 = document.createElement('button');

          _elem38.setAttribute('class', 'reset close-button');

          _elem38.setAttribute('onClick', 'dispatch(\'handleCloseInfo\')');

          _elem38.appendChild(document.createTextNode('\n              X\n              '));

          _elem37.appendChild(_elem38);

          _elem37.appendChild(document.createTextNode('\n            '));

          _elem36.appendChild(_elem37);

          _elem36.appendChild(document.createTextNode('\n            '));

          var _elem39 = document.createElement('div');

          _elem39.setAttribute('class', 'info-text');

          _elem39.appendChild(document.createTextNode('\n              '));

          var _expr7 = commodityText,
              _res7 = _expr7 instanceof Node || _expr7 instanceof Array ? _expr7 : document.createTextNode(_expr7);

          if (_res7 instanceof Array) {
            for (var _i12 = 0; _i12 < _res7.length; _i12 += 1) {
              _elem39.appendChild(_res7[_i12] instanceof Node || _res7[_i12] instanceof Array ? _res7[_i12] : document.createTextNode(_res7[_i12]));
            }
          } else _elem39.appendChild(_res7);

          _elem39.appendChild(document.createTextNode('\n            '));

          _elem36.appendChild(_elem39);

          _elem36.appendChild(document.createTextNode('\n          '));

          return _elem36;
        }() : '',
            _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

        if (_res2 instanceof Array) {
          for (var _i13 = 0; _i13 < _res2.length; _i13 += 1) {
            _elem25.appendChild(_res2[_i13] instanceof Node || _res2[_i13] instanceof Array ? _res2[_i13] : document.createTextNode(_res2[_i13]));
          }
        } else _elem25.appendChild(_res2);

        _elem25.appendChild(document.createTextNode('\n        '));

        var _expr3 = tooltip,
            _res3 = _expr3 instanceof Node || _expr3 instanceof Array ? _expr3 : document.createTextNode(_expr3);

        if (_res3 instanceof Array) {
          for (var _i14 = 0; _i14 < _res3.length; _i14 += 1) {
            _elem25.appendChild(_res3[_i14] instanceof Node || _res3[_i14] instanceof Array ? _res3[_i14] : document.createTextNode(_res3[_i14]));
          }
        } else _elem25.appendChild(_res3);

        _elem25.appendChild(document.createTextNode('\n      '));

        return _elem25;
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
      var _state$selectedBubble = this.state.selectedBubble,
          destinations = _state$selectedBubble.destinations,
          exporterCentroid = _state$selectedBubble.exporterCentroid;

      this.renderBubbles(destinations, null, exporterCentroid);
      setTimeout(function () {
        return dispatch('setCanResetMap', true);
      }, 700);
      // setTimeout(() => this.renderChoropleth(), 3500);
    }
  }, {
    key: 'renderChoropleth',
    value: function renderChoropleth() {
      var _this2 = this;

      this.map.select('.bubbles').remove();
      var getPolygonClassName = function getPolygonClassName(d) {
        var selectedBubble = _this2.state.selectedBubble;

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
        var selectedBubble = _this2.state.selectedBubble;

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
  var _this3 = this;

  this._handleEvent = function (e) {
    _this3[e.type].apply(_this3, _toConsumableArray(e.detail));
  };

  this.state = {
    flows: null,
    selectedBubble: null
  };
  this.polygons = null;
  this.map = null;

  this.updateMap = function (props) {
    var prevProps = _this3.props;
    _this3.props = _extends({}, prevProps, props);
    if (_this3.props.features !== null) {
      if (!_this3.map) {
        _this3.renderMap();
        _this3.getCommodityData();
      }
      if (prevProps.commodity !== _this3.props.commodity) {
        _this3.getCommodityData();
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
