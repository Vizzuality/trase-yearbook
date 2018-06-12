const width = 500,
    height = 500,
    maxRadius = Math.min(width, height) / 2;

// const color = d3.scaleOrdinal(d3.schemeCategory20);
const color = d3.scaleLinear()
    // .domain([1000, 5000, 10000, 20000, 40000, 80000, 160000])
    .domain([0, 0.0005, 0.001, 0.005, 0.01])
    .range(['#60B81F', '#9FD579', '#FFF0C2', '#FA9EA8','#F65E6E'])
    .clamp(true);

var svg = d3.select("svg"),
    diameter = width,
    g = svg.append("g").attr("transform", "translate(2,2)"),
    format = d3.format(",d"),
    format2 = d3.format(".4f");

var pack = d3.pack()
    .size([diameter, diameter]);

const textFits = d => {
    const CHAR_SPACE = 8;
    const r = d.r;
    const perimeter = r * 2;
    return d.data.name.length * CHAR_SPACE < perimeter;
};

d3.json("5e_data.json", function (error, root) {
    if (error) throw error;

    root = d3.hierarchy(root)
        .sum(function (d) { return d.sum_soy_vol; })
        .sort(function (a, b) { return b.value - a.value; });

    var node = g.selectAll(".node")
        .data(pack(root).descendants())
        .enter().append("g")
        .attr("class", function (d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function (d) {
            return d.data.name + "\nSoy traded: " + format(d.value) +
                "t \nDeforestation risk: " + format(d.data.dfrs_risk) +
                "ha \nDeforestation risk per ton: " + format2(d.data.dfrs_risk_per_ton) + "ha";
        });

    node.append("circle")
        .attr("r", function (d) { return d.r; })
        .style('fill', d => color(d.data.dfrs_risk_per_ton));

    node.filter(function (d) { return !d.children; }).append("text")
        .attr("dy", "0.3em")
        .attr('display', d => textFits(d) ? null : 'none')
        .style('fill', '#34444C')
        .style('opacity', .8)
        .text(function (d) { return d.data.name });

});