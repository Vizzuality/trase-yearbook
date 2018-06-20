var width = 500;
var height = 500;
var maxRadius = Math.min(width, height) / 2;

var color = d3.scaleLinear()
  .domain([0, 100000, 1000000, 6000000, 11663558])
  .range(['#60B81F', '#9FD579', '#FFF0C2', '#FA9EA8', '#F65E6E'])
  .clamp(true);

var svg = d3.select('svg');
var diameter = width - 10;
var g = svg.append('g').attr('transform', 'translate(2,2)');
var format = d3.format(',d');

var pack = d3.pack()
  .size([diameter, diameter]);

var cropText = d => {
  var CHAR_SPACE = 6;
  var r = d.r;
  var perimeter = r * 2 + -15;
  var characters = Math.floor(perimeter / CHAR_SPACE);
  if (characters >= d.data.name.length) return d.data.name;
  else if (perimeter > 50) return d.data.name.substring(0, characters) + '…'
  else return '';
};

var currentValue = 2005;
var packRoot;
var node;

d3.json('data.json', function (error, root) {
  if (error) throw error;

  packRoot = d3.hierarchy(root)
    .sum(function (d) { return d[currentValue]; })
    .sort(function (a, b) { return b.value - a.value; });

  node = g.selectAll('.node')
    .data(pack(packRoot).descendants())
    .enter().append('g')
    .attr('class', function (d) { return d.children ? 'node' : 'leaf node'; })
    .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
    .on("click", function () {
      d3.select(this).classed("selected", !d3.select(this).classed("selected"));
    })
    .on('mouseover', d => {
      d3.event.stopPropagation();
      showTooltip(d);
    })
    .on('mouseout', d => {
      d3.event.stopPropagation();
      hideTooltip();
    });

  node.append('circle')
    .attr('r', function (d) { return d.r; })
    .style('fill', d => color(d.data[currentValue]));

  node.filter(function (d) { return !d.children; }).append('text')
    .style('fill', '#34444C')
    .style('opacity', .8)
    .text(d => cropText(d));

});

function showTooltip(d) {
  document.querySelector('.tooltip').style.opacity = 1;
  document.querySelector('.tooltip .name').innerHTML = d.data.name;
  document.querySelector('.tooltip .content .value').innerHTML = format(d.value);
}

function hideTooltip() {
  document.querySelector('.tooltip').style.opacity = 0;
}


document.addEventListener("mousemove", function (e) {
  var tooltip = document.querySelector('.tooltip');
  var offsetX = 0;
  var offsetY = 0;
  if (e.clientX + tooltip.offsetWidth > width) offsetX = -tooltip.offsetWidth;
  if (e.clientY + tooltip.offsetHeight > height) offsetY = -tooltip.offsetHeight;
  tooltip.style.left = Math.max(0, e.clientX + offsetX) + 'px';
  tooltip.style.top = e.clientY + offsetY + 'px';
});

function changeValue() {
  document.querySelector('.title').innerHTML = 'Companies that comprised more than 1% of trade in ' + currentValue;

  // update value
  packRoot
    .sum(function (d) { return d[currentValue]; })
    .sort(function (a, b) { return b.value - a.value; });

  // update Pack layout
  node.selectAll('g')
    .data(pack(packRoot).descendants());

  // relocate circles
  node.transition()
    .duration(1500)
    .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
    .select('text')
    .transition()
    .text(d => cropText(d));;

  // resize circles
  node.selectAll('circle')
    .transition()
    .duration(1500)
    .attr('r', function (d) { return d.r; })
    .style('fill', d => color(d.data[currentValue]));
}

var options = [ 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017 ];

window.dispatch = function (type, value, loop) {
  currentValue = parseInt(value, 10);
  if (!loop && interval) {
    clearInterval(interval);
  }
  renderSelector();
  changeValue();
};

var interval = setInterval(function () {
  var index = options.indexOf(currentValue);
  var option = options[index + 1] || options[0];
  dispatch('setActive', option, true);
}, 4000);

var selectorEl = document.getElementById('selector-container');
function renderSelector() {
  selectorEl.innerHTML = '';
  selectorEl.appendChild(YearSelector({
    options: options,
    title: "Resize by",
    active: currentValue
  }))
}
document.addEventListener("DOMContentLoaded", renderSelector);
