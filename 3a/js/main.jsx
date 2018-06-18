class Datavis {
  _handleEvent = (e) => {
    this[e.type](...e.detail) || this._render();
  }
  _setListeners() {
    window.addEventListener('setActive', this._handleEvent);
  }
  _render() {
    this.root.innerHTML= '';
    this.root.appendChild(this.render());
  }
  constructor(props) {
    this.root = document.querySelector(props.selector);
    this._setListeners();
    this.didMount();
    this.render();
  }
  loop = null;
  active = 1975;
  options = [1975, 1985, 1995, 2005, 2015];
  setActive = (active, loop) => {
    this.active = active;
    if (!loop && this.interval) {
      clearInterval(this.interval);
    }
  };
  components = {
    YearSelector: YearSelector({
      options: this.options,
      title: "select a year",
      active: this.active
    })
  }

  didMount() {
    this.interval = setInterval(() => {
      const index = this.options.indexOf(this.active);
      const option = this.options[index + 1] || this.options[0];
      dispatch('setActive', option, true);
    }, 1000);
    Object.values(this.components).forEach(c => c.didMount && c.didMount());
  }

  render() {
    const { YearSelector } = this.components;
    return (
      <div class="container">
        <h1 class="title">
          Pace of expansion and invesment<br />in soy industry
        </h1>
        <div class="map" style={`background-image: url(assets/${this.active}.jpg)`}>
          <img class="map-legend" alt="map legend" src="assets/legend.svg" />
        </div>
        {YearSelector}
      </div>
    );
  }

}

document.addEventListener("DOMContentLoaded", () => new Datavis({ selector: '#root' }));
window.dispatch = (event, ...detail) => dispatchEvent(new CustomEvent(event, { detail }));
