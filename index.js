const margin = { top: 100, right: 0, bottom: 0, left: 0 },
  width = 900 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom,
  innerRadius = 120,
  outerRadius = Math.min(width, height) / 2;

// append the svg object
const svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

const colourArray = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF", "#F3BEFF", "#FFFFFC"];

function colourChange (colourIndex) {
  return colourArray[colourIndex]
}

d3.csv("./2019.csv").then(function (data) {
  let filteredData = data
    .sort((a, b) => b.Score - a.Score)
    .slice(0, 10);

  console.log(filteredData);
  const x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(filteredData.map(d => (d["Country or region"])));

  const y = d3.scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([7, 8]);

  const ybis = d3.scaleRadial()
    .range([innerRadius, 5])
    .domain([0, 10]);

  // Add the bars
  svg.append("g")
    .selectAll("path")
    .data(filteredData)
    .join("path")
    .attr("fill", (d, i ) => colourArray[i])
    .attr("class", "yo")
    .attr("d", d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => y(d.Score))
      .startAngle(d => x(d["Country or region"]))
      .endAngle(d => x(d["Country or region"]) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius))

  // Add the labels
  svg.append("g")
    .selectAll("g")
    .data(filteredData)
    .join("g")
    .attr("text-anchor", function (d) { return (x(d["Country or region"]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function (d) { return "rotate(" + ((x(d["Country or region"]) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.Score) + 10) + ",0)"; })
    .append("text")
    .text(d => d["Country or region"])
    .attr("transform", function (d) { return (x(d["Country or region"]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "11px")
    .style("fill", "#d346f3")
    .attr("alignment-baseline", "middle")

  svg.append("g")
    .selectAll("path")
    .data(filteredData)
    .join("g")
    .attr("text-anchor", function (d) { return (x(d["Country or region"]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function (d) { return "rotate(" + ((x(d["Country or region"]) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (ybis(d.Score) + 10) + ",0)"; })
    .append("text")
    .text(d => d.Score)
    .attr("transform", function (d) { return (x(d["Country or region"]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "11px")
    .style("fill", "#d346f3")
    .attr("alignment-baseline", "middle")
});

