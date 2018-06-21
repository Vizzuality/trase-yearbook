class Datavis {
  _handleEvent = (e) => {
    this[e.type](...e.detail) || this._render();
    this.updateSmartComponents();
  };
  _setListeners() {
    window.addEventListener('setFeatures', this._handleEvent);
    window.addEventListener('setCommodity', this._handleEvent);
    window.addEventListener('setSelector', this._handleEvent);
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
    selector: false
  };

  setFeatures(topo) {
    const features = topo.features.reduce((acc, next) => ({
      ...acc,
      [parseInt(next.id, 10)]: next
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
        dispatch('setFeatures', topojson.feature(topo, topo.objects.countries))
      });
  }

  updateSmartComponents() {
    const { commodity, features } = this.state;
    dispatch('updateMap', {
      commodity,
      features
    });
  }

  render() {
    const { map } = this.smartComponents;
    const { commodity, selector } = this.state;
    return (
      <div class="container">
        {new Selector({
          open: selector,
          active: commodity,
          options: ['soy', 'sugar', 'oil-palm'],
          selectOptionAction: 'setCommodity',
          toggleOpenAction: 'setSelector',
        })}
        {map}
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
    })
  };
}

document.addEventListener("DOMContentLoaded", () => new Datavis({ selector: '#root' }));
window.dispatch = (event, ...detail) => dispatchEvent(new CustomEvent(event, { detail }));
