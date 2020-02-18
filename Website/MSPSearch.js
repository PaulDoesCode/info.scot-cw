// Global postcode variable set to null to be used across multiple functions.
var postcode = "";

// Activate upon user clicking "Search" button.

// .empty() function used to clear MSP details when a user searches for another postcode.
// getElementById used to retrieve the value for the postcode variable based on user input in the search box.

// Google Charts has been used for this project to produce accurate interactive charts and graphs.
// This code is also used to load the Google Charts package.
// setOnLoadCallback is used to call the drawChart() method once all of the data that is to be used
// on the chart/graph has been loaded (in this case, the API data).

// AJAX function sets the constituency name based on the postcode entered by a user.
$(document).ready(function() {
  $("#PostcodeSearch").click(function() {
    $("#memberPhoto").empty();
    $("#memberName").empty();
    $("#memberEmail").empty();
    $("#memberParty").empty();
    postcode = document.getElementById("Postcode").value;
    var postcodeLink = "https://api.postcodes.io/scotland/postcodes/" + postcode;

    google.charts.load("current", {
      packages: ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart());

    $.ajax({
      type: "GET",
      url: postcodeLink,
      datatype: "JSON",
      success: function(data) {
        var constName = data.result.scottish_parliamentary_constituency;
        getConstId(constName);
      },
      error: invalidEntry
    })
  })
});

function invalidEntry() {
  alert("You have entered an invalid postcode. Please try again.");
}

// Returns the ID for the constituency based on the corresponding constituency name based on the
// postcode that is entered by a user.
// For loop used to go through the API until it reaches the matching data.
// ValidFromDate must be set to 2011-05-04T00:00:00 to ensure that the constituency that is found is a
// current valid constituency.
function getConstId(constName) {
  $.ajax({
    type: "GET",
    url: "https://data.parliament.scot/api/constituencies",
    datatype: "JSON",
    success: function(data) {
      for (var i = 0; i < data.length; i++) {
        if (constName == data[i].Name && data[i].ValidFromDate == "2011-05-04T00:00:00") {
          var id = data[i].ID;
        }
      }
      getMemberId(id);
    }
  })
}

// Returns the MSP Person ID based on the ID of the corresponding constituency which they
// represent.
// ElectionStatusID must be set to 1 to ensure that the MSP that is found is a currently active MSP.
function getMemberId(id) {
  $.ajax({
    type: "GET",
    url: "https://data.parliament.scot/api/MemberElectionConstituencyStatuses",
    datatype: "JSON",
    success: function(data) {
      for (var i = 0; i < data.length; i++) {
        if (id == data[i].ConstituencyID && data[i].ElectionStatusID == 1) {
          var personID = data[i].PersonID;
        }
      }
      getMemberProfile(personID);
    }
  })
}

// Returns the MSP name and photo for the corresponding MSP based on the Person ID.
// The split method is used to take the name in the API, which is formatted as "Surname, Forename" and essentially reverse it
// so that it is presented as "Forename Surname".
function getMemberProfile(personID) {
  $.ajax({
    type: "GET",
    url: "https://data.parliament.scot/api/members",
    datatype: "JSON",
    success: function(data) {
      for (var i = 0; i < data.length; i++) {
        if (personID == data[i].PersonID) {
          var name = data[i].ParliamentaryName;
          var concatName = name.split(',');
          var memberName = concatName[1] + " " + concatName[0];
          var memberPhoto = data[i].PhotoURL;
        }
      }
      getMemberEmail(memberName, memberPhoto, personID);
    }
  })
}

// Returns the MSP email address for the corresponding MSP based on the Person ID.
// EmailAddressTypeID must be equal to 1 to ensure it is a valid email.
function getMemberEmail(memberName, memberPhoto, personID) {
  $.ajax({
    type: "GET",
    url: "https://data.parliament.scot/api/emailaddresses",
    datatype: "JSON",
    success: function(data) {
      for (var i = 0; i < data.length; i++) {
        if (personID == data[i].PersonID && data[i].EmailAddressTypeID == 1) {
          var memberEmail = data[i].Address;
        }
      }
      getMemberPartyID(memberName, memberPhoto, memberEmail, personID);
    }
  })
}

// Returns the Party ID which is then used in the next function to retrieve the actual party name for the
// corresponding MSP.
// For loop used to go through the API and find the matching Person ID (i.e. the MSP ID) and return the corresponding
// Party ID.
function getMemberPartyID(memberName, memberPhoto, memberEmail, personID) {
  $.ajax({
    type: "GET",
    url: "https://data.parliament.scot/api/memberparties",
    datatype: "JSON",
    success: function(data) {
      for (var i = 0; i < data.length; i++) {
        if (personID == data[i].PersonID) {
          var memberParty = data[i].PartyID;
        }
      }
      getPartyName(memberParty, memberName, memberPhoto, memberEmail);
    }
  })
}

// Returns the actual party name (e.g. "Labour", "Scottish National Party") for the corresponding MSP and Party ID.
// For loop used to go through the API and find the matching Party ID and return the corresponding actual party name.
function getPartyName(memberParty, memberName, memberPhoto, memberEmail) {
  $.ajax({
    type: "GET",
    url: "https://data.parliament.scot/api/parties",
    datatype: "JSON",
    success: function(data) {
      for (var i = 0; i < data.length; i++) {
        if (memberParty == data[i].ID) {
          var party = data[i].ActualName;
        }
      }
      // Code used to call display function.
      display(memberParty, memberName, memberPhoto, memberEmail, party);
    }
  })
}

// Function used to display MSP details on the HTML page.
function display(memberParty, memberName, memberPhoto, memberEmail, party) {
  $("#memberName").append(memberName);
  $("#memberParty").append(party);
  $("#memberEmail").append(memberEmail);
  $("#memberPhoto").attr("src", memberPhoto);

  // Code used to remove blank image placeholder from screen and display MSP photo when a user searches.
  document.querySelector("#memberPhoto").style.display = "flex";

// If the MSP Party is Scottish Labour set image border to a red colour.
  if (party == "Scottish Labour") {
    document.getElementById("memberPhoto").style.borderColor = "#E03140";
  }

  // If the MSP Party is Scottish Conservative and Unionist Party set image border to a blue colour.
  if (party == "Scottish Conservative and Unionist Party") {
    document.getElementById("memberPhoto").style.borderColor = "#0099E0";
  }

  // If the MSP Party is Scottish Liberal Democrats set image border to an orange colour.
  if (party == "Scottish Liberal Democrats") {
    document.getElementById("memberPhoto").style.borderColor = "#FF9F19";
  }

  // If the MSP Party is Scottish National Party set image border to a yellow colour.
  if (party == "Scottish National Party") {
    document.getElementById("memberPhoto").style.borderColor = "#FFFB00";
  }

  // If the MSP Party is Scottish Green Party set image border to a green colour.
  if (party == "Scottish Green Party") {
    document.getElementById("memberPhoto").style.borderColor = "#93FF00";
  }

  // If the MSP Party is Independent set image border to white.
  if (party == "Independent") {
    document.getElementById("memberPhoto").style.borderColor = "#FFFFFF";
  }

  $("#memberParty").css("visibility", "visible");
  $("#memberEmail").css("visibility", "visible");

  // Code used to call drawChart() function and createTable() function.
  drawChart();
  createTable();
}

// Function used to draw column chart identifying the top 5 jobs in the area based on availability.
function drawChart() {
  // AJAX function takes the jobs_breakdown API and searches based on the postcode that a user enters.
  $.ajax({
    type: "GET",
    url: "http://api.lmiforall.org.uk/api/v1/census/jobs_breakdown?area=" + postcode,
    dataType: "JSON",
    success: function(data) {
      var bar = new google.visualization.DataTable();

      // Data metrics.
      bar.addColumn('string', 'Job');
      bar.addColumn('number', 'Value');

      // For loop used to go through the top 5 jobs and display.
      for (var i = 0; i < 5; i++) {
        bar.addRow([data.jobsBreakdown[i].description, data.jobsBreakdown[i].value]);
      }

      // Options variable defines miscellaneous chart/graph attributes.
      // "position: none" is used to hide the chart legend.
      var options = {
        title: "Top 5 Jobs in the Area by Availability",
        bar: {
          groupWidth: "95%"
        },
        backgroundColor: {
          fill: 'transparent'
        },
        hAxis: {
          title: "Job Title",
          titleTextStyle: {
            color: "#FFFFFF"
          },
          textStyle: {
            color: "#FFFFFF"
          }
        },
        vAxis: {
          title: "# of Available Jobs",
          titleTextStyle: {
            color: "#FFFFFF"
          },
          textStyle: {
            color: "#FFFFFF"
          }
        },
        legend: {
          position: "none"
        },
        series: {
          0: {
            color: "#30F5FF"
          }
        }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('barChart'));
      chart.draw(bar, options);
    }
  })
}

// Code used to take user input and filter the job breakdown table below.
// Filter is totally case independent and a user can enter either upper or lower case data.
$(document).ready(function() {
  $("#jobInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#jobStatsTableBody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      console.log(value);
    });
  });
});

// Function used to produce a table providing detailed job breakdown for the area.
function createTable() {
  // AJAX function takes the jobs_breakdown API and searches based on the postcode that a user enters.
  $.ajax({
    type: "GET",
    url: "http://api.lmiforall.org.uk/api/v1/census/jobs_breakdown?area=" + postcode,
    dataType: "json",
    success: function(data) {
      var jobStatsTable = $("<table />");

      var stringOutput = "";

      for (var i = 0; i < data.jobsBreakdown.length; i++) {
        // Code used to reveal the table search bar and table headings upon a user searching for a postcode.
        // NB:  Works on Firefox and Chrome, not on Microsoft Edge.
        //      On Microsoft Edge the table details will not hide.
        $("#jobTableFilter").css("visibility", "visible");

        // Setting value of job stats table row.
        var jobStatsTableRow = $("<tr />");

        // Jobs description data (i.e. job name).
        jobString = data.jobsBreakdown[i].description;
        var jobCell = $("<td>", {
          text: jobString
        }, "</td>");

        // Number of jobs data.
        jobNumberString = data.jobsBreakdown[i].value;
        var jobNumberCell = $("<td>", {
          text: jobNumberString
        }, "</td>");

        // Appends each row of data taken from the API to the table.
        $("#jobStatsTableBody")
          .append("<tr><td>" + jobString + "</td><td>" + jobNumberString) + "</td></tr>";

        // Commented code here appends sequentially which doesn't work with the filter.
        // Have to use the above method of manually using the table tags to produce the table accurately.
        //  var a =  $("#jobStatsTableBody")
        //  .append(jobStatsTableRowStart)
        //  .append(jobCell)
        //  .append(jobNumberCell);

        // Appends another table row.
        $("#jobStatsTableBody")
          .append(jobStatsTableRow);
      }
    }
  })
}
