class Datavis {
  _handleEvent = (e) => {
    this[e.type](...e.detail) || this._render();
    this.updateSmartComponents();
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
  state = {
    active: 1975,
    options: [1975, 1985, 1995, 2005, 2015]
  }

  setActive = (active, loop) => {
    this.state = { ...this.state, active };
    if (!loop && this.interval) {
      clearInterval(this.interval);
    }
  };

  didMount() {
    this.interval = setInterval(() => {
      const index = this.state.options.indexOf(this.state.active);
      const option = this.state.options[index + 1] || this.state.options[0];
      dispatch('setActive', option, true);
    }, 2000);
  }

  updateSmartComponents() {
    const { options, active } = this.state;
    dispatch('updateImages', {
      options,
      active
    });
  }

  render() {
    const { active, options } = this.state;
    const { Images } = this.smartComponents;
    return (
      <div class="container">
        <h1 class="title">
          Soy expansion in Brazil, Argentina<br />and Paraguay
        </h1>
        {Images}
        {YearSelector({ options, active, title: "select a year" })}
      </div>
    );
  }

  smartComponents = {
    Images: new MapImages({ images: this.state.options, active: this.state.active })
  }

}

document.addEventListener("DOMContentLoaded", () => new Datavis({ selector: '#root' }));
window.dispatch = (event, ...detail) => dispatchEvent(new CustomEvent(event, { detail }));
