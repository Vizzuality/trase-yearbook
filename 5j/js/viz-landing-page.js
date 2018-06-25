//// DEFINITIONS

const DEFAULT_SELECTION = ["CARGILL"];
const DEFAULT_COLORS = [
  d3.scaleLinear().range(["#ede2b6","#EDCE4A"]),
  d3.scaleLinear().range(["#aabfdd","#719DE0"]),
  d3.scaleLinear().range(["#d7a6d8","#D66ED9"]),
];

const DEFAULT_RADIUS_RANGE = [0, 40];
const DEFAULT_TRANSITION_DURATION = 3000;
const SWITCH_YEARS_ANIMATED = 4000;


//////////////
const MAP_SVG_SIZE = [300,300]
const projection = d3.geoProjection((x, y) => [x, Math.log(Math.tan(Math.PI / 4 + y / 2))])
  .scale(380)
  .center([0, -30])

const renderMap = (selector, geojson) => {
  d3.select(selector).select(".viz").selectAll("*").remove();
  const svg = d3.select(selector).select(".viz").append("svg")
    .attr("viewBox", "0 0 " + MAP_SVG_SIZE.join(" "))
    .attr("preserveAspectRatio","xMidYMin meet");

  const g = svg.append("g").attr("class","map-group").attr("transform","translate(20,0)");
  svg.append("g")
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

const updateMap = (selector, data, year) => {
  
  const circleG = d3.select(selector).select(".map-circle-group");
  const t = d3.transition().duration(DEFAULT_TRANSITION_DURATION);

  const filtered_data = Object.keys(data)
    .filter(loc => data[loc].data[year] && data[loc].p)
    .map(loc => {
      return {
        radius: data[loc].data[year].radius,
        proj: projection(data[loc].p.map(c => c/1000.0)),
        loc
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

  circles.enter()
    .append('circle')
    .attr("class","municipalities-bubble")
    .attr("cx", d => d.proj[0])
    .attr("cy", d => d.proj[1])
    .attr("r", 0)
    .transition(t)
    .attr("r",d => d.radius)
}

////////////////////////////////////
////////////////////////////////////
//////////MAPS VIZ//////////////////
////////////////////////////////////
////////////////////////////////////

function MapsViz(amount, map_render, geo_data, aux_data, default_source, year_range, default_selection, colors) {
  this.amount = amount;
  this.map_render = map_render;
  this.geo_data = geo_data;
  this.aux_data = aux_data;
  this.data_source = default_source;
  this.year_range = year_range;
  this.map_prefix = "#viz-lp-";
  this.selector_prefix = "#select-";
  this.current_selection = year_range[0];
  this.current_companies_selection = default_selection;
  this.colors = colors;
  this.selector_data = {};
  this.maps_data = [];
  this.aux_chart_selector = false;
  this.updateMapData();

  if (SWITCH_YEARS_ANIMATED) {
    setInterval(() => {
      if (!document.hidden) {
        this.current_selection = (this.current_selection == this.year_range[1] ? this.year_range[0] : this.current_selection + 1);
        this.updateSelection();
      }
    }, SWITCH_YEARS_ANIMATED);
  }
}

MapsViz.prototype.init = function() {
  for (let i = 1; i <= this.amount; ++i) 
    renderMap(`${this.map_prefix}map${i}`, this.map_render);
  this.updateMaps();
}

MapsViz.prototype.updateSelection = function () {
  this.updateMapData();
  this.updateMaps();
}

MapsViz.prototype.updateMapData = function () {
  this.maps_data = this.current_companies_selection.map(company => {
    return this.geo_data[company];
  });
}

MapsViz.prototype.updateMaps = function () {
  for (let i = 1; i <= this.amount; ++i) 
    updateMap(`${this.map_prefix}map${i}`, this.maps_data[i-1], this.current_selection, this.colors[i-1], this.data_source, "bubble");
}

/////////////////////////////////////////
/////////////////////////////////////////
////////////////HELPERS//////////////////
/////////////////////////////////////////
/////////////////////////////////////////

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

function preprocessMapJsonData(data) {
  const year_range = [2006,2016];
  const max_risk_absolute = 7400;
  const max_soy_volume = 2251818;

  const radiusScale = d3.scaleSqrt()
    .domain([0, max_soy_volume])
    .range(DEFAULT_RADIUS_RANGE);

  Object.keys(data).forEach(company => {
    Object.keys(data[company]).forEach(location => {
      Object.keys(data[company][location].data).forEach(year => {
        data[company][location].data[year].v = data[company][location].data[year].v / 100.0;
        data[company][location].data[year].ra = data[company][location].data[year].ra ? data[company][location].data[year].ra / 100.0 : false;
        data[company][location].data[year].radius = radiusScale(data[company][location].data[year].v)
      });
    });
  });

  return {
    data,
    volume_range: [0, max_soy_volume],
    absolute_risk_range: [0, max_risk_absolute],
    year_range
  }
}

(function () {
  Promise.all([
    d3.json("br-states.json"), 
    d3.json("landing_page_data_ints.json")
  ]).then(([border_topology, data_map]) => {
    const border = toGeoJson(border_topology, "estados");
    const { data } = preprocessMapJsonData(data_map);
    const viz = new MapsViz(1, border, data, [], "absolute", [2006,2016], DEFAULT_SELECTION, DEFAULT_COLORS);
    viz.init();
  });
})();