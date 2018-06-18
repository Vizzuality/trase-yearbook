class Datavis {
  _handleEvent = (e) => {
    this[e.type](...e.detail) || this._render();
  }
  _setListeners() {}
  _render() {
    this.root.innerHTML= '';
    this.root.appendChild(this.render());
  }
  constructor(props) {
    this.root = document.querySelector(props.selector);
    this._setListeners();
    this._render();
    this.didMount();
  }

  didMount() {
    Object.values(this.components).forEach(c => c.didMount && c.didMount());
  }

  features = [];

  render() {
    const { MapComponent } = this.components;
    return (
      <div class="container">
        {MapComponent}
      </div>
    );
  }

  components = {
    MapComponent: new MapComponent({
      selector: '.map',
      features: this.features,
      getPolygonClassName: () => 'poly'
    })
  };
}

document.addEventListener("DOMContentLoaded", () => new Datavis({ selector: '#root' }));
window.dispatch = (event, ...detail) => dispatchEvent(new CustomEvent(event, { detail }));
