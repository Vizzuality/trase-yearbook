class Datavis {
  _handleEvent = (e) => {
    e.stopPropagation();
    this[e.type](...e.detail) || this._render();
    dispatch('Datavis:didUpdate');
  }
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
    features: [],
    selector: false
  };

  setFeatures(topo) {
    this.state = { ...this.state, features: topo.features };
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
    fetch('world.topo.json')
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(topo => dispatch('setFeatures', topojson.feature(topo, topo.objects.countries)));
  }

  render() {
    const { features, commodity, selector } = this.state;
    return (
      <div class="container">
        {new Selector({
          open: selector,
          active: commodity,
          options: ['soy', 'beef', 'coffee'],
          selectOptionAction: 'setCommodity',
          toggleOpenAction: 'setSelector',
        })}
        {new MapComponent({
          features,
          commodity,
          selector: '.map',
          customProjection: 'robinson',
          getPolygonClassName: () => 'poly'
        })}
      </div>
    );
  }
}

document.addEventListener("DOMContentLoaded", () => new Datavis({ selector: '#root' }));
window.dispatch = (event, ...detail) => dispatchEvent(new CustomEvent(event, { detail }));
