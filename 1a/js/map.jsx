
class MapComponent {
  _handleEvent = (e) => {
    this[e.type](...e.detail);
  };
  _setListeners() {
    window.addEventListener('updateMap', this._handleEvent);
    window.addEventListener('setFlowsData', this._handleEvent);
    window.addEventListener('setSelectedBubble', this._handleEvent);
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
    return this.render();
  }

  state = {
    flows: null,
    selectedBubble: null
  };
  polygons = null;
  map = null;

  updateMap = (props) => {
    const prevProps = this.props;
    this.props = { ...prevProps, ...props };
    if (this.props.features !== null) {
      if (!this.map) {
        this.renderMap();
        this.getCommodityData();
      }
      if (prevProps.commodity !== this.props.commodity) {
        this.getCommodityData();
      }
    }
  };

  setFlowsData(flows) {
    this.state = { ...this.state, flows };
    const onClick = exporter => dispatch('setSelectedBubble', exporter);
    this.renderBubbles(this.state.flows, onClick);
    this.renderExporterCountries();
  }

  setSelectedBubble(selectedBubble) {
    this.state = { ...this.state, selectedBubble };
    this.renderDestinationBubbles();
  }

  getCommodityData() {
    const { commodity } = this.props;
    d3.json(`data/${commodity}.json`, data => dispatch('setFlowsData', data));
  }

  getProjectionConfig(projection) {
    const { features, selector } = this.props;
    const d3Container = d3.select(selector);
    const containerComputedStyle = window.getComputedStyle(d3Container.node());
    const width = parseInt(containerComputedStyle.width);
    const height = parseInt(containerComputedStyle.height);

    const path = d3.geoPath().projection(projection);
    const collection = { type: 'FeatureCollection', features: Object.values(features) };
    const featureBounds = path.bounds(collection);
    const { scale, trans } = MapComponent.fitGeoInside(featureBounds, width, height);
    return { scale, trans, path };
  }

  renderMap() {
    const {
      selector,
      features,
      customProjection
    } = this.props;
    const d3Container = d3.select(selector);
    const containerComputedStyle = window.getComputedStyle(d3Container.node());
    const width = parseInt(containerComputedStyle.width);
    const height = parseInt(containerComputedStyle.height);

     this.map = d3Container.append('svg')
      .attr('width', width)
      .attr('height', height);

    const geoParent = this.map.append('g');
    const container = geoParent.append('g');
    const projection = customProjection ? d3[`geo${MapComponent.capitalize(customProjection)}`]() : d3.geoMercator();
    container.selectAll('path');

    const { path, scale, trans } = this.getProjectionConfig(projection);

    this.polygons = container.selectAll('path')
      .data(Object.values(features))
      .enter()
      .append('path')
      .attr('class', () => `polygon`)
      .attr('d', path);


    container.attr('transform', `translate(${trans}) scale(${scale})`);
  }

  renderBubbles(flows, onClick) {
    const { customProjection } = this.props;
    const radius = d3.scaleSqrt()
      .domain([0, 1e7])
      .range([0, 15]);
    const projection = customProjection ? d3[`geo${MapComponent.capitalize(customProjection)}`]() : d3.geoMercator();
    const { scale, trans } = this.getProjectionConfig(projection);

    const bubbles = Object.keys(flows);
    const centroids = bubbles
      .map(fao => FAO_TO_ISO2[parseInt(fao, 10)])
      .filter(iso => typeof iso !== 'undefined' && typeof COUNTRIES_COORDINATES[iso] !== 'undefined')
      .map(iso => projection(COUNTRIES_COORDINATES[iso]));

    const getTons = index => {
      const fao = parseInt(bubbles[index], 10);
      const flow = flows[fao];
      return flow && flow.tons;
    };

    const getExporter = index => flows[bubbles[index]];

    this.map.select('.bubbles').remove();

    this.map.append('g')
      .attr('class', 'bubbles')
      .selectAll('circle')
      .data(centroids)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .on('click', (d, i) => onClick(getExporter(i)))
      .attr('cx', d => d[0])
      .attr('cy', d => d[1])
      .attr('transform', `translate(${trans}) scale(${scale})`)
      .attr('r', (d, i) => radius(getTons(i)));
  }

  renderExporterCountries() {
    const getPolygonClassName = (d) => {
      const { flows } = this.state;
      const fao = ISO2_TO_FAO[d.properties.iso2];
      return flows[fao] ? 'polygon -initial' : 'polygon'
    };
    this.polygons
      .each(function (d) {
        const polygon = d3.select(this);
        if (polygon) {
          polygon.attr('class', () => getPolygonClassName(d));
        }
      });
  }

  renderDestinationBubbles() {
    const flows = this.state.selectedBubble.destinations;
    this.renderBubbles(flows, this.renderChoropleth.bind(this));
  }

  renderChoropleth() {
    this.map.select('.bubbles').remove();
    const getPolygonClassName = (d) => {
      const { selectedBubble } = this.state;
      const fao = ISO2_TO_FAO[d.properties.iso2];
      const { destinations } = selectedBubble;
      const tons = Object.values(destinations).map(d => t.tons);
      const colors = [
        'red',
        'blue',
        'green',
        'yellow',
        'orange',
        'pink'
      ];
      const colorScale = d3.scale.quantile()
        .domain(tons)
        .range(colors);

      const destination = destinations[fao];
      return destination && destination.tons ? `polygon -${colorScale(destination.tons)}` : 'polygon'
    };
    this.polygons
      .each(function (d) {
        const polygon = d3.select(this);
        if (polygon) {
          polygon.attr('class', () => getPolygonClassName(d));
        }
      });
  }

  render() {
    return (
      <div class="map" />
    );
  }

}
