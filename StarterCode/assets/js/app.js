// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) ,
        d3.max(stateData, d => d[chosenXAxis])
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis]),
        d3.max(stateData, d => d[chosenYAxis])
      ])
      .range([height,0]);
  
    return yLinearScale;
  
  }
  
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group x with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
        
    return circlesGroup;
  }
function renderXTextCircles(textGroup,newXScale, chosenXAxis){
    d3.selectall(".stateAbbr")
    .attr("x", d => newXScale(d[chosenXAxis]));
    return textGroup;
}

// function used for updating circles group x with a transition to
// new circles
function renderYTextCircles(textGroup,newYScale, chosenYAxis){
    d3.selectall(".stateAbbr")
    .attr("y", d => newYScale(d[chosenYAxis]));
    return textGroup;
}
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
        
    return circlesGroup;

  }
// function to update the text in circles

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

    var labelX;
    var labelY;
  
    if (chosenXAxis === "poverty") {
      labelX = "Poverty: ";
    }
    else if (chosenXAxis === "age"){
      labelX = "Age: ";
    }
    else {
        labelX = "Household Income: ";
      }
    if (chosenYAxis === "obesity") {
        labelY = "Obese: ";
      }
    else if (chosenYAxis === "smokes"){
        labelY = "Smokes: ";
      }
    else {
          labelY = "Lacks Healthcare: ";
        }
  
    var toolTip = d3.tip()
     .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}
        <br>${labelX} ${d[chosenXAxis]} %
        <br>${labelY} ${d[chosenYAxis]} %`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(stateData, err) {
  if (err) throw err;

  // parse data
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = + data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale =xScale(stateData, chosenXAxis);


  // Create y scale function
  var yLinearScale = yScale(stateData, chosenYAxis)

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue");
    var textGroup = chartGroup.append("g")
    .selectAll("text")
    .data(stateData)
    .enter()
    .append("text")
    .attr("class", "stateAbbr")
    .attr("text-anchor", "middle")
    .attr("class","stateText")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .style("fill", "white")
    .style("font", "10px sans-serif")
    .style("font-weight", "bold")
    .text(function(data) {
      return data.abbr;})
 // Create group for 3 x-axis labels
  var labelsGroupX = chartGroup.append("g")
 .attr("transform", `translate(${width / 2}, ${height + 20})`)
 .attr("class", "aText")
 
  var povertyLabel = labelsGroupX.append("text")
 .attr("x", 0)
 .attr("y", 20)
 .attr("value", "poverty") // value to grab for event listener
 .classed("active", true)
 .text("In Poverty (%)");

  var ageLabel = labelsGroupX.append("text")
 .attr("x", 0)
 .attr("y", 40)
 .attr("value", "age") // value to grab for event listener
 .classed("inactive", true)
 .text("Age (Median)");

  var houseIncomeLabel = labelsGroupX.append("text")
 .attr("x", 0)
 .attr("y", 60)
 .attr("value", "income") // value to grab for event listener
 .classed("inactive", true)
 .text("Household Income (Median)");


var labelsGroupY = chartGroup.append("g")
 .attr("transform", "rotate(-90)")
 .attr("class", "aText")
var obeseLabel=labelsGroupY.append("text")
.attr("y", -80)
.attr("x", 0 - (height / 2))
.attr("value", "obesity") // value to grab for event listener
.classed("active", true)
.text("Obese (%)");

var smokeLabel=labelsGroupY.append("text")
.attr("y", -60)
.attr("x", 0 - (height / 2))
.attr("value", "smokes") // value to grab for event listener
.classed("inactive", true)
.text("Smoke (%)");

var healthcareLabel=labelsGroupY.append("text")
.attr("y", -40)
.attr("x", 0 - (height / 2))
.attr("value", "healthcare") // value to grab for event listener
.classed("inactive", true)
.text("Lacks Healthcare (%)");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis ,circlesGroup);

//   x axis labels event listener
  labelsGroupX.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
        
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

        renderXTextCircles(textGroup,xLinearScale, chosenXAxis);
        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          houseIncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          houseIncomeLabel
            .classed("active", false)
            .classed("inactive", true);
          }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          houseIncomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
//  y axis labels event listener
labelsGroupY.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    // replaces chosenXAxis with value
    chosenYAxis = value;

    // functions here found above csv import
    // updates x scale for new data
    yLinearScale = yScale(stateData, chosenYAxis);

    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

    renderYTextCircles(textGroup,yLinearScale, chosenYAxis);

    // changes classes to change bold text
    if (chosenYAxis === "obesity") {
        obeseLabel
        .classed("active", true)
        .classed("inactive", false);
      smokeLabel
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenYAxis === "smokes") {
        obeseLabel
        .classed("active", false)
        .classed("inactive", true);
        smokeLabel
        .classed("active", true)
        .classed("inactive", false);
        healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      }
    else {
        obeseLabel
        .classed("active", false)
        .classed("inactive", true);
        smokeLabel
        .classed("active", false)
        .classed("inactive", true);
        healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  }
});
})
    
