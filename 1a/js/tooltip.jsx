
class Tooltip {
  _handleEvent = (e) => {
    this[e.type](...e.detail);
  };
  _setListeners() {
    window.addEventListener('showTooltip', this._handleEvent);
    window.addEventListener('hideTooltip', this._handleEvent);
    document.addEventListener('mousemove', this.setTooltipPosition);
  }
  constructor(props) {
    this.props = props;
    this._setListeners();
    return this.render();
  }

  setTooltipPosition(e) {
    const tooltip = document.querySelector('.tooltip');
    let offsetX = 0;
    let offsetY = 0;
    if (e.clientX + tooltip.offsetWidth > window.innerWidth) {
      offsetX = -tooltip.offsetWidth;
    }
    if (e.clientY + tooltip.offsetHeight > window.innerHeight) {
      offsetY = -tooltip.offsetHeight;
    }
    tooltip.style.left = `${Math.max(0, e.clientX + offsetX)}px`;
    tooltip.style.top = `${e.clientY + offsetY}px`;
  }

  showTooltip(name, value) {
    const format = d3.format(',d');
    document.querySelector('.tooltip').style.opacity = 1;
    document.querySelector('.tooltip .name').innerHTML = name;
    document.querySelector('.tooltip .content .value').innerHTML = format(value);
  }

  hideTooltip() {
    document.querySelector('.tooltip').style.opacity = 0;
  }

  render() {
    return (
      <div class="tooltip">
        <div class="name">
          NAME
        </div>
        <div class="content">
          <span class="value">XXX</span>
          <span class="unit">t</span>
        </div>
      </div>
    );
  }
}
