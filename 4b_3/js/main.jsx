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
    this._render();
  }
  loop = null;
  active = 2015;
  options = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];

  setActive = (active) => {
    this.active = active;
  };


  render() {
    return (
      <div class="container">
        <h1 class="title">
          Pace of expansion and invesment in soy industry
        </h1>
        <div class="map">
          <div class="map-item">
            {this.options.map(option => {
              const className = `map-item-image ${option === this.active ? '-active' : ''}`
              return (<div
                class={className}
                style={`background-image: url(assets/${option}_3.jpg)`}
              />)
            })}
          </div>
          <img class="map-legend" alt="map legend" src="assets/legend.svg" />
        </div>
        {YearSelector({ options: this.options, title: "select a year", active: this.active })}
      </div>
    );
  }

}

document.addEventListener("DOMContentLoaded", () => new Datavis({ selector: '#root' }));
window.dispatch = (event, ...detail) => dispatchEvent(new CustomEvent(event, { detail }));
