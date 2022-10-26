---
layout: post
title: "Simple chart using D3.js"
tags:
  - "d3"
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.6.1/d3.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

This post outlines the basics of how to use the `d3` javascript library to make a simple chart.

Contents:

- [SVG Dimensions](#svg-dimensions)
- [Define X and Y Axis](#define-x-and-y-axis)
- [Draw the axis labels](#draw-the-axis-labels)
- [Draw dots for each point](#draw-dots-for-each-point)
- [Draw a line connecting the dots](#draw-a-line-connecting-the-dots)

## Finished Example

<svg id="example-1"></svg>
First, import the `d3` library into your project. This example will use version `7.6.1` of the `d3` library hosted from a `cdn`.

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.6.1/d3.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

```

## SVG dimensions

Create an SVG element and set its size.

```html
<svg id="my-chart"></svg>
```

```js
const element = document.getElementById("my-chart");

const width = 400;
const height = 200;
const padding = {
  bottom: 50,
  left: 65,
  right: 0,
  top: 10,
};

const svg = d3
  .select(element)
  .attr("width", width + padding.left + padding.right)
  .attr("height", height + padding.top + padding.bottom);
```

## Define X and Y Axis

Set the `range` and `domain` of the x and y axis of your data using one of the [d3 scale types](https://github.com/d3/d3-scale).

```js
const xScale = d3
  // d3.scaleBand() requires an actual Date object to work properly.
  .scaleBand()
  .domain(data.map(({ date }) => new Date(date)))
  .range([0, width]);

const yScale = d3
  .scaleLinear()
  // d3.max function is helpful for determining the maximum value from a data set.
  .domain([0, d3.max(data.map(({ amount }) => amount))])
  .range([height, 0]);
```

`domain` is the total amount of data this chart will display on that axis. `range` is the physical space in pixels that amount of data will be spread across. Take note that `width` is the second element of the array for the yScale, but `height` is the first element for the `xScale`. Depending on your design those may need to be reversed.

## Draw the axis labels

Create a `g` group that will position all the future graphic elements

```js
const graph = svg
  .append("g")
  .attr("id", "graph")
  .attr("transform", `translate(${padding.left}, ${padding.top})`);
```

Use `d3.axisLeft` and `d3.axisRight` respectively to make an axis generator based on the scales just created

```js
const axisLeftGenerator = d3
  .axisLeft(yScale)
  .tickFormat(d3.format(".1s"))
  .ticks(5)
  .tickSize(0);

const axisBottomGenerator = d3
  .axisBottom(xScale)
  .tickSize(0)
  .tickFormat(d3.timeFormat("%b"));
```

Append the left axis to the `graph` and configure the text and general appearance

```js
const axisLeft = graph
  .append("g")
  .attr("id", "axisLeft")
  .call(axisLeftGenerator);

axisLeft.selectAll(".tick text").attr("transform", "translate(-11, 0)");

axisLeft
  .selectAll(".tick")
  .attr("style", "font-size: 12px; text-transform: uppercase")
  .append("rect")
  .attr("fill", gridColor)
  .attr("width", width)
  .attr("height", 1);
```

Do the same for the bottom axis.

```js
graph
  .append("g")
  .attr("id", "axisBottom")
  .attr("transform", `translate(0, ${height})`)
  .call(axisBottomGenerator)
  .selectAll(".tick text")
  .attr("transform", "translate(0 , 13)");
```

In this example some styles apply to both x and y axis.

```js
graph.selectAll(".domain").attr("stroke", gridColor);

graph
  .selectAll(".tick text")
  .attr("fill", textColor)
  .attr("style", "font-size: 12px;");
```

## Draw dots for each point

```js
graph
  .append("g")
  .attr("fill", blue)
  .attr("id", "dots")
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", 5)
  .attr("transform", ({ amount, date }) => {
    const x = xScale(new Date(date)) + xScale.bandwidth() / 2;
    const y = yScale(amount);
    return `translate(${x}, ${y})`;
  });
```

## Draw a line connecting the dots

```js
graph
  .append("path")
  .attr("id", "my-path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", blue)
  .attr("stroke-width", 1)
  .attr(
    "d",
    d3
      .line()
      .x(({ date }) => xScale(new Date(date)) + xScale.bandwidth() / 2)
      .y(({ amount }) => yScale(amount))
  );
```

<script>
  const example1 = document.getElementById('example-1')
  const padding = {
    bottom: 50,
    left: 65,
    right: 0,
    top: 10
  };
  const width = 400;
  const height = 200;
  const blue = '#7db7d4';
  const gridColor = '#efefef';
  const textColor = '#333';

  const data = [
    { amount: 0, date: '01/02/2021' },
    { amount: 0, date: '02/03/2021' },
    { amount: 0, date: '03/04/2021' },
    { amount: 0, date: '04/05/2021' },
    { amount: 100, date: '06/07/2021' },
    { amount: 900, date: '05/06/2021' },
    { amount: 8000, date: '08/09/2021' },
    { amount: 13000, date: '07/08/2021' },
    { amount: 40000, date: '09/09/2021' },
    { amount: 60000, date: '10/09/2021' },
    { amount: 0, date: '11/09/2021' },
    { amount: 0, date: '12/09/2021' }
  ];

  const xScale = d3
    .scaleBand()
    .domain(data.map(({ date }) => new Date(date)))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map(({ amount }) => amount))])
    .range([height, 0]);

  const svg = d3
    .select(example1)
    .attr('width', width + padding.left + padding.right)
    .attr('height', height + padding.top + padding.bottom);

    // Graph
    const graph = svg
      .append('g')
      .attr('id', 'graph')
      .attr('transform', `translate(${padding.left}, ${padding.top})`);

    // Axis Left
    const axisLeftGenerator = d3
      .axisLeft(yScale)
      .tickFormat(d3.format('.1s'))
      .ticks(5)
      .tickSize(0);

    const axisLeft = graph
      .append('g')
      .attr('id', 'axisLeft')
      .call(axisLeftGenerator);

    axisLeft
      .selectAll('.tick text')
      .attr('transform', 'translate(-11, 0)');

    axisLeft
      .selectAll('.tick')
      .attr('style', 'font-size: 12px; text-transform: uppercase')
      .append('rect')
      .attr('fill', gridColor)
      .attr('width', width)
      .attr('height', 1);

    // Axis Bottom
    const axisBottomGenerator = d3
      .axisBottom(xScale)
      .tickSize(0)
      .tickFormat(d3.timeFormat('%b'));

    graph
      .append('g')
      .attr('id', 'axisBottom')
      .attr('transform', `translate(0, ${height})`)
      .call(axisBottomGenerator)
      .selectAll('.tick text')
      .attr('transform', 'translate(0 , 13)');

    // Axis Styles
    graph
      .selectAll('.domain')
      .attr('stroke', gridColor);

    graph
      .selectAll('.tick text')
      .attr('fill', textColor)
      .attr('style', 'font-size: 12px;');

    // line
    graph
      .append('path')
      .attr('id', 'my-path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', blue)
      .attr('stroke-width', 1)
      .attr('d', d3.line()
        .x(({ date }) => xScale(new Date(date)) + (xScale.bandwidth() / 2))
        .y(({ amount }) => yScale(amount)));

    // dots
    graph
      .append('g')
      .attr('fill', blue)
      .attr('id', 'dots')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('transform', ({ amount, date }) => {
        const x = xScale(new Date(date)) + (xScale.bandwidth() / 2);
        const y = yScale(amount);
        return `translate(${x}, ${y})`;
      });
</script>
