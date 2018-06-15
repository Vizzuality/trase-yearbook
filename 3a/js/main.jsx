class Datavis {
  _handleEvent = e => this[e.type](...e.detail) || this.render();
  _setListeners() {
    window.addEventListener('setActive', this._handleEvent);
  }
  constructor(selector) {
    this.root = document.querySelector(selector);
    this.render();
    this._setListeners()
  }

  active = 2015;
  title = "Pace of expansion and invesment in soy industry";
  options = [1975, 1985, 1995, 2005, 2015];
  setActive = (active) => {
    this.active = active;
  };

  render() {
    this.root.innerHTML= '';
    console.log(this.active);
    this.root.appendChild(
      <div>
        <p>{this.title}</p>
        <div class="map" style={`background-image: url(assets/${this.active}.jpg)`} />
        {YearSelector({ options: this.options, title: "select a year", setActive: this.setActive })}
      </div>
    );
  }

}

document.addEventListener("DOMContentLoaded", () => new Datavis('#root'));
window.dispatch = (event, ...detail) => dispatchEvent(new CustomEvent(event, { detail }));
