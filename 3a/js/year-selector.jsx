function YearSelector(props) {
    return (
      <div class="year-selector">
        <p>{props.title}</p>
        <div class="year-selector-list">
          {props.options.map(year => (
            <div class="year-selector-item" onClick={`dispatch('setActive', ${year})`}>
              <b class="year-selector-circle" />
              <p class="year-selector-label">{year}</p>
            </div>
          ))}
        </div>
      </div>
    );
}

