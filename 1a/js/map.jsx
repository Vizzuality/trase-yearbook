
class MapComponent {
  _handleEvent = (e) => {
    this[e.type](...e.detail);
  };
  _setListeners() {
    window.addEventListener('updateMap', this._handleEvent);
    window.addEventListener('setFlowsData', this._handleEvent);
    window.addEventListener('setSelectedBubble', this._handleEvent);
    window.addEventListener('renderOriginBubbles', this._handleEvent);
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
  static getChoroplethScale(domain) {
    const colors = [
      '-choro-1',
      '-choro-2',
      '-choro-3',
      '-choro-4',
      '-choro-5',
      '-choro-6',
      '-choro-7',
      '-choro-8',
      '-choro-9',
      '-choro-10'
    ];

    return d3.scaleQuantile()
      .domain(domain)
      .range(colors);
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
    this.renderOriginBubbles();
  }

  setSelectedBubble(exporter, exporterCentroid) {
    const selectedBubble = { ...exporter, exporterCentroid };
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

  renderBubbles(flows, onClick, parentBubble) {
    const { customProjection } = this.props;
    const radius = d3.scaleSqrt()
      .domain([0, 1e6])
      .range([2, 4, 5, 6, 8, 9, 10, 12]);
    const projection = customProjection ? d3[`geo${MapComponent.capitalize(customProjection)}`]() : d3.geoMercator();
    const { scale, trans } = this.getProjectionConfig(projection);

    const bubbles = Object.keys(flows).filter(fao => {
      const iso = FAO_TO_ISO2[parseInt(fao, 10)];
      return typeof iso !== 'undefined' && typeof COUNTRIES_COORDINATES[iso] !== 'undefined';
    });

    const centroids = bubbles
      .map(fao => FAO_TO_ISO2[parseInt(fao, 10)])
      .map(iso => projection(COUNTRIES_COORDINATES[iso]));

    const getTons = index => {
      const fao = parseInt(bubbles[index], 10);
      const flow = flows[fao];
      return flow && flow.tons;
    };

    const colorScale = MapComponent.getChoroplethScale(Object.values(flows).map(f => f.tons));

    const getExporter = index => flows[bubbles[index]];

    this.map.select('.bubbles').remove();

    this.map.append('g')
      .attr('class', 'bubbles')
      .selectAll('circle')
      .data(centroids)
      .enter()
      .append('circle')
      .attr('class', (d, i) => `bubble choro ${colorScale(getTons(i))}`)
      .on('click', (d, i) => onClick && onClick(getExporter(i), d))
      .on('mouseover', (d, i) => {
        const fao = bubbles[i];
        const name = FAO_TO_COUNTRY[parseInt(fao, 10)];
        const value = getExporter(i).tons;
        dispatch('showTooltip', name, value);
      })
      .on('mouseout', () => dispatch('hideTooltip'))
      .attr('cx', d => parentBubble ? parentBubble[0] : d[0])
      .attr('cy', d => parentBubble ? parentBubble[1] : d[1])
      .attr('transform', `translate(${trans}) scale(${scale})`)
      .attr('r', (d, i) => radius(getTons(i)));

    if (parentBubble) {
      this.map.selectAll('.bubble').each(function (d) {
        const bubble = d3.select(this);
        if (bubble) {
          bubble.transition()
            .duration(1000)
            .attr('cx', () => d[0])
            .attr('cy', () => d[1]);
        }
      });
    }
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
          polygon.attr('class', () => getPolygonClassName(d))
            .on('mouseover', null)
            .on('mouseout', null);
        }
      });
  }

  renderOriginBubbles() {
    dispatch('setCanResetMap', false);
    const onClick = (exporter, exporterCentroid) => dispatch('setSelectedBubble', exporter, exporterCentroid);
    this.renderExporterCountries();
    this.renderBubbles(this.state.flows, onClick);
  }

  renderDestinationBubbles() {
    const { destinations, exporterCentroid } = this.state.selectedBubble;
    this.renderBubbles(destinations, null, exporterCentroid);
    setTimeout(() => this.renderChoropleth(), 3500);
  }

  renderChoropleth() {
    this.map.select('.bubbles').remove();
    const getPolygonClassName = (d) => {
      const { selectedBubble } = this.state;
      const fao = ISO2_TO_FAO[d.properties.iso2];
      const { destinations } = selectedBubble;
      const tons = Object.values(destinations).map(d => d.tons);

      const colorScale = MapComponent.getChoroplethScale(tons);
      const destination = destinations[fao];
      return destination && destination.tons ? `polygon choro ${colorScale(destination.tons)}` : 'polygon'
    };
    const onMouseOver = d => {
      const { selectedBubble } = this.state;
      const fao = ISO2_TO_FAO[d.properties.iso2];
      const name = FAO_TO_COUNTRY[fao];
      const { destinations } = selectedBubble;
      const destination = destinations[fao];
      const value = destination && destination.tons;
      if (value) {
        dispatch('showTooltip', name, value);
      }
    };

    this.polygons
      .each(function (d) {
        const polygon = d3.select(this);
        if (polygon) {
          polygon.attr('class', () => getPolygonClassName(d))
            .on('mouseover', onMouseOver)
            .on('mouseout', () => dispatch('hideTooltip'));
        }
      });

    setTimeout(() => dispatch('setCanResetMap', true), 700);
  }

  render() {
    return (
      <div class="map" />
    );
  }

}
