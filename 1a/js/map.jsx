
class MapComponent {
  _handleEvent = (e) => {
    this[e.type](...e.detail) || this._render();
    this.didUpdate();
  };
  _setListeners() {
    window.addEventListener('setFeatures', this._handleEvent);
  }
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
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props) {
    this.props = props;
    this._setListeners();
    this.willMount();
    return this._render();
  }

  features = [];
  setFeatures(topo) {
    this.features = topo.features;
  }

  willMount() {
    fetch('world.topo.json')
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(topo => dispatch('setFeatures', topojson.feature(topo, topo.objects.world)));
  }
  didMount() {}

  didUpdate() {
    const {
      selector,
      getPolygonClassName,
      showTooltipCallback,
      hideTooltipCallback,
      customProjection
    } = this.props;
    if (this.features.length === 0) {
      return;
    }
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
      .data(this.features)
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

    const collection = { 'type': 'FeatureCollection', 'features' : this.features };
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
