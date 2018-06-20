
class MapComponent {
  _handleEvent = (e) => {
    this[e.type](...e.detail) || this._render();
  };
  _setListeners() {
    window.addEventListener('Datavis:didUpdate', this.didUpdate);
  }
  _render() {
    return this.render();
  }
  static getFeaturesBox(featureBounds) {
    const errors = [
      Math.abs(featureBounds[0][0]) === Infinity,
      Math.abs(featureBounds[0][1]) === Infinity,
      Math.abs(featureBounds[1][0]) === Infinity,
      Math.abs(featureBounds[1][1]) === Infinity
    ];
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
  static fitGeoInside(featureBounds, width, height) {
    const bbox = MapComponent.getFeaturesBox(featureBounds);
    const scale = 1 / Math.max(bbox.width / width, bbox.height / height);
    const trans = [-(bbox.x + bbox.width / 2) * scale + width / 2, -(bbox.y + bbox.height / 2) * scale + height / 2];

    return { scale, trans };
  };
  static capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props) {
    this.props = props;
    this._setListeners();
    return this._render();
  }

  map = null;

  didUpdate = () => {
    if (this.props.features.length > 0) {
      if (!this.map) {
        this.renderMap();
      }
      this.renderBubbles();
    }
  };

  renderMap() {
    const {
      selector,
      features,
      getPolygonClassName,
      customProjection
    } = this.props;
    const d3Container =  d3.select(selector);
    const containerComputedStyle = window.getComputedStyle(d3Container.node());
    const width = parseInt(containerComputedStyle.width);
    const height = parseInt(containerComputedStyle.height);

     this.map = d3Container.append('svg')
      .attr('width', width)
      .attr('height', height);

    const geoParent = this.map.append('g');
    const container = geoParent.append('g');
    const projection = customProjection ? d3[`geo${MapComponent.capitalize(customProjection)}`]() : d3.geoMercator();
    const path = d3.geoPath().projection(projection);
    container.selectAll('path')
      .data(features)
      .enter()
      .append('path')
      .attr('class', d => `polygon ${getPolygonClassName(d)}`)
      .attr('d', path);

    const collection = { type: 'FeatureCollection', features };
    const featureBounds = path.bounds(collection);
    const { scale, trans } = MapComponent.fitGeoInside(featureBounds, width, height);
    container.attr('transform', `translate(${trans}) scale(${scale})`);
  }

  renderBubbles() {
    const { commodity } = this.props;
    const testData = [
      {
        "size": 189744,
        "centroid": [
          656.526050761282,
          153.59300416971516
        ]
      },
      {
        "size": 474360,
        "centroid": [
          526.6430952165599,
          283.09644598407925
        ]
      },
      {
        "size": 94872,
        "centroid": [
          533.4723138369542,
          129.25835802870276
        ]
      },
      {
        "size": 94872,
        "centroid": [
          624.7122237279438,
          184.33762334979284
        ]
      },
      {
        "size": 379488,
        "centroid": [
          305.3703446682553,
          355.4622045454013
        ]
      },
      {
        "size": 569232,
        "centroid": [
          600.1119993205066,
          132.52966376726522
        ]
      },
      {
        "size": 284616,
        "centroid": [
          535.2563339091782,
          627.758530882346
        ]
      },
      {
        "size": 569232,
        "centroid": [
          665.6112561684752,
          401.72936754876696
        ]
      },
      {
        "size": 284616,
        "centroid": [
          839.350805377589,
          322.60063032436443
        ]
      },
      {
        "size": 379488,
        "centroid": [
          517.5938018612011,
          105.04964044794005
        ]
      },
      {
        "size": 284616,
        "centroid": [
          606.9392703698508,
          132.49814615853282
        ]
      },
      {
        "size": 284616,
        "centroid": [
          559.85328480189,
          259.02335284015675
        ]
      },
      {
        "size": 379488,
        "centroid": [
          492.2222200729133,
          92.66689913382153
        ]
      },
      {
        "size": 0,
        "centroid": [
          486.24110678369584,
          224.0927085101528
        ]
      },
      {
        "size": 664104,
        "centroid": [
          475.26708719965217,
          216.85582096687196
        ]
      },
      {
        "size": 664104,
        "centroid": [
          720.9526750731229,
          184.39563522797624
        ]
      },
      {
        "size": 94872,
        "centroid": [
          547.2654497767121,
          123.4732605377174
        ]
      },
      {
        "size": 284616,
        "centroid": [
          271.97019703385934,
          179.4738834385287
        ]
      },
      {
        "size": 664104,
        "centroid": [
          527.5511752096703,
          118.2330130938836
        ]
      },
      {
        "size": 189744,
        "centroid": [
          554.7177626937378,
          80.07659908800954
        ]
      },
      {
        "size": 664104,
        "centroid": [
          243.21383551032872,
          203.37969942537543
        ]
      },
      {
        "size": 569232,
        "centroid": [
          307.4591388895363,
          295.4941220979017
        ]
      },
      {
        "size": 189744,
        "centroid": [
          338.54254443505397,
          280.1198497584087
        ]
      },
      {
        "size": 284616,
        "centroid": [
          786.759985009227,
          237.46550167453077
        ]
      },
      {
        "size": 758976,
        "centroid": [
          721.5119805414155,
          173.8090648897076
        ]
      },
      {
        "size": 664104,
        "centroid": [
          543.4474207056993,
          310.65182983046134
        ]
      },
      {
        "size": 0,
        "centroid": [
          534.3973909194542,
          232.4739177958415
        ]
      },
      {
        "size": 0,
        "centroid": [
          221.067688274,
          -0.4521182625892723
        ]
      },
      {
        "size": 664104,
        "centroid": [
          501.674448071063,
          108.30091502600169
        ]
      },
      {
        "size": 474360,
        "centroid": [
          288.69347444588027,
          372.6857464621172
        ]
      }
    ];
    const bubbles = commodity === 'soy' ? testData : testData.map(d => ({ ...d, centroid: [d.centroid[1], d.centroid[0]] }));
    const radius = d3.scaleSqrt()
      .domain([0, 1e6])
      .range([0, 15]);

    this.map.append('g')
      .attr('class', 'bubble')
      .selectAll('circle')
      .data(bubbles)
      .enter().append('circle')
      .attr('transform', d => `translate(${d.centroid})`)
      .attr('r', d => radius(d.size))
      .exit().remove();
  }

  render() {
    return (
      <div class="map" />
    );
  }

}
