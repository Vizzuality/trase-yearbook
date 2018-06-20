function Selector(props) {
  const { options, open, active, selectOptionAction, toggleOpenAction } = props;
  return (
    <div
      class={`selector ${open ? '-open' : ''}`}
    >
      <button
        class="selector-button selector-text"
        onClick={`dispatch('${toggleOpenAction}', ${!open})`}>{active}</button>
      <ul class="selector-list">
        {options.map(option => (
          <li
            class="selector-list-item"
            onClick={`dispatch('${selectOptionAction}', '${option}')`}
          >
            <span
              class="selector-list-item-name selector-text"
            >
              {option}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
