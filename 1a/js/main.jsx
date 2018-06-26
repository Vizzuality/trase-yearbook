class Datavis {
  _handleEvent = (e) => {
    this[e.type](...e.detail) || this._render();
    this.updateSmartComponents();
  };
  _setListeners() {
    window.addEventListener('setFeatures', this._handleEvent);
    window.addEventListener('setCommodity', this._handleEvent);
    window.addEventListener('setSelector', this._handleEvent);
    window.addEventListener('setCanResetMap', this._handleEvent);
    window.addEventListener('handleInfoClick', this._handleEvent);
    window.addEventListener('handleCloseInfo', this._handleEvent);
  }
  _render() {
    this.root.innerHTML= '';
    this.root.appendChild(this.render());
  }
  constructor(props) {
    this.props = props;
    this.root = document.querySelector(props.selector);
    this._setListeners();
    this.willMount();
    this._render();
  }

  state = {
    commodity: 'soy',
    features: null,
    selector: false,
    canResetMap: false,
    infoOpened: false
  };

  commoditiesText = {
    'soy':
      <div class="info-text">
        <p>Soybean is a leguminous crop, grown primarily for its application, via crushing, in vegetable oils (including as biofuel) and for its properties as a high-protein constituent of animal feed.</p>
        <p>Production has increased from 27m tonnes in 1961 to <a href="http://www.fao.org/faostat/en/#home" target="_blank">335m tonnes in 2016</a>. The US, Brazil and Argentina dominate global production (accounting for 80%), and exports (around 86%), with Brazil being the <a href="https://apps.fas.usda.gov/Gats/default.aspx" target="_blank">leading export player in 2016</a> (35% of global total exports).</p>
        <p>Historically, key importing regions for global soy production have included the US and countries in the EU but China has quickly grown to become the dominant force in soy markets, accounting for <a href="http://www.bik-f.de/root/index.php?page_id=1093" target="_blank">27% of global imports in 2013</a>. More recent sources suggest that Chinese imports could now be as much as 60% of global imports.</p>
        <p>While soy represents an economic ‘success story’ for markets and countries in, for example, South America, supply chains are associated with various <a href="http://wwf.panda.org/our_work/food/agriculture/soy/impacts/" target="_blank">environmental and social impacts</a>, including the pollution of groundwater and freshwater reserves, an increase in carbon emissions from deforestation, loss of biodiversity, and the exploitation of workers. Production in biodiversity-sensitive areas in Brazil, Argentina and Paraguay means that soy has become a key target for activity to reduce deforestation risk in supply chains.</p>
      </div>,
    'oil-palm':
      <div class="info-text">
        <p>Palm oil is used in a wide range of products, including foods, cosmetics, cleaning products and fuels. It is a higher yielding crop than others used for vegetable oils, and has a lower cost of production, prompting an increasing demand and expansion of plantations.</p>
        <p>The global production of palm oil has increased from 14 million tonnes in 1961 to <a href="http://www.fao.org/faostat/en/#home" target="_blank">300 million tonnes in 2016</a>. The top two producers, Indonesia and Malaysia, together accounted for 82% of total global production in 2016 (53% and, 29% respectively), and in 2013 accounted for 93% of global exports (54% and 39% respectively).</p>
        <p>Imports of palm oil have rapidly increased along with production, and in 2013 the biggest importers of palm oil were India and China, together accounting for <a href="http://www.bik-f.de/root/index.php?page_id=1093" target="_blank">a third of global palm oil imports</a> (18% and 15% respectively).</p>
        <p>The rapid growth of palm oil production has driven a range of environmental and social problems, including the displacement of indigenous peoples, deforestation and the loss of tropical biodiversity.</p>
      </div>,
    'sugar':
      <div class="info-text">
        <p>Sugar crops, comprised of both sugarcane and beet, are refined for use in both food manufacture and in the production of biofuels and bioplastics. Sugarcane is grown in tropical regions.</p>
        <p>Globally, production of raw sugar derived from sugarcane and beet has increased from 53 million tonnes in 1961 to 179 million tonnes in 2013. Five producers account for around <a href="http://www.fao.org/faostat/en/#home" target="_blank">50% of total supply</a>: Brazil (20%), India (14%), China (7%), Thailand (5%) and the United states (4%).</p>
        <p>Brazil is by far the most dominant exporter (42% of global exports in 2013) and exports over <a href="http://www.bik-f.de/root/index.php?page_id=1093" target="_blank">four times as much</a> as the next largest exporting nation (Thailand, 9%).</p>
        <p>Import of sugar is not dominated by any country in particular, but China and the US are both significant importers each accounting for 7% of global imports.</p>
        <p>Sugar is a highly water-intensive crop, and other environmental impacts include habitat loss from land clearing, land degradation, water and air pollution from fertilizers, eroded soils and industrial waste. Sugar production in some areas of the world is also associated with poor working conditions.</p>
      </div>
  };

  setFeatures(topo) {
    const features = topo.features.filter(feat => feat.properties.iso2 !== 'AQ')
      .reduce((acc, next) => ({
        ...acc,
        [next.properties.iso2]: next
      }), {});
    this.state = { ...this.state, features };
  }

  setCommodity(commodity) {
    this.state = { ...this.state, commodity, selector: false };
  }

  setSelector(selector) {
    if (selector) {
      requestAnimationFrame(() => window.addEventListener('click', this.onBackgroundClick));
    }
    this.state = { ...this.state, selector };
  }

  setCanResetMap(canResetMap) {
    this.state = { ...this.state, canResetMap };
  }

  onBackgroundClick = ({ target }) => {
    const selector = document.querySelector('.selector');
    if (!selector.contains(target)) {
      window.removeEventListener('click', this.onBackgroundClick);
      dispatch('setSelector', false);
    }
  };

  willMount() {
    fetch('data/world.topo.json')
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(topo => {
        dispatch('setFeatures', topojson.feature(topo, topo.objects.world))
      });
  }

  updateSmartComponents() {
    const { commodity, features } = this.state;
    dispatch('updateMap', {
      commodity,
      features
    });
  }

  handleInfoClick() {
    this.state = { ...this.state, infoOpened: true };
  }

  handleCloseInfo() {
    this.state = { ...this.state, infoOpened: false };
  }

  render() {
    const { map, tooltip } = this.smartComponents;
    const { commodity, selector, canResetMap, infoOpened } = this.state;
    const commodityText = this.commoditiesText[commodity];
    return (
      <div class="container">
        {!infoOpened ?
          <div>
            <div class="map-header">
              <div class="title-container">
                <h1 class="title">Global trade in key deforestation risk commodities in 2013</h1>
              </div>
              <div class="controls">
                {new Selector({
                  open: selector,
                  active: commodity,
                  options: ['soy', 'sugar', 'oil-palm'],
                  selectOptionAction: 'setCommodity',
                  toggleOpenAction: 'setSelector',
                })}
                <button
                  onClick={`dispatch('renderOriginBubbles')`}
                  class={`reset ${canResetMap ? '' : '-disabled'}`}
                >
                  <span class="selector-text">Reset</span>
                </button>
                <button
                  onClick={`dispatch('handleInfoClick')`}
                  class="reset info-button"
                >
                  i
                </button>
              </div>
            </div>
            {map}
            <div class="map-footer">
              {!canResetMap ?
                <span class="map-footer-text">
                  Click a production country to see the destination of the selected commodity
                </span>
               : ''
              }
            </div>
          </div>
          : ''
        }
        {infoOpened ?
          <div class="info-container">
            <div class="info-container-header">
              <button
                class="reset close-button"
                onClick={`dispatch('handleCloseInfo')`}
              >
              X
              </button>
            </div>
            {commodityText}
          </div>
          : ''
        }
        {tooltip}
      </div>
    );
  }

  smartComponents = {
    map: new MapComponent({
      features: this.state.features,
      commodity: this.state.commodity,
      selector: '.map',
      customProjection: 'robinson',
      getPolygonClassName: () => 'poly'
    }),
    tooltip: new Tooltip()
  };
}

document.addEventListener("DOMContentLoaded", () => new Datavis({ selector: '#root' }));
window.dispatch = (event, ...detail) => dispatchEvent(new CustomEvent(event, { detail }));
