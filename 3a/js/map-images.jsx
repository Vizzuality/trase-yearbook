class MapImages {
  _handleEvent = (e) => {
    this[e.type](...e.detail);
  };
  _setListeners() {
    window.addEventListener('updateImages', this._handleEvent);
  }
  constructor(props) {
    this.props = props;
    this._setListeners();
    return this.render();
  }
  updateImages(props) {
    const prevProps = this.props;
    this.props = { ...prevProps, ...props };
    if (prevProps.active !== this.props.active) {
      this.setActiveImage();
    }
  }
  setActiveImage() {
    const images = Array.from(document.querySelectorAll('.map-image'));
    images.forEach(image => {
      if (parseInt(image.id, 10) === this.props.active) {
        image.classList.remove('hidden');
      } else {
        image.classList.add('hidden');
      }
    })
  }

  render() {
    const { images, active } = this.props;
    return (
      <div class="map-images-container">
        {images.map(image => (
          <div
            id={image}
            class={`map-image ${active === image ? '' : 'hidden'}`}
            style={`background-image: url(assets/${image}.jpg)`}
          />))
        }
        <img class="map-legend" alt="map legend" src="assets/legend.svg"/>
      </div>
    )
  }
}
