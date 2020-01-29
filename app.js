// JavaScript source code
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// andset the dimensions.
var healthdata;
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
//import csv file
var file = "healthdata.csv"
d3.csv(file).then(function(data) {
    console.log(data);

    //cast as numbers
    data.forEach(function (d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    healthdata = data;
//scale function
var xLinearScale = d3.scaleLinear()
.domain([8, d3.max(healthdata, d => d.poverty) + 2])
.range([0, width]);


var yLinearScale = d3.scaleLinear()
.domain([4, 26])
.range([height, 0]);
//Axis function
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Step 4: Append Axes to the chart
chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);
//Create Circles
var circlesGroup = chartGroup.selectAll("circle")
.data(healthdata)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", "15")
.attr("fill", "blue")
.attr("class", "stateCircle");
//add text to the group   
chartGroup.append("g").selectAll("text")
.data(healthdata)
.enter()
.append("text")
.text(function (d) {
return d.abbr;
})
.attr("dx", d => xLinearScale(d.poverty))
.attr("dy", d => yLinearScale(d.healthcare)+5)
.attr("class","stateText");

// Step 6: Initialize tool tip
// ==============================
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60])
.html(function(d) {
return (`${d.state}<br><br>Poverty: ${d.poverty}% <br>NoHealthcare: ${d.healthcare}%`);
});

// Step 7: Create tooltip in the chart
// ==============================
chartGroup.call(toolTip);

// Step 8: Create event listeners to display and hide the tooltip
// ==============================
circlesGroup.on("mouseover", function(data) {
toolTip.show(data, this)
// .transition()
// .duration(500);
})
// onmouseout event
.on("mouseout", function(data, index) {
toolTip.hide(data)
// .transition()
// .duration(500);
});

// Create axes labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "aText")
.text("Lacks HealthCare(%)");

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "aText")
.text("In Poverty(%)");

});


