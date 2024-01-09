document.addEventListener("DOMContentLoaded", function () {

  sendQuery("SELECT id, firstname, lastname, email FROM competitors ORDER BY firstname ASC")
      .then(function (jsonResponse) {
        let resutlTable = document.getElementById("resultCompetitors");
        let html = "";

        jsonResponse.result.forEach(function (rowData) {
            html += "<tr id='" + rowData['id'] + "' class='row-click' onclick='editCompetitor(this.id)'>";
            html += "<td>" + rowData['firstname'] + "</td>";
            html += "<td>" + rowData['lastname'] + "</td>";
            html += "<td>" + rowData['email'] + "</td>";
            html += "</tr>";
        });
        resutlTable.innerHTML = html;
        

      })
      .catch(function (error) {
        console.error(error + ' line: ' + error.lineNumber);
      })

      sendQuery("SELECT competitions.id, ratstrialid, GROUP_CONCAT(trialdate ORDER BY trialdate SEPARATOR '|') AS merged_dates, location FROM day INNER JOIN competitions ON day.competitions_id = competitions.id GROUP BY ratstrialid ORDER BY merged_dates DESC;")
      .then(function (jsonResponse) {
        let resutlTable = document.getElementById("resultCompetitions");
        let html = "";

        jsonResponse.result.forEach(function (rowData) {
            let mergedDates = rowData['merged_dates'].split('|');
            let mergedDatesString = "";
            if (mergedDates.length == 1) {
              mergedDatesString = dateEnglish(mergedDates[0]);
            } else {
              mergedDatesString = dateEnglish(mergedDates[0]) + ' - ' + dateEnglish(mergedDates[mergedDates.length - 1]);
            }
            html += "<tr id='" + rowData['id'] + "' class='row-click' onclick='viewCompetition(this.id)'>";
            html += "<td>" + rowData['ratstrialid'] + "</td>";
            html += "<td>" + mergedDatesString + "</td>";
            html += "<td>" + rowData['location'] + "</td>";
            html += "</tr>";
        });
        resutlTable.innerHTML = html;
        

      })
      .catch(function (error) {
        console.error(error + ' line: ' + error.lineNumber);
      })
  });

  function viewCompetition(id) {
    window.location.href = '../pages/admin_viewCompetition.html?id=' + id;
  }

  function editCompetitor(id) {
    window.location.href = '../pages/admin_editCompetitor.html?id=' + id;
  }