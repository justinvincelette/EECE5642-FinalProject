// update the map
function updateMap(start, end) {
  console.log("Map should be updated for " + startYear + " to " + endYear);
  var values, povertyChanges, min, max, colorScale, startYear, endYear, svg;

  startYear = start;
  endYear = end;
  svg = d3.select('svg')

  d3.csv('povertydata.csv', function(data) {
    d3.json('us-states.json', function(json) {
      values = calculatePovertyChanges(data, startYear, endYear);
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
    });
  });
}

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