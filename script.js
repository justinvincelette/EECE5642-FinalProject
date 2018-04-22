$(document).ready(function() {
  var values, povertyChanges, min, max, colorScale, allData;

  var width = 960;
  var height = 500;

  var startYear = 1980;
  var endYear = 2016;

  var projection = d3.geo.albersUsa().translate([width/2, height/2]).scale([1000]);
  var path = d3.geo.path().projection(projection);

  var svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  var tooltip = svg.append('text')
      .attr('x', width/2)
      .attr('y', 40)
      .attr('id', 'tooltip')
      .style('text-anchor', 'middle')
      .text('');

  var defs = svg.append('defs');

  var linearGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient');

  d3.csv('povertydata.csv', function(data) {
    d3.json('us-states.json', function(json) {
      allData = data;
      values = calculatePovertyChanges(data, startYear, endYear);
      povertyChanges = values[0];
      min = values[1];
      max = values[2];
      colorScale = d3.scale.linear().domain([min, (max + min) / 2, max]).range(['red', 'yellow', 'green']);
      // Add map to svg
      svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('stroke', '#fff')
          .style('stroke-width', '1')
          .style('fill', function(d) {
            return colorScale(povertyChanges[d.properties.name]);
          })
          .on('mouseover', function(d) {
            var state = d.properties.name;
            svg.selectAll('#tooltip')
                .text(state + ' ' + (povertyChanges[state] * -1).toFixed(2) + '%')
                .style('fill', colorScale(povertyChanges[state]));
          })
          .on('mouseout', function() {
            svg.selectAll('#tooltip').text('');
          });
      // Calculate linear gradient based on color scale
      linearGradient.selectAll('stop')
          .data( colorScale.range() )
          .enter().append('stop')
          .attr('offset', function(d,i) { return i/(colorScale.range().length-1); })
          .attr('stop-color', function(d) { return d; });
      // Add scale to svg, based on linear gradient
      svg.append('rect')
          .attr('id', 'rectid')
    	    .attr('width', 300)
    	    .attr('height', 20)
          .attr('x', 100)
          .attr('y', -width + 70)
          .attr('transform', 'rotate(90)')
    	    .style('fill', 'url(#linear-gradient)');
      // Add lower label of scale
      svg.append('text')
          .attr('x', width - 65)
          .attr('y', 115)
          .attr('id', 'textupper')
          .text(Math.abs(min).toFixed(2) + '%');
      // Add upper level of scale
      svg.append('text')
          .attr('x', width - 65)
          .attr('y', 400)
          .attr('id', 'textlower')
          .text((Math.abs(max) * -1).toFixed(2) + '%');
      // Add labels
      var increased = svg.append('text')
          .attr('x', width - 135)
          .attr('y', 95)
          .text('Poverty Increased');
      var increased = svg.append('text')
          .attr('x', width - 135)
          .attr('y', 417)
          .text('Poverty Decreased');   

      // Add labels for best and worst performers
      var bestPerformer = getBestPerformer(povertyChanges)
      var worstPerformer = getWorstPerformer(povertyChanges) 
      var bestState = svg.append('text')
      .attr('x', width - 480)
      .attr('y', 470)
      .style("font-size", "16px")
      .attr('id', 'bestPerformer')
      .text('Most Improvement: ' + bestPerformer);  
      var worstState = svg.append('text')
      .attr('x', width - 480)
      .attr('y', 490)
      .style("font-size", "16px")
      .attr('id', 'worstPerformer')
      .text('Least Improvement: ' + worstPerformer); 

    });
  });

  $( "#slider-3" ).slider({
     range:true,
     min: 1980,
     max: 2016,
     values: [ startYear, endYear ],
     slide: function( event, ui ) {
        if ( ( ui.values[ 0 ]) >= ui.values[ 1 ] ) {
          return false;
        }
        startYear = ui.values[0];
        endYear = ui.values[1];
        $( "#startYear" ).text(startYear);
        $( "#endYear" ).text(endYear);

        values = calculatePovertyChanges(allData, startYear, endYear);
        povertyChanges = values[0];
        min = values[1];
        max = values[2];
        colorScale = d3.scale.linear().domain([min, (max + min) / 2, max]).range(['red', 'yellow', 'green']);

        // update Map
        svg.selectAll('path')
            .style('fill', function(d) {
              return colorScale(povertyChanges[d.properties.name]);
            });
        document.getElementById('textupper').textContent = String((Math.abs(min)).toFixed(2)) + '%';
        document.getElementById('textlower').textContent = String((Math.abs(max) * -1).toFixed(2)) + '%';
        document.getElementById('bestPerformer').textContent = 'Most Improvement: '+ String(getBestPerformer(povertyChanges));
        document.getElementById('worstPerformer').textContent = 'Least Improvement: '+ String(getWorstPerformer(povertyChanges));
     }
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

function getBestPerformer(povertyChanges) {
  return Object.keys(povertyChanges).reduce((a, b) => povertyChanges[a] > povertyChanges[b] ? a : b);
}

function getWorstPerformer(povertyChanges) {
  return Object.keys(povertyChanges).reduce((a, b) => povertyChanges[a] < povertyChanges[b] ? a : b);
}