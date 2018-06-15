function YearSelector(props) {
    return (
      <div class="year-selector">
        <p class="year-selector-title">{props.title}</p>
        <div class="year-selector-list">
          {props.options.map(year => (
            <div class="year-selector-item" onClick={`dispatch('setActive', ${year})`}>
              <div class="year-selector-circle-container">
                <b class={`year-selector-circle ${props.active === year ? 'active' : ''}`}/>
              </div>
              <p class="year-selector-label">{year}</p>
            </div>
          ))}
        </div>
      </div>
    );
}

