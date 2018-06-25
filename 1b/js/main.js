"use strict";

var FAO_TO_ISO2 = { others: "Others", "1": "Armenia", "2": "Afghanistan", "3": "Albania", "4": "Algeria", "6": "Andorra", "7": "Angola", "8": "Antigua and Barbuda", "9": "Argentina", "10": "Australia", "11": "Austria", "12": "Bahamas", "13": "Bahrain", "14": "Barbados", "16": "Bangladesh", "18": "Bhutan", "19": "Bolivia", "20": "Botswana", "21": "Brazil", "23": "Belize", "25": "Solomon Islands", "26": "Brunei Darussalam", "27": "Bulgaria", "28": "Myanmar", "29": "Burundi", "32": "Cameroon", "33": "Canada", "35": "Cabo Verde", "37": "Central African Republic", "38": "Sri Lanka", "39": "Chad", "40": "Chile", "41": "China", "44": "Colombia", "45": "Comoros", "46": "Congo", "47": "Cook Islands", "48": "Costa Rica", "49": "Cuba", "50": "Cyprus", "52": "Azerbaijan", "53": "Benin", "54": "Denmark", "55": "Dominica", "56": "Dominican Republic", "57": "Belarus", "58": "Ecuador", "59": "Egypt", "60": "El Salvador", "61": "Equatorial Guinea", "63": "Estonia", "64": "Faroe Islands (Associate Member)", "66": "Fiji", "67": "Finland", "68": "France", "72": "Djibouti", "73": "Georgia", "74": "Gabon", "75": "Gambia", "79": "Germany", "80": "Bosnia and Herzegovina", "81": "Ghana", "83": "Kiribati", "84": "Greece", "86": "Grenada", "89": "Guatemala", "90": "Guinea", "91": "Guyana", "93": "Haiti", "95": "Honduras", "97": "Hungary", "98": "Croatia", "99": "Iceland", "100": "India", "101": "Indonesia", "102": "Iran (Islamic Republic of)", "103": "Iraq", "104": "Ireland", "105": "Israel", "106": "Italy", "107": "Côte d'Ivoire", "108": "Kazakhstan", "109": "Jamaica", "110": "Japan", "112": "Jordan", "113": "Kyrgyzstan", "114": "Kenya", "115": "Cambodia", "116": "Democratic People's Republic of Korea", "117": "Republic of Korea", "118": "Kuwait", "119": "Latvia", "120": "Lao People's Democratic Republic", "121": "Lebanon", "122": "Lesotho", "123": "Liberia", "124": "Libya", "126": "Lithuania", "127": "Marshall Islands", "129": "Madagascar", "130": "Malawi", "131": "Malaysia", "132": "Maldives", "133": "Mali", "134": "Malta", "136": "Mauritania", "137": "Mauritius", "138": "Mexico", "140": "Monaco", "141": "Mongolia", "143": "Morocco", "144": "Mozambique", "145": "Micronesia (Federated States of)", "146": "Republic of Moldova", "147": "Namibia", "148": "Nauru", "149": "Nepal", "150": "Netherlands", "154": "The former Yugoslav Republic of Macedonia", "155": "Vanuatu", "156": "New Zealand", "157": "Nicaragua", "158": "Niger", "159": "Nigeria", "160": "Niue", "162": "Norway", "165": "Pakistan", "166": "Panama", "167": "Czechia", "168": "Papua New Guinea", "169": "Paraguay", "170": "Peru", "171": "Philippines", "173": "Poland", "174": "Portugal", "175": "Guinea-Bissau", "176": "Timor-Leste", "178": "Eritrea", "179": "Qatar", "180": "Palau", "181": "Zimbabwe", "183": "Romania", "184": "Rwanda", "185": "Russian Federation", "188": "Saint Kitts and Nevis", "189": "Saint Lucia", "191": "Saint Vincent and the Grenadines", "192": "San Marino", "193": "Sao Tome and Principe", "194": "Saudi Arabia", "195": "Senegal", "196": "Seychelles", "197": "Sierra Leone", "198": "Slovenia", "199": "Slovakia", "200": "Singapore", "201": "Somalia", "202": "South Africa", "203": "Spain", "207": "Suriname", "208": "Tajikistan", "209": "Eswatini", "210": "Sweden", "211": "Switzerland", "212": "Syrian Arab Republic", "213": "Turkmenistan", "215": "United Republic of Tanzania", "216": "Thailand", "217": "Togo", "218": "Tokelau (Associate Member)", "219": "Tonga", "220": "Trinidad and Tobago", "221": "Oman", "222": "Tunisia", "223": "Turkey", "225": "United Arab Emirates", "226": "Uganda", "227": "Tuvalu", "229": "United Kingdom", "230": "Ukraine", "231": "USA", "233": "Burkina Faso", "234": "Uruguay", "235": "Uzbekistan", "236": "Venezuela (Bolivarian Republic of)", "237": "Viet Nam", "238": "Ethiopia", "244": "Samoa", "249": "Yemen", "250": "Democratic Republic of the Congo", "251": "Zambia", "255": "Belgium", "256": "Luxembourg", "272": "Serbia", "273": "Montenegro", "276": "Sudan", "277": "South Sudan" };

function Legend(props) {
  return function () {
    var _elem = document.createElement("ul");

    _elem.setAttribute("class", "year-selector");

    _elem.appendChild(document.createTextNode("\n      "));

    var _expr = props.options.map(function (option, index) {
      return function () {
        var _elem2 = document.createElement("li");

        var _elem3 = document.createElement("span");

        _elem3.setAttribute("class", "icon c" + (index + 1));

        _elem2.appendChild(_elem3);

        var _expr2 = FAO_TO_ISO2[option],
            _res2 = _expr2 instanceof Node || _expr2 instanceof Array ? _expr2 : document.createTextNode(_expr2);

        if (_res2 instanceof Array) {
          for (var _i3 = 0; _i3 < _res2.length; _i3 += 1) {
            _elem2.appendChild(_res2[_i3] instanceof Node || _res2[_i3] instanceof Array ? _res2[_i3] : document.createTextNode(_res2[_i3]));
          }
        } else _elem2.appendChild(_res2);

        return _elem2;
      }();
    }),
        _res = _expr instanceof Node || _expr instanceof Array ? _expr : document.createTextNode(_expr);

    if (_res instanceof Array) {
      for (var _i4 = 0; _i4 < _res.length; _i4 += 1) {
        _elem.appendChild(_res[_i4] instanceof Node || _res[_i4] instanceof Array ? _res[_i4] : document.createTextNode(_res[_i4]));
      }
    } else _elem.appendChild(_res);

    _elem.appendChild(document.createTextNode("\n    "));

    return _elem;
  }();
}
"use strict";

var margin = { top: 20, right: 60, bottom: 30, left: 30 },
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseDate = d3.timeParse('%Y');

var formatSi = d3.format(".3s");

var formatNumber = d3.format("c"),
    formatBillion = function formatBillion(x) {
  return formatNumber(x / 1e6);
};

var x = d3.scaleTime().range([0, width]);

var y = d3.scaleLinear().range([height, 0]);

var keys;
var colors = ['#6E4C56', '#A85360', '#CE5967', '#F65E6E', '#F87E8B', '#FA9EA8', '#FBBFC5', '#FDDFE2', '#DBE0E5'];
var color = function color(d) {
  var index = keys.findIndex(function (k) {
    return k === d;
  });
  return colors[index] || '#DBE0E5';
};

var xAxis = d3.axisBottom().scale(x);

var yAxis = d3.axisLeft().scale(y).tickFormat(formatBillion);

var area = d3.area().x(function (d) {
  return x(d.data.year);
}).y0(function (d) {
  return y(d[0]);
}).y1(function (d) {
  return y(d[1]);
});

var stack = d3.stack();
var legend = document.getElementById("legend");

var svg = d3.select('.graph-container').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function render(commodity) {
  d3.csv('data/' + commodity + '.csv', function (error, data) {
    keys = data.columns.filter(function (key) {
      return key !== 'year';
    });
    data.forEach(function (d) {
      d.year = parseDate(d.year);
    });

    var maxDateVal = d3.max(data, function (d) {
      var vals = d3.keys(d).map(function (key) {
        return key !== 'year' ? d[key] : 0;
      });
      return d3.sum(vals);
    });

    // Set domains for axes
    x.domain(d3.extent(data, function (d) {
      return d.year;
    }));
    y.domain([0, maxDateVal]);

    stack.keys(keys);

    stack.order(d3.stackOrderNone);
    stack.offset(d3.stackOffsetNone);

    var path = svg.selectAll('.path').data(stack(data)).enter().append('g').attr('class', function (d) {
      return 'path ' + d.key;
    }).attr('fill-opacity', 1);

    path.append('path').attr('class', 'area').attr('d', area).style('fill', function (d) {
      return color(d.key);
    });

    svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);

    svg.append('g').attr('class', 'y axis').call(yAxis);

    svg.append("g").attr("class", "grid").call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

    legend.innerHTML = '';
    legend.appendChild(Legend({ options: keys }));
  });
};

var currentValue = 'soy';
render(currentValue);

function changeValue() {
  currentValue = document.getElementById("commodity").value;
  svg.selectAll('*').remove();
  render(currentValue);
}
