// Global SOC Code variable.
var socCode = "";

// Activate upon user clicking "Search" button.

// Google Charts has been used for this project to produce accurate interactive charts and graphs.
// This code is also used to load the Google Charts package.
// setOnLoadCallback is used to call the drawChart() method once all of the data that is to be used
// on the chart/graph has been loaded (in this case, the API data).

$(document).ready(function() {
  $("#occupationSearch").click(function() {
    var occupation = document.getElementById("Occupation").value;
    google.charts.load("current", {
      packages: ['corechart']
    });
    google.charts.setOnLoadCallback(getLondon(), getNorthernIreland(), getWales(), getScotland());
    $.ajax({
      type: "GET",
      url: "http://api.lmiforall.org.uk/api/v1/soc/search?q=" + occupation,
      datatype: "JSON",
      success: getSoc
    })
  });
});

// Function to retrieve SOC Code from the API.
// encodeURIComponent used to pass variables through into another function. Without this, returns "undefined".
function getSoc(data) {
  socCode = data[0].soc;
  getLondon(encodeURIComponent(socCode));
  getNorthernIreland(encodeURIComponent(socCode));
  getWales(encodeURIComponent(socCode));
}

// Retrieve payment information for the London area.
// Array created to store payment details.
// For loop used to go through the API and retrieve each element.
// If statement used to determine correct year and sort accordingly. Without this years can return in an incorrect order.
// Years can return in an incorrect order purely due to how the API itself is structured.
function getLondon(socCode) {
  londonArray = new Array();
  $.ajax({
    type: "GET",
    url: "http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc=" + socCode + "&coarse=true&filters=region%3A1",
    dataType: "JSON",
    success: function(data) {
      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2013) {
          londonArray.push(data.series[i].estpay);
        }
      }

      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2015) {
          londonArray.push(data.series[i].estpay)
        }
      }

      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2017) {
          londonArray.push(data.series[i].estpay);
        }
      }
    }
  })
  getScotland(encodeURIComponent(socCode));
}

// Retrieve payment information for the Northern Ireland area.
// Array created to store payment details.
// For loop used to go through the API and retrieve each element.
function getNorthernIreland(socCode) {
  irelandArray = new Array();
  $.ajax({
    type: "GET",
    url: "http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc=" + socCode + "&coarse=true&filters=region%3A12",
    dataType: "JSON",
    success: function(data) {
      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2013) {
          irelandArray.push(data.series[i].estpay);
        }
      }

      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2015) {
          irelandArray.push(data.series[i].estpay)
        }
      }

      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2017) {
          irelandArray.push(data.series[i].estpay);
        }
      }
    }
  })
  getScotland(encodeURIComponent(socCode));
}

// Retrieve payment information for the Wales area.
// Array created to store payment details.
// For loop used to go through the API and retrieve each element.
function getWales(socCode) {
  walesArray = new Array();
  $.ajax({
    type: "GET",
    url: "http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc=" + socCode + "&coarse=true&filters=region%3A10",
    dataType: "JSON",
    success: function(data) {
      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2013) {
          walesArray.push(data.series[i].estpay);
        }
      }

      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2015) {
          walesArray.push(data.series[i].estpay)
        }
      }

      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2017) {
          walesArray.push(data.series[i].estpay);
        }
      }
    }
  })
  getScotland(encodeURIComponent(socCode));
}

// Retrieve payment information for the Scotland area and then display all data for every area on the line graph.
// For loop used to go through the API and retrieve each element.
function getScotland(socCode) {
  $.ajax({
    type: "GET",
    url: "http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc=" + socCode + "&coarse=true&filters=region%3A11",
    dataType: "JSON",
    success: function(data) {
      var line = new google.visualization.DataTable();
      line.addColumn('string', 'Year');
      line.addColumn('number', 'Scotland');
      line.addColumn('number', 'London');
      line.addColumn('number', 'Northern Ireland');
      line.addColumn('number', 'Wales');

      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2013) {
          line.addRow([data.series[i].year.toString(), data.series[i].estpay, londonArray[0], irelandArray[0], walesArray[0]]);
        }
      }

      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2015) {
          line.addRow([data.series[i].year.toString(), data.series[i].estpay, londonArray[1], irelandArray[1], walesArray[1]]);
        }
      }

      for (var i = 0; i < data.series.length; i++) {
        if (data.series[i].year == 2017) {
          line.addRow([data.series[i].year.toString(), data.series[i].estpay, londonArray[2], irelandArray[2], walesArray[2]]);
        }
      }

      // Graph options.
      // Sets graph title, graph dimensions, graph legend, axes titles, and line width and colour.
      var options = {
        title: "Change in Pay Rate by Year",
        line: {
          groupWidth: "95%"
        },
        legend: {
          textStyle: {
            color: "#FFFFFF"
          }
        },
        backgroundColor: {
          fill: 'transparent'
        },
        hAxis: {
          title: "Year",
          titleTextStyle: {
            color: "#FFFFFF"
          },
          textStyle: {
            color: "#FFFFFF"
          }
        },
        vAxis: {
          title: "Change in Weekly Pay (£)",
          titleTextStyle: {
            color: "#FFFFFF"
          },
          gridlines: {
            opacity: 0.5
          },
          textStyle: {
            color: "#FFFFFF"
          }
        },
        series: {
          0: {
            color: "#30F5FF",
            lineWidth: 5
          }, // Coloured of Scotland line.
          1: {
            color: "#FF385D",
            lineWidth: 5
          }, // Colour of London line.
          2: {
            color: "#36FF68",
            lineWidth: 5
          }, // Colour of Northern Ireland line.
          3: {
            color: "#FFFB00",
            lineWidth: 5
          } // Colour of Wales line.
        },
      };

      var view = new google.visualization.DataView(line);
      var chart = new google.visualization.LineChart(document.getElementById('lineChart'));

      chart.draw(line, options);
    }
  })
}
