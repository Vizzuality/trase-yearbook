
class MapComponent {
  _handleEvent = (e) => {
    this[e.type](...e.detail);
  };
  _setListeners() {
    window.addEventListener('updateMap', this._handleEvent);
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

  map = null;

  updateMap = (props) => {
    this.props = { ...this.props, ...props };
    if (this.props.features.length > 0) {
      if (!this.map) {
        this.renderMap();
      }
    }
  };

  renderMap() {
    const {
      selector,
      features,
      showTooltipCallback,
      hideTooltipCallback,
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
    const polygons = container.selectAll('path')
      .data(features)
      .enter()
      .append('path')
      .attr('class', d => `polygon ${getPolygonClassName(d)}`)
      .attr('d', path);

      if (typeof showTooltipCallback !== 'undefined') {
        polygons.on('mousemove', d => showTooltipCallback(
          d,
          d3.event.clientX + 10,
          d3.event.clientY + window.scrollY + 10
          ))
          .on('mouseout', () => hideTooltipCallback());
      }

    const collection = { type: 'FeatureCollection', features };
    const featureBounds = path.bounds(collection);
    const { scale, trans } = MapComponent.fitGeoInside(featureBounds, width, height);
    container.attr('transform', `translate(${trans}) scale(${scale})`);
  }

  render() {
    console.log('render');
    return (
      <div class="map" />
    );
  }

}
