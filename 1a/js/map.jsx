
class MapComponent {
  _handleEvent = (e) => {
    this[e.type](...e.detail);
  };
  _setListeners() {
    window.addEventListener('updateMap', this._handleEvent);
    window.addEventListener('setFlowsData', this._handleEvent);
    window.addEventListener('clickedBubble', () => this.getCommodityData(true));
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
    flows: null
  };
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
    this.renderBubbles();
  }

  getCommodityData() {
    const { commodity } = this.props;
    d3.json(`data/${commodity}.json`, data => dispatch('setFlowsData', data));
  }

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
      .data(Object.values(features))
      .enter()
      .append('path')
      .attr('class', d => `polygon ${getPolygonClassName(d)}`)
      .attr('d', path);

    const collection = { type: 'FeatureCollection', features: Object.values(features) };
    const featureBounds = path.bounds(collection);
    const { scale, trans } = MapComponent.fitGeoInside(featureBounds, width, height);
    container.attr('transform', `translate(${trans}) scale(${scale})`);
  }

  renderBubbles() {
    const { flows } = this.state;
    const { features, customProjection } = this.props;
    const radius = d3.scaleSqrt()
      .domain([0, 1e7])
      .range([0, 15]);
    const projection = customProjection ? d3[`geo${MapComponent.capitalize(customProjection)}`]() : d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    const bubbles = Object.keys(flows);

    const centroids = bubbles
      .map(d => features[d] && path.centroid(features[d]))
      .filter(d => !!d);


    this.map.select('.bubbles').remove();

    this.map.append('g')
      .attr('class', 'bubbles')
      .data(bubbles)
      .selectAll('circle')
      .data(centroids)
      .enter()
      .append('circle')
      .on('click', () => dispatch('clickedBubble'))
      .attr('cx', d => d[0])
      .attr('cy', d => d[1])
      .attr('r', (d, i) => radius(flows[bubbles[i]].tons));
  }

  render() {
    console.log('render');
    return (
      <div class="map" />
    );
  }

}
