$(document).ready(function() {
  var values, povertyChanges, min, max, colorScale;

  var width = 960;
  var height = 500;

  var projection = d3.geo.albersUsa().translate([width/2, height/2]).scale([1000]);
  var path = d3.geo.path().projection(projection);

  var svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  d3.csv("povertydata.csv", function(data) {
    d3.json('us-states.json', function(json) {
      values = calculatePovertyChanges(data, 1980, 2016);
      povertyChanges = values[0];
      min = values[1];
      max = values[2];
      colorScale = d3.scale.linear().domain([min, (max + min) / 2, max]).range(['red', 'yellow', 'green']);
      svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('stroke', '#fff')
          .style('stroke-width', '1')
          .style('fill', function(d) {
            return colorScale(povertyChanges[d.properties.name]);
          });
    });
  });

});

function calculatePovertyChanges(data, start, end) {
  var min = 100;
  var max = 0;
  var result = {};
  for (var i = 0; i < data.length; i++) {
    var state = data[i].state;
    var diff = data[i][start] - data[i][end];
    result[state] = data[i][start] - data[i][end];
    if (diff < min) {
      min = diff;
    }
    if (diff > max) {
      max = diff;
    }
  }
  return [result, min, max];
}
