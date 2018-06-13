const width = 500,
    height = 500,
    maxRadius = Math.min(width, height) / 2;

// const color = d3.scaleOrdinal(d3.schemeCategory20);
const color = d3.scaleLinear()
    // .domain([1000, 5000, 10000, 20000, 40000, 80000, 160000])
    .domain([0, 0.0005, 0.001, 0.005, 0.01])
    .range(['#60B81F', '#9FD579', '#FFF0C2', '#FA9EA8', '#F65E6E'])
    .clamp(true);

var svg = d3.select('svg'),
    diameter = width - 10,
    g = svg.append('g').attr('transform', 'translate(2,2)'),
    format = d3.format(',d'),
    format2 = d3.format('.4f');

var pack = d3.pack()
    .size([diameter, diameter]);

const textFits = d => {
    const CHAR_SPACE = 8;
    const r = d.r;
    const perimeter = r * 2 + 10;
    return d.data.name.length * CHAR_SPACE < perimeter;
};

var currentValue = 'sum_soy_vol';
var packRoot;
var node;

d3.json('5e_data.json', function (error, root) {
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

    // node.append('title')
    //     .text(function (d) {
    //         return d.data.name + '\nSoy traded: ' + format(d.value) +
    //             't \nDeforestation risk: ' + format(d.data.dfrs_risk) +
    //             'ha \nDeforestation risk per ton: ' + format2(d.data.dfrs_risk_per_ton) + 'ha';
    //     });

    node.append('circle')
        .attr('r', function (d) { return d.r; })
        .style('fill', d => color(d.data.dfrs_risk_per_ton));

    node.filter(function (d) { return !d.children; }).append('text')
        .attr('display', d => textFits(d) ? null : 'none')
        .style('fill', '#34444C')
        .style('opacity', .8)
        .text(function (d) { return d.data.name });

});

function showTooltip(d) {
    document.querySelector('.tooltip').style.opacity = 1;
    document.querySelector('.tooltip .name').innerHTML = d.data.name;
    document.querySelector('.tooltip .content .value').innerHTML = 
        currentValue === 'dfrs_risk_per_ton' ? format2(d.value) : format(d.value);
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

function changeValue(newValue) {

    currentValue = newValue;

    if (currentValue === 'sum_soy_vol') {
        document.querySelector('.title').innerHTML = 'Volume of soy traded per company';
        document.querySelector('.tooltip .content .unit').innerHTML = 't';
    } else if (currentValue === 'dfrs_risk') {
        document.querySelector('.title').innerHTML = 'Total deforestation risk per company';
        document.querySelector('.tooltip .content .unit').innerHTML = 'ha';
    } else if (currentValue === 'dfrs_risk_per_ton') {
        document.querySelector('.title').innerHTML = 'Relative deforestation risk per company';
        document.querySelector('.tooltip .content .unit').innerHTML = 'ha/t';
    }

    // update value 
    packRoot
        .sum(function (d) { return d[newValue]; })
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
        .attr('display', d => textFits(d) ? null : 'none');

    // resize circles
    node.selectAll('circle')
        .transition()
        .duration(1500)
        .attr('r', function (d) { return d.r; })
}