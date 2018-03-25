$(document).ready(function() {
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
      svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('stroke', '#fff')
          .style('stroke-width', '1')
          .style('fill', '#000');
    });
  });

});
