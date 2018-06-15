function YearSelector(props) {

  return (
    <div>
      <p>{props.title}</p>
      {props.options.map(year => (
        <button data-value={year} onclick={`dispatch('setActive', ${year})`}>{year}</button>
      ))}
    </div>
  )
}

