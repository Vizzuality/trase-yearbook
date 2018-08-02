//// DEFINITIONS

const DEFAULT_SELECTION = ["BUNGE"];
// const defaultColors = [d3.interpolateBuPu,d3.interpolateRdPu,d3.interpolateYlOrBr];
const DEFAULT_COLORS = [
  d3.scaleLinear().range(["#ede2b6","#EDCE4A"]),
  d3.scaleLinear().range(["#aabfdd","#719DE0"]),
  d3.scaleLinear().range(["#d7a6d8","#D66ED9"]),
];

const DEFAULT_NA_COLOR = "#ECECEC";
const DEFAULT_BAR_COLOR = "#47464D";
const DEFAULT_RADIUS_RANGE = [1, 35];
const DEFAULT_TRANSITION_DURATION = 1000;
const SWITCH_YEARS_ANIMATED = 3000;
const ANIMATION_STARTUP_DELAY = 2000;
const AUX_CHART_RISK = "absolute" // "relative" OR "absolute"
const MAP_RISK = "absolute"

const DEFAULT_LINEAR_COLOR_SCALE = ["#F8E0E2","#F2C1C6","#EDA2A9","#E9858D","#E56871","#C16069","#9D5861","#684D55","#47464D"];
// const DEFAULT_DIVERGENT_COLOR_SCALE = ["#3C4E47","#5C873E","#76B53F","#AAD383","#FDF0C7","#EDA2A9","#E56871","#9D5861","#47464E"];
const DEFAULT_DIVERGENT_COLOR_SCALE = ["#5C873E","#76B53F","#AAD383","#FDF0C7","#EDA2A9","#E56871","#9D5861"];
const DEFAULT_COLOR_SCALE = DEFAULT_LINEAR_COLOR_SCALE;

//////////////
const MAP_SVG_SIZE = [300,300]
const projection = d3.geoProjection((x, y) => [x, Math.log(Math.tan(Math.PI / 4 + y / 2))])
  .scale(380)
  .center([0, -30])

const renderMapLegend = (selector, legend1, legend2) => {
  const svg = d3.select(selector).select(".viz").select("svg");
  svg.select(".legend").remove();
  svg.select(".legend-2").remove();
  const g = svg.append("g").attr("class","legend").attr("transform",`translate(0,${MAP_SVG_SIZE[1] - 20})`);
  const g2 = svg.append("g").attr("class","legend-2").attr("transform",`translate(${MAP_SVG_SIZE[0] - 60},${MAP_SVG_SIZE[1] - 20})`);
  const margin = { top: 20 };

  const radiusScale = d3.scaleLinear()
    .domain(legend1.range)
    .range(DEFAULT_RADIUS_RANGE);
  const ticks = 4;
  const MAX_RADIUS = DEFAULT_RADIUS_RANGE[1];
  const range_diff = legend1.range[1] - legend1.range[0];
  const data = [...[...Array(ticks - 1).keys()].map(i => ((i * 1.0 / ticks) * range_diff) + legend1.range[0]), legend1.range[1]]
    .reverse()
    .map(d => {
      return {
        value: d,
        radius: radiusScale(d)
      }
    });

  g.append("text")
    .attr("class", "legend-title")
    .attr("x", 45)
    .attr("y", - 2*MAX_RADIUS)
    .style("text-anchor", "middle")
    .text(legend1.title);

  const volume_legend = g.selectAll('legend-item')
    .data(data)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform",`translate(0, ${-margin.top})`);

  volume_legend
    .append("circle")
    .attr("cx",MAX_RADIUS + 2)
    .attr("cy",d => MAX_RADIUS - d.radius)
    .attr("r",d => d.radius)
  volume_legend
    .append("line")
    .attr("x1",MAX_RADIUS + 2)
    .attr("x2",MAX_RADIUS + 2 + MAX_RADIUS + 5)
    .attr("y1",d => MAX_RADIUS - d.radius - d.radius)
    .attr("y2",d => MAX_RADIUS - d.radius - d.radius)
  volume_legend
    .append("text")
    .attr("x",MAX_RADIUS + 2 + MAX_RADIUS + 7)
    .attr("y",d => MAX_RADIUS - d.radius - d.radius)
    .attr("dy", 2)
    .text(d => d.value < 1 ? "0.1K" : d.value < 1000000 ? (d.value/1000).toFixed(0) + "K" : (d.value/1000000).toFixed(0) + "M")

    ////////////////////////////////
    ///////////LEGEND 2/////////////
    ////////////////////////////////

  const defs = svg.append("defs");
  const linearGradient = defs.append("linearGradient")
    .attr("id", "legend-risk-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

  ;
  linearGradient.selectAll("stop")
    .data(DEFAULT_COLOR_SCALE.reverse()
      .map((color, i) => {
        return {
          color,
          offset: ((i / (DEFAULT_COLOR_SCALE.length-1)) * 100).toFixed(1) + "%"
        }
      })
    )
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });
  const scaleRiskPos = d3.scaleLinear().domain(legend2.range).range([0, MAX_RADIUS * 2 - 5]);
  const scaleWidth = 6;
  const scaleMarginLeft = -6;
  g2.append("text")
    .attr("class", "legend-title")
    .attr("x", 10)
    .attr("y", - scaleRiskPos(legend2.range[1]) - 10)
    .style("text-anchor", "middle")
    .text(legend2.title);
  g2.append("rect")
    .attr("x", scaleMarginLeft)
    .attr("y", -scaleRiskPos(legend2.range[1]))
    .attr("width",scaleWidth)
    .attr("height",scaleRiskPos(legend2.range[1]))
    .style("fill", "url(#legend-risk-gradient)");
  const labels = [0, 0.5, 1.0].map(d => d * (legend2.range[1] - legend2.range[0]) + legend2.range[0]);

  g2.selectAll(".labels")
    .data(labels)
    .enter()
    .append("text")
    .attr("x", scaleMarginLeft + scaleWidth + 1)
    .attr("y",d => -scaleRiskPos(d))
    .attr("dy", 1.5)
    .text(d => "-" + d.toFixed(d > 99 ? 0 : 2) + " " + legend2.unit);

}
const renderMap = (selector, geojson) => {
  d3.select(selector).select(".viz").selectAll("*").remove();
  const svg = d3.select(selector).select(".viz").append("svg")
    .attr("viewBox", "0 0 " + MAP_SVG_SIZE.join(" "))
    .attr("preserveAspectRatio","xMidYMin meet");

  const g = svg.append("g").attr("class","map-group").attr("transform","translate(20,0)");

  const circleG = svg.append("g")
    .attr("class","map-circle-group")
    .attr("transform","translate(20,0)")

  const geoGenerator = d3.geoPath()
    .projection(projection);

  g.selectAll('path')
    .data(geojson.features)
    .enter()
    .append('path')
    .attr("class","municipalities")
    .attr('d', geoGenerator);
}

const updateMap = (selector, data, geojson, year, color, source) => {
  const g = d3.select(selector).select(".map-group");
  const circleG = d3.select(selector).select(".map-circle-group");
  const t = d3.transition().duration(DEFAULT_TRANSITION_DURATION);

  const filtered_data = Object.keys(data)
    .filter(loc => data[loc].data[year] && data[loc].p)
    .map(loc => {
      return {
        color: data[loc].data[year].color[source],
        radius: data[loc].data[year].radius,
        pos: data[loc].p,
        proj: projection(data[loc].p.map(d => d/1000.0)),
        loc: loc
      }
    });

  const circles = circleG.selectAll('.municipalities-bubble').data(filtered_data, f => f.loc);
  circles.exit()
    .transition(t)
    .attr("r", 0)
    .remove();

  circles
    .transition(t)
    .attr("r",d => d.radius)
    .style("fill", d => d.color)

  circles.enter()
    .append('circle')
    .attr("class","municipalities-bubble")
    .attr("data-first-render", year)
    .attr("data-pos", d => d.pos.join(","))
    .attr("data-loc", d => d.loc)
    .attr("cx", d => d.proj[0])
    .attr("cy", d => d.proj[1])
    .attr("r", 0)
    .style("fill", d => d.color)
    .transition(t)
    .attr("r",d => d.radius)

}

function Selector(element, select_range, default_value, source, legend, onChange) {
  this.element = element;
  this.source = source;
  this.select_range = select_range;
  this.current_value = default_value;
  this.onChange = onChange;
  this.width = 600;
  this.height = 120;
  this.legend = legend;
  this.margin = { top: 15, right: 40, bottom: 50, left: 10 };
  this.domain = [...Array(select_range[1] - select_range[0] + 1).keys()].map(i => i + select_range[0]);
  this.scaleX = d3.scaleBand()
    .domain(this.domain)
    .rangeRound([0, this.width - this.margin.left - this.margin.right])
    .paddingInner(0.1);
  this.init();
  this.animation_running = false;

  if (SWITCH_YEARS_ANIMATED) {
    this.animation_running = true;
    setTimeout(() => {
      setInterval(() => {
        if (!document.hidden && this.animation_running)
          this.selectValue(this.current_value == this.select_range[1] ? this.select_range[0] : this.current_value + 1)
      }, SWITCH_YEARS_ANIMATED);
    }, ANIMATION_STARTUP_DELAY);
  }
}

Selector.prototype.init = function() {
  const { element, width, height, margin, domain, current_value, scaleX, onChange } = this;
  const _ = this;
  const chart_height = height - margin.top - margin.bottom;
  d3.select(element).selectAll("*").remove();

  const svg = d3.select(element).append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio","xMidYMin meet");

  this.bg = svg.append("g")
    .attr("class", "selector_bg")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


  const line = g.append("line")
    .attr("class","selector-axis")
    .attr("x1", scaleX.bandwidth() / 2)
    .attr("y1", height - margin.bottom)
    .attr("x2", width - margin.left - margin.right - (scaleX.bandwidth() / 2))
    .attr("y2", height - margin.bottom);

  const selectorItem = g.selectAll('year-selector')
    .data(domain, d => d)
    .enter()
    .append("g")
    .attr("class", d => d == current_value ? "year-selector selected" : "year-selector")
    .attr("transform", d => `translate(${scaleX(d)},0)`);

  selectorItem
    .append("circle")
    .attr("class", "year-selector-border")
    .attr("cx", scaleX.bandwidth() / 2)
    .attr("cy", height - margin.bottom)
    .attr("r", "8");

  selectorItem
    .append("circle")
    .attr("class", "year-selector-circle")
    .attr("cx", scaleX.bandwidth() / 2)
    .attr("cy", height - margin.bottom)
    .attr("r", "3");

  selectorItem
    .append("text")
    .attr("class", "year-selector-text")
    .attr("dx", scaleX.bandwidth() / 2)
    .attr("dy", height - margin.bottom + 30)
    .text(d => d);

  selectorItem
    .append("rect")
    .attr("class", "year-selector-pointer-area")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", scaleX.bandwidth())
    .attr("height", height - margin.top)
    .style("fill", "transparent")
    .on("click", function(d) {
      _.animation_running = false;
      _.selectValue(d);
    });

  this.svg = svg;
  this.g = g;
  this.selectorItem = selectorItem;
}

Selector.prototype.setSource = function (source) {
  const { svg, legend } = this;
  this.source = source;
  svg.select(".aux-chart-title").text(legend[source].title);
}

Selector.prototype.initChart = function (data, keys, colors) {
  const { svg, width, height, margin, g, bg, legend, source } = this;
  this.colors = colors;
  const chart_height = height - margin.top - margin.bottom;

  svg.append("text")
    .attr("class", "aux-chart-title")
    .attr("x", width/2)
    .attr("y", 12)
    .style("text-anchor", "middle")
    .text(legend[source].title)

  const rect = bg.append("rect")
    .attr("class", "selector-chart-bg")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width - margin.left - margin.right)
    .attr("height", chart_height);

  this.scaleY = d3.scaleLinear()
    .rangeRound([chart_height, 0])
    .domain([0, legend[source].range[1]]).nice();

  this.Yaxis = (g, obj) => {
    g.call(d3.axisRight(obj.scaleY).ticks(4).tickSize(obj.width - obj.margin.left - obj.margin.right));
    g.select(".domain").remove();
    g.selectAll(".tick line").attr("stroke", "#c3c6ca").attr("stroke-dasharray", "2,2");
    g.selectAll(".tick text").attr("fill", "#c3c6ca");
  }
  bg.append("g")
    .attr("class", "selector-chart-axis")
    .call(g => this.Yaxis(g, this));

  this.updateChart(data, keys);
}

Selector.prototype.updateChart = function (data, keys) {
  const { Yaxis, bg, g, selectorItem, scaleX, height, margin, colors, source } = this;
  const chart_height = height - margin.top - margin.bottom;

  this.scaleY = d3.scaleLinear()
    .rangeRound([chart_height, 0])
    .domain([0, d3.max(keys, (company,i) => d3.max(Object.keys(data[i]), year => +data[i][year][source]))]).nice();

  const scaleY = this.scaleY;

  bg.select(".selector-chart-axis").transition().duration(300).call(g => this.Yaxis(g, this));

  const x1 = d3.scaleBand()
    .domain(keys.map((d,i) => i))
    .rangeRound([0, scaleX.bandwidth()])
    .padding(0.05);

  selectorItem.selectAll(".bar").remove();

  selectorItem.selectAll(".bar")
    .data(year => keys.map((company, i) => {
      return {
        year: year,
        key: i,
        value: data[i][year] ? data[i][year][source] : false,
        // color: data[i][year] ? data[i][year][AUX_CHART_RISK + "_color"] : "white"
      };
    })).enter().append("rect")
    .attr("class", (d, i) => `bar`)
    .attr("fill", DEFAULT_BAR_COLOR)
    .attr("x", d => x1(d.key))
    .attr("y", scaleY(0))
    .attr("width", x1.bandwidth())
    .attr("height", 0)
    .transition()
    .duration(DEFAULT_TRANSITION_DURATION)
    .attr("y", d => scaleY(d.value ? d.value : 0.00))
    .attr("height", d => chart_height - scaleY(d.value ? d.value : 0.00));
}

Selector.prototype.selectValue = function (value) {
  const { height, margin, scaleY, animation_running, onChange } = this;
  const chart_height = height - margin.top - margin.bottom;
  this.current_value = value;
  d3.selectAll(".year-selector").classed("selected", false);
  d3.selectAll(".year-selector").filter(d => d == value).classed("selected", true);
  d3.selectAll(".year-selector")
    .selectAll(".bar")
      .transition()
      .attr("y", d => d.year == value || !animation_running  ? scaleY(d.value ? d.value : 0.00) : chart_height)
      .attr("height", d => d.year == value || !animation_running  ? chart_height - scaleY(d.value ? d.value : 0.00) : 0);
  onChange(value);
}
////////////////////////////////////
////////////////////////////////////
//////////MAPS VIZ//////////////////
////////////////////////////////////
////////////////////////////////////

function MapsViz(amount, map_render, geo_data, aux_data, default_source, year_range, default_selection, colors) {
  this.amount = amount;
  this.geo_data = geo_data;
  this.map_render = map_render;
  this.aux_data = aux_data;
  this.data_source = default_source;
  this.year_range = year_range;
  this.map_prefix = "#viz-5d-";
  this.selector_prefix = "#select-";
  this.current_selection = year_range[0];
  this.current_companies_selection = default_selection;
  this.colors = colors;
  this.selector_data = {};
  this.maps_data = [];
  this.aux_chart_selector = false;
  this.updateMapData();
}

MapsViz.prototype.init = function() {
  for (let i = 1; i <= this.amount; ++i)
    renderMap(`${this.map_prefix}map${i}`, this.map_render);
  this.updateMaps();
}

MapsViz.prototype.enableLegend = function (left_range, right_range) {
  if (left_range) this.left_legend_range = left_range;
  if (right_range) this.right_legend_range = right_range;
  for (let i = 1; i <= this.amount; ++i)
    renderMapLegend(`${this.map_prefix}map${i}`, this.left_legend_range, this.right_legend_range[this.data_source]);
}

MapsViz.prototype.updateSelection = function () {
  const new_selection = [];
  for (let i = 1; i <= this.amount; ++i)
    new_selection.push(d3.select(`${this.selector_prefix}map${i}`).node().value);
  this.current_companies_selection = new_selection;
  this.updateMapData();
  this.updateAuxData();
  this.updateMaps();
  this.updateAuxChart();
}

MapsViz.prototype.updateMapData = function () {
  this.maps_data = this.current_companies_selection.map(company => {
    return this.geo_data[company];
  });
}

MapsViz.prototype.updateAuxData = function () {
  this.selector_data = this.current_companies_selection.map(company => {
    return this.aux_data[company];
  });
}

MapsViz.prototype.updateMaps = function () {
  for (let i = 1; i <= this.amount; ++i)
    updateMap(`${this.map_prefix}map${i}`, this.maps_data[i-1], this.map, this.current_selection, this.colors[i-1], this.data_source, "bubble");
}

MapsViz.prototype.enableAuxDataChartSelector = function (selector, ranges) {
  this.aux_chart_selector = selector;
  this.updateAuxData();
  this.aux_chart_selector = new Selector(selector, this.year_range, this.year_range[0], this.data_source, ranges, val => {
    this.current_selection = val;
    this.updateMaps();
  });
  this.aux_chart_selector.initChart(this.selector_data, this.current_companies_selection, this.colors.map(c => c(0.6)));
}

MapsViz.prototype.updateAuxChart = function() {
  if (this.aux_chart_selector) {
    this.aux_chart_selector.setSource(this.data_source);
    this.aux_chart_selector.updateChart(this.selector_data,this.current_companies_selection);
  };
}

MapsViz.prototype.setDataSource = function (new_source) {
  this.data_source = new_source;
}

/////////////////////////////////////////
/////////////////////////////////////////
////////////////HELPERS//////////////////
/////////////////////////////////////////
/////////////////////////////////////////

function startToggle(viz) {
  d3.select("#toggle_risk")
    .on("click", d => {
      viz.setDataSource(d3.select("#toggle_risk").node().checked ? "relative" : "absolute");
      viz.updateSelection();
      viz.enableLegend();
    });
}

function fillSelectBoxes(companies_list, selects, default_values, viz) {
  selects.forEach((select, i) => {
    d3.select(select)
      .on("change", d => {
        viz.updateSelection();
      })
      .selectAll("option")
      .data(companies_list)
      .enter()
      .append("option")
      .property("selected", d => default_values[i] == d)
      .html(d => d);
  });
}


function toGeoJson(topology, objects_title) {
  const geojson = topojson.feature(topology, topology.objects[objects_title]);
  geojson.features.forEach((f, k) => {
    let coordinates = [];
    if (f.geometry.type == "MultiPolygon") {
      f.geometry.coordinates.forEach(polygon => {
        polygon[0].forEach(coord => {
          coordinates.push(coord);
        })
      });
    } else if (f.geometry.type == "Polygon") {
      f.geometry.coordinates.forEach(polygon => {
        polygon.forEach(coord => {
          coordinates.push(coord);
        })
      });
    }
    const len = coordinates.length;
    const sum = coordinates.reduce((acc, item) => {
      return item.map((i,k) => i + acc[k]);
    }, [0,0]);
    const center = sum.map(i => i/len);
    geojson.features[k].properties.center = center;
  });
  return geojson;
}

function preprocessRiskData(data_risk_csv) {
  const relative_risk_range = d3.extent(data_risk_csv, d => +d.dfrs_risk_per_000ton);
  const risk_range = d3.extent(data_risk_csv, d => +d.dfrs_risk);

  const risk_diff = risk_range[1] - risk_range[0];
  const scaleSize = DEFAULT_DIVERGENT_COLOR_SCALE.length;
  const riskColor = d3.scaleLinear()
    .domain([...[...Array(scaleSize - 1).keys()].map(i => ((i * 1.0 / scaleSize) * risk_diff) + risk_range[0]), risk_range[1]])
    .range(DEFAULT_DIVERGENT_COLOR_SCALE);

  const data_risk = data_risk_csv.reduce((acc, item) => {
    if(!acc[item.EXPORTER]) {
      acc[item.EXPORTER] = {};
    }
    acc[item.EXPORTER][item.YEAR] = {
      relative: +item.dfrs_risk_per_000ton,
      absolute: +item.dfrs_risk,
      absolute_color: riskColor(+item.dfrs_risk)
    };
    return acc;
  }, {});

  return {
    data: data_risk,
    relative_range: relative_risk_range,
    absolute_range: risk_range
  };
}

function preprocessMapJsonData(data) {
  const year_range = [
    d3.min(Object.keys(data), company => {
      return d3.min(Object.keys(data[company]), location => {
        return d3.min(Object.keys(data[company][location].data), year => year);
      });
    }),
    d3.max(Object.keys(data), company => {
      return d3.max(Object.keys(data[company]), location => {
        return d3.max(Object.keys(data[company][location].data), year => year);
      });
    })
  ];
  const max_risk_absolute = d3.max(Object.keys(data), company => {
    return d3.max(Object.keys(data[company]), location => {
      return d3.max(Object.keys(data[company][location].data), year => {
        return data[company][location].data[year].ra / 100.0;
      });
    });
  });
  const max_risk_relative = d3.max(Object.keys(data), company => {
    return d3.max(Object.keys(data[company]), location => {
      return d3.max(Object.keys(data[company][location].data), year => {
        return data[company][location].data[year].rr / 10000.0;
      });
    });
  });

  const max_soy_volume = d3.max(Object.keys(data), company => {
    return d3.max(Object.keys(data[company]), location => {
      return d3.max(Object.keys(data[company][location].data), year => {
        return data[company][location].data[year].v / 100.0;
      });
    });
  });
  const radiusScale = d3.scaleLinear()
    .domain([0, max_soy_volume])
    .range(DEFAULT_RADIUS_RANGE);
  const scaleSize = DEFAULT_COLOR_SCALE.length;
  const AbsoluteRiskColor = d3.scaleLinear()
    .domain([...[...Array(scaleSize - 1).keys()].map(i => ((i * 1.0 / scaleSize) * max_risk_absolute)), max_risk_absolute])
    .range(DEFAULT_COLOR_SCALE);
    const RelativeRiskColor = d3.scaleLinear()
      .domain([...[...Array(scaleSize - 1).keys()].map(i => ((i * 1.0 / scaleSize) * max_risk_relative)), max_risk_relative])
      .range(DEFAULT_COLOR_SCALE);
  Object.keys(data).forEach(company => {
    Object.keys(data[company]).forEach(location => {
      Object.keys(data[company][location].data).forEach(year => {
        data[company][location].data[year].v = data[company][location].data[year].v / 100.0;
        data[company][location].data[year].ra = data[company][location].data[year].ra ? data[company][location].data[year].ra / 100.0 : false;
        data[company][location].data[year].rr = data[company][location].data[year].rr ? data[company][location].data[year].rr / 10000.0 : false;
        data[company][location].data[year].color = {};
        data[company][location].data[year].color.absolute = data[company][location].data[year].ra ? AbsoluteRiskColor(data[company][location].data[year].ra) : DEFAULT_NA_COLOR;
        data[company][location].data[year].color.relative = data[company][location].data[year].rr ? RelativeRiskColor(data[company][location].data[year].rr) : DEFAULT_NA_COLOR;
        data[company][location].data[year].radius = radiusScale(data[company][location].data[year].v)
      });
    });
  });

  return {
    data,
    volume_range: [0, max_soy_volume],
    absolute_risk_range: [0, max_risk_absolute],
    relative_risk_range: [0, max_risk_relative],
    year_range
  }
}

(function () {
  Promise.all([
    d3.json("br-states.json"),
    d3.json("risk_per_municipality.json"),
    d3.csv("risk_total.csv")
  ]).then(([border_topology, data_map, data_risk_csv]) => {
    const border = toGeoJson(border_topology, "estados");
    const { data: data_risk, range: risk_range, relative_range: risk_relative_range } = preprocessRiskData(data_risk_csv);
    const { data, year_range, volume_range, absolute_risk_range, relative_risk_range } = preprocessMapJsonData(data_map);
    const viz = new MapsViz(1, border, data, data_risk, "absolute", [2006,2016], DEFAULT_SELECTION, DEFAULT_COLORS);
    fillSelectBoxes(
      Object.keys(data_risk),
      ["#select-map1"],
      DEFAULT_SELECTION,
      viz
    );
    startToggle(viz);
    viz.init();
    viz.enableLegend(
      {title: 'SOJA NEGOCIADA (TON)', range: volume_range},
      {
        absolute: {title: 'RISCO DE DESMATAMENTO (HA)', range: absolute_risk_range, unit: "HA"},
        relative: {title: 'RISCO DE DESMATAMENTO (HA/KT)', range: relative_risk_range, unit: "HA/KT"}
      });
    viz.enableAuxDataChartSelector(".slider",
      {
        absolute: {title: 'RISCO ABSOLUTO DE DESMATAMENTO (HA)', range: absolute_risk_range, unit: "HA"},
        relative: {title: 'RISCO DE DESMATAMENTO RELATIVO (HA/KT)', range: relative_risk_range, unit: "HA/KT"}
      });
  });
})();
