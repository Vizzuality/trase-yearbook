class Selector {
  _setListeners() {
    window.addEventListener('Datavis:didUpdate', this.didMount);
  }
  _render() {
    return this.render();
  }
  constructor(props) {
    this.props = props;
    this._setListeners();
    return this._render();
  }

  didMount = () => {
    document.querySelector('.select')
      .addEventListener('change', this.props.onChange)
  }

  render() {
    const { options } = this.props;
    return (
      <select class="select" value="soy">
        {options.map(commodity => (
          <option value={commodity}>{commodity}</option>
        ))}
      </select>
    );
  }
}
