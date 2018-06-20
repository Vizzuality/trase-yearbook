function YearSelector(props) {
  return function () {
    var _elem = document.createElement("div");

    _elem.setAttribute("class", "year-selector");

    _elem.appendChild(document.createTextNode("\n        "));

    var _elem2 = document.createElement("p");

    _elem2.setAttribute("class", "year-selector-title");

    var _expr = props.title,
        _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

    if (_res instanceof Array) {
      for (var _i3 = 0; _i3 < _res.length; _i3 += 1) {
        _elem2.appendChild(_res[_i3] instanceof Node || _res[_i3] instanceof Array ? _res[_i3] : document.createTextNode(_res[_i3]));
      }
    } else _elem2.appendChild(_res);

    _elem.appendChild(_elem2);

    _elem.appendChild(document.createTextNode("\n        "));

    var _elem3 = document.createElement("div");

    _elem3.setAttribute("class", "year-selector-list");

    _elem3.appendChild(document.createTextNode("\n          "));

    var _expr2 = props.options.map(function (year) {
      return function () {
        var _elem4 = document.createElement("div");

        _elem4.setAttribute("class", "year-selector-item");

        _elem4.setAttribute("onClick", "dispatch('setActive', " + year + ")");

        _elem4.appendChild(document.createTextNode("\n              "));

        var _elem5 = document.createElement("div");

        _elem5.setAttribute("class", "year-selector-circle-container");

        _elem5.appendChild(document.createTextNode("\n                "));

        var _elem6 = document.createElement("b");

        _elem6.setAttribute("class", "year-selector-circle " + (props.active === year ? 'active' : ''));

        _elem5.appendChild(_elem6);

        _elem5.appendChild(document.createTextNode("\n              "));

        _elem4.appendChild(_elem5);

        _elem4.appendChild(document.createTextNode("\n              "));

        var _elem7 = document.createElement("p");

        _elem7.setAttribute("class", "year-selector-label");

        var _expr3 = year,
            _res3 = _expr3 instanceof Node || _expr3 instanceof Array ? _expr3 : document.createTextNode(_expr3);

        if (_res3 instanceof Array) {
          for (var _i5 = 0; _i5 < _res3.length; _i5 += 1) {
            _elem7.appendChild(_res3[_i5] instanceof Node || _res3[_i5] instanceof Array ? _res3[_i5] : document.createTextNode(_res3[_i5]));
          }
        } else _elem7.appendChild(_res3);

        _elem4.appendChild(_elem7);

        _elem4.appendChild(document.createTextNode("\n            "));

        return _elem4;
      }();
    }),
        _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

    if (_res2 instanceof Array) {
      for (var _i6 = 0; _i6 < _res2.length; _i6 += 1) {
        _elem3.appendChild(_res2[_i6] instanceof Node || _res2[_i6] instanceof Array ? _res2[_i6] : document.createTextNode(_res2[_i6]));
      }
    } else _elem3.appendChild(_res2);

    _elem3.appendChild(document.createTextNode("\n        "));

    _elem.appendChild(_elem3);

    _elem.appendChild(document.createTextNode("\n      "));

    return _elem;
  }();
}
