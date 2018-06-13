const width = 500,
    height = 500,
    maxRadius = Math.min(width, height) / 2;

const formatNumber = d3.format(',d');

const x = d3.scaleLinear()
    .range([0, 2 * Math.PI])
    .clamp(true);

const y = d3.scaleLinear()
    .range([25, maxRadius]);

// const color = d3.scaleOrdinal(d3.schemeCategory20);
const color = d3.scaleLinear()
    .domain([3000000,   5000000,    7500000,    10000000,   15000000,   20000000,   30000000,   70000000])
    .range(['#FDDFE2', '#FBBFC5',  '#FBAFB7',  '#FA9EA8',  '#F98E99',  '#F87E8B',  '#F76F7E',  '#F65E6E' ])
    .clamp(true);

const partition = d3.partition();

const arc = d3.arc()
    .startAngle(d => x(d.x0))
    .endAngle(d => x(d.x1))
    .innerRadius(d => Math.max(0, y(d.y0)))
    .outerRadius(d => Math.max(0, y(d.y1)));

const middleArcLine = d => {
    const halfPi = Math.PI / 2;
    const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
        angles.reverse();
    }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
};

const textFits = d => {
    const CHAR_SPACE = 8;

    const deltaAngle = x(d.x1) - x(d.x0);
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    const perimeter = r * deltaAngle + 100;

    return d.data.name.length * CHAR_SPACE < perimeter;
};

const svg = d3.select('body').append('svg')
    .attr('class', 'svg')
    .style('width', width)
    .style('height', height)
    .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
    .on('click', () => focusOn()); // Reset zoom on canvas click

d3.json('trade2.json', (error, root) => {
    if (error) throw error;

    root = d3.hierarchy(root)
        .sum(d => d.size)
        .sort(function(a, b) {
            if (a.data.name === 'OTHER') return true
            else if (b.data.name === 'OTHER') return false
            else return b.value - a.value;
        });

    const slice = svg.selectAll('g.slice')
        .data(partition(root).descendants().slice(1));
        
    slice.exit().remove();

    const newSlice = slice.enter()
        .append('g').attr('class', 'slice')
        .on('click', d => {
            d3.event.stopPropagation();
            focusOn(d);
        })
        .on('mouseover', d => {
            d3.event.stopPropagation();
            showTooltip(d);
        })
        .on('mouseout', d => {
            d3.event.stopPropagation();
            hideTooltip();
        });

    // newSlice.append('title')
    //     .text(d => d.data.name + '\n' + formatNumber(d.value));

    newSlice.append('path')
        .attr('class', 'main-arc')
        .style('fill', d => {
            if (d.data.name === 'OTHER') return d3.color('#ECECEC');
            else return color(d.value);
        })
        .attr('d', arc);

    newSlice.append('path')
        .attr('class', 'hidden-arc')
        .attr('id', (_, i) => `hiddenArc${i}`)
        .attr('d', middleArcLine);

    const text = newSlice.append('text')
        .attr('display', d => textFits(d) ? null : 'none')
        .style('fill', '#34444C')
        .style('opacity', .8)
        
    text.append('textPath')
        .attr('startOffset', '50%')
        .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
        .text(d => d.data.name);
});

function showTooltip(d) {
    document.querySelector('.tooltip').style.opacity = 1;
    document.querySelector('.tooltip .name').innerHTML = d.data.name;
    document.querySelector('.tooltip .content .value').innerHTML = formatNumber(d.value);
}

function hideTooltip() {
    document.querySelector('.tooltip').style.opacity = 0;
}

document.addEventListener("mousemove", function(e){
    var tooltip = document.querySelector('.tooltip');
    var offsetX = 0;
    var offsetY = 0;
    if(e.clientX + tooltip.offsetWidth > width) offsetX = -tooltip.offsetWidth;
    if(e.clientY + tooltip.offsetHeight > height) offsetY = -tooltip.offsetHeight;
    tooltip.style.left = e.clientX + offsetX + 'px';
    tooltip.style.top = e.clientY + offsetY + 'px';
});

function focusOn(d) {

    // Reset to top-level if no data point specified
    if (!d) {
        d3.select('svg').attr('class', '');
        d = {x0: 0, x1: 1, y0: 0, y1: 1}
    } else {
        d3.select('svg').attr('class', 'root')
    }

    const transition = svg.transition()
        .duration(750)
        .tween('scale', () => {
            const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                yd = d3.interpolate(y.domain(), [d.y0, 1]);
            return t => {
                x.domain(xd(t));
                y.domain(yd(t));
            };
        });

    transition.selectAll('path.main-arc')
        .attrTween('d', d => () => arc(d));

    transition.selectAll('path.hidden-arc')
        .attrTween('d', d => () => middleArcLine(d));

    transition.selectAll('text')
        .attrTween('display', d => () => textFits(d) ? null : 'none');

    moveStackToFront(d);

    //

    function moveStackToFront(elD) {
        svg.selectAll('.slice').filter(d => d === elD)
            .each(function (d) {
                this.parentNode.appendChild(this);
                if (d.parent) {
                    moveStackToFront(d.parent);
                }
            })
    }
}