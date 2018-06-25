var margin = { top: 20, right: 60, bottom: 30, left: 30 },
  width = 500 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var parseDate = d3.timeParse('%Y');

var formatSi = d3.format(".3s");

var formatNumber = d3.format("c"),
  formatBillion = function (x) { return formatNumber(x / 1e6); };

var x = d3.scaleTime()
  .range([0, width]);

var y = d3.scaleLinear()
  .range([height, 0]);

var colors = {
  "21": '#FDDFE2',
  "231": '#FBBFC5',
  "9": '#FA9EA8',
  "169":  '#F87E8B',
  "234": '#F65E6E',
  "100": '#CE5967',
  "33": '#A85360',
  "19": '#6E4C56',
  "others": '#48464F'
};
var color = function(d) {
  return colors[d] || '#000'
}

var xAxis = d3.axisBottom()
  .scale(x);

var yAxis = d3.axisLeft()
  .scale(y)
  .tickFormat(formatBillion);

var area = d3.area()
  .x(function (d) {
    return x(d.data.year);
  })
  .y0(function (d) { return y(d[0]); })
  .y1(function (d) { return y(d[1]); });

var stack = d3.stack()

var svg = d3.select('.graph-container').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

(function render() {
  d3.csv('data.csv', function (error, data) {
    // color.domain(d3.keys(data[0]).filter(function (key) { return key !== 'year'; }));
    var keys = data.columns.filter(function (key) { return key !== 'year'; })
    data.forEach(function (d) {
      d.year = parseDate(d.year);
    });

    var maxDateVal = d3.max(data, function (d) {
      var vals = d3.keys(d).map(function (key) { return key !== 'year' ? d[key] : 0 });
      return d3.sum(vals);
    });

    function make_y_gridlines() {
      return d3.axisLeft(y)
    }


    // Set domains for axes
    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain([0, maxDateVal])

    stack.keys(keys);

    stack.order(d3.stackOrderNone);
    stack.offset(d3.stackOffsetNone);

    console.log(stack(data));

    var path = svg.selectAll('.path')
      .data(stack(data))
      .enter().append('g')
      .attr('class', function (d) { return 'path ' + d.key; })
      .attr('fill-opacity', 1);

    path.append('path')
      .attr('class', 'area')
      .attr('d', area)
      .style('fill', function (d) { return color(d.key); });

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )
  });
})();
