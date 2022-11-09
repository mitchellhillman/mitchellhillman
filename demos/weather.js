const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const cville = [
  {
    dailyMean: 36.2,
    month: "Jan",
  },
  {
    dailyMean: 39.1,
    month: "Feb",
  },
  {
    dailyMean: 46.4,
    month: "Mar",
  },
  {
    dailyMean: 57.1,
    month: "Apr",
  },
  {
    dailyMean: 65.4,
    month: "May",
  },
  {
    dailyMean: 73.5,
    month: "Jun",
  },
  {
    dailyMean: 77.6,
    month: "Jul",
  },
  {
    dailyMean: 75.9,
    month: "Aug",
  },
  {
    dailyMean: 69.4,
    month: "Sep",
  },
  {
    dailyMean: 58.7,
    month: "Oct",
  },
  {
    dailyMean: 48.5,
    month: "Nov",
  },
  {
    dailyMean: 40.0,
    month: "Dec",
  },
];
const kyiv = [
  {
    dailyMean: 26.2,
    month: "Jan",
  },
  {
    dailyMean: 27.9,
    month: "Feb",
  },
  {
    dailyMean: 36.5,
    month: "Mar",
  },
  {
    dailyMean: 50.0,
    month: "Apr",
  },
  {
    dailyMean: 60.4,
    month: "May",
  },
  {
    dailyMean: 67.1,
    month: "Jun",
  },
  {
    dailyMean: 70.3,
    month: "Jul",
  },
  {
    dailyMean: 68.9,
    month: "Aug",
  },
  {
    dailyMean: 58.8,
    month: "Sep",
  },
  {
    dailyMean: 47.5,
    month: "Oct",
  },
  {
    dailyMean: 36.7,
    month: "Nov",
  },
  {
    dailyMean: 28.8,
    month: "Dec",
  },
];
const example1 = document.getElementById("example-1");
const padding = {
  bottom: 50,
  left: 65,
  right: 0,
  top: 10,
};
const width = 400;
const height = 200;
const blue = "#7db7d4";
const gridColor = "#efefef";
const textColor = "#333";

const xScale = d3.scaleBand().domain(months).range([0, width]);
const yScale = d3.scaleLinear().domain([20, 100]).range([height, 0]);

const svg = d3
  .select(example1)
  .attr("width", width + padding.left + padding.right)
  .attr("height", height + padding.top + padding.bottom);

// Graph
const graph = svg
  .append("g")
  .attr("id", "graph")
  .attr("transform", `translate(${padding.left}, ${padding.top})`);

// Axis Left
const axisLeftGenerator = d3.axisLeft(yScale).ticks(10).tickSize(0);
const axisLeft = graph
  .append("g")
  .attr("id", "axisLeft")
  .call(axisLeftGenerator);

axisLeft.selectAll(".tick text").attr("transform", "translate(-10, 0)");

axisLeft
  .selectAll(".tick")
  .attr("style", "font-size: 12px;")
  .append("rect")
  .attr("fill", gridColor)
  .attr("width", width)
  .attr("height", 1);

// Axis Bottom
const axisBottomGenerator = d3.axisBottom(xScale).tickSize(0);

graph
  .append("g")
  .attr("id", "axisBottom")
  .attr("transform", `translate(0, ${height})`)
  .call(axisBottomGenerator)
  .selectAll(".tick text")
  .attr("transform", "translate(0 , 10)");

// Axis Styles
graph.selectAll(".domain").attr("stroke", gridColor);

graph
  .selectAll(".tick text")
  .attr("fill", textColor)
  .attr("style", "font-size: 12px;");

// line
graph
  .append("path")
  .attr("id", "my-path")
  .datum(kyiv)
  .attr("fill", "none")
  .attr("stroke", blue)
  .attr("stroke-width", 4)
  .attr(
    "d",
    d3
      .line()
      .curve(d3.curveNatural)
      .x(({ month }) => xScale(month) + xScale.bandwidth() / 2)
      .y(({ dailyMean }) => yScale(dailyMean))
  );

// line
graph
  .append("path")
  .attr("id", "my-path")
  .datum(cville)
  .attr("fill", "none")
  .attr("stroke", textColor)
  .attr("stroke-width", 4)
  .attr(
    "d",
    d3
      .line()
      .curve(d3.curveNatural)
      .x(({ month }) => xScale(month) + xScale.bandwidth() / 2)
      .y(({ dailyMean }) => yScale(dailyMean))
  );
