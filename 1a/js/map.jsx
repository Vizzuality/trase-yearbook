
class MapComponent {
  _handleEvent = (e) => {
    this[e.type](...e.detail) || this._render();
  };
  _setListeners() {}
  _render() {
    return Object.assign(this.render(), { didMount: this.didMount.bind(this) });
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
    string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props) {
    this.props = props;
    this._setListeners();
    return this._render();
  }

  features = [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              18.28125,
              -33.7243396617476
            ],
            [
              16.875,
              -30.751277776257812
            ],
            [
              21.09375,
              -33.7243396617476
            ],
            [
              25.3125,
              -33.137551192346145
            ],
            [
              29.53125,
              -31.95216223802496
            ],
            [
              33.046875,
              -28.30438068296277
            ],
            [
              34.453125,
              -21.289374355860424
            ],
            [
              35.859375,
              -17.308687886770024
            ],
            [
              40.078125,
              -15.961329081596647
            ],
            [
              40.78125,
              -10.487811882056683
            ],
            [
              39.375,
              -5.615985819155327
            ],
            [
              39.375,
              -1.4061088354351594
            ],
            [
              44.29687499999999,
              2.1088986592431382
            ],
            [
              49.92187499999999,
              9.102096738726456
            ],
            [
              50.625,
              13.923403897723347
            ],
            [
              45.703125,
              11.178401873711785
            ],
            [
              41.484375,
              14.604847155053898
            ],
            [
              40.078125,
              17.97873309555617
            ],
            [
              35.859375,
              23.241346102386135
            ],
            [
              33.75,
              27.059125784374068
            ],
            [
              31.640625,
              31.353636941500987
            ],
            [
              28.125,
              32.54681317351514
            ],
            [
              21.796875,
              33.7243396617476
            ],
            [
              18.984375,
              30.751277776257812
            ],
            [
              11.25,
              36.59788913307022
            ],
            [
              7.734374999999999,
              38.272688535980976
            ],
            [
              -0.703125,
              36.59788913307022
            ],
            [
              -8.4375,
              35.460669951495305
            ],
            [
              -11.25,
              30.751277776257812
            ],
            [
              -16.171875,
              23.885837699862005
            ],
            [
              -14.765625,
              15.284185114076433
            ],
            [
              -9.140625,
              4.915832801313164
            ],
            [
              1.40625,
              6.315298538330033
            ],
            [
              8.4375,
              4.915832801313164
            ],
            [
              9.84375,
              -2.108898659243126
            ],
            [
              11.953125,
              -10.487811882056683
            ],
            [
              11.25,
              -16.63619187839765
            ],
            [
              14.765625,
              -26.431228064506424
            ],
            [
              18.28125,
              -33.7243396617476
            ]
          ]
        ]
      }
    }
  ];

  didMount() {
    const {
      selector,
      features,
      getPolygonClassName,
      showTooltipCallback,
      hideTooltipCallback,
      customProjection
    } = this.props;
    const d3Container =  d3.select(selector);
    const containerComputedStyle = window.getComputedStyle(d3Container.node());
    const width = parseInt(containerComputedStyle.width);
    const height = parseInt(containerComputedStyle.height);

    const svg = d3Container.append('svg')
      .attr('width', width)
      .attr('height', height);

    const geoParent = svg.append('g');
    const container = geoParent.append('g');

    const projection = customProjection ? d3[`geo${MapComponent.capitalize(customProjection)}`]() : d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    const polygons = container.selectAll('path')
      .data(features)
      .enter()
      .append('path')
      .attr('class', d => {
        return `polygon ${getPolygonClassName(d)}`;
      })
      .attr('d', path);

    if (typeof showTooltipCallback !== 'undefined') {
      polygons.on('mousemove', d => showTooltipCallback(
        d,
        d3.event.clientX + 10,
        d3.event.clientY + window.scrollY + 10
        ))
        .on('mouseout', () => hideTooltipCallback());
    }

    const collection = { 'type': 'FeatureCollection', 'features' : features };
    const featureBounds = path.bounds(collection);
    const { scale, trans } = MapComponent.fitGeoInside(featureBounds, width, height);
    container.attr('transform', `translate(${trans}) scale(${scale})`);

    container.selectAll('path').style('stroke-width', .5 / scale);
  }

  render() {
    return (
      <div class="map"/>
    );
  }

}

document.addEventListener("DOMContentLoaded", () => new Datavis({ selector: '#root' }));
