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
  active = 2005;
  options = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];
  setActive = (active, loop) => {
    this.active = active;
    if (!loop && this.interval) {
      clearInterval(this.interval);
    }
  };

  didMount() {
    this.interval = setInterval(() => {
      const index = this.options.indexOf(this.active);
      const option = this.options[index + 1] || this.options[0];
      dispatch('setActive', option, true);
    }, 2000);
  }

  render() {
    return (
      <div class="container">
        <h1 class="title">
          Pace of expansion and invesment in soy industry
        </h1>
        <div class="map">
          {Array.from(Array(5).keys()).map(index => {
            return (
              <div class="map-item">
                {this.options.map(option => {
                  const className = `map-item-image ${option === this.active ? '-active' : ''}`
                  return (<div
                    class={className}
                    style={`background-image: url(assets/${option}_${index + 1}.jpg)`}
                  />)
                })}
              </div>
            );
          })}
          <img class="map-legend" alt="map legend" src="assets/legend.svg" />
        </div>
        {YearSelector({ options: this.options, title: "select a year", active: this.active })}
      </div>
    );
  }

}

document.addEventListener("DOMContentLoaded", () => new Datavis({ selector: '#root' }));
window.dispatch = (event, ...detail) => dispatchEvent(new CustomEvent(event, { detail }));
