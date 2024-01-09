document.addEventListener("DOMContentLoaded", function () {

    //Get competitor ID from URL
    var competitorID = new URLSearchParams(window.location.search).get("id");

    let html = "";

    const competitorsQuery = sendQuery("SELECT * FROM competitors WHERE id = " + competitorID)
        .then(function (jsonResponse) {
            let resutlTable = document.getElementById("competitors");
            html = "";
            jsonResponse.result.forEach(function (rowData) {
                html += "<form name='competitors'><fieldset><legend>Competitor</legend>";
                for (const [key, value] of Object.entries(rowData)) {
                    if (key != 'id') {
                        html += "<label for='" + key + "'>" + key + ": </label>";
                        html += "<input type='text' name='" + key + "' value='" + value + "'><br>";
                    } else {
                        html += "<input type='hidden' name='id' value='" + value + "'>";
                    }
                }
                html += "<input type='button' value='Update' onclick='updateData(this.form)'>";
                html += "</fieldset></form>";
            });
            resutlTable.innerHTML = html;
        })

    const emergencyQuery = sendQuery("SELECT * FROM emergency WHERE competitors_id = " + competitorID)
        .then(function (jsonResponse) {
            let resutlTable = document.getElementById("emergency");
            if (jsonResponse) {
                html = "";
                jsonResponse.result.forEach(function (rowData) {
                    html += "<form name='emergency'><fieldset><legend>Emergency</legend>";
                    for (const [key, value] of Object.entries(rowData)) {
                        if (key != 'id' && key != 'competitors_id') {
                            html += "<label for='" + key + "'>" + key + ": </label>";
                            html += "<input type='text' name='" + key + "' value='" + value + "'><br>";
                        } else {
                            html += "<input type='hidden' name='" + key + "' value='" + value + "'>";
                        }
                    }
                    html += "<input type='button' value='Update' onclick='updateData(this.form)'>";
                    html += "</fieldset></form>";
                });
            } else {
                html += "<p>No dogs found</p>";
            }
            resutlTable.innerHTML = html;
        })

    const dogQuery = sendQuery("SELECT * FROM dogs WHERE competitors_id = " + competitorID)
        .then(function (jsonResponse) {
            let resutlTable = document.getElementById("dogs");
            if (jsonResponse) {
                html = "";
                jsonResponse.result.forEach(function (rowData) {
                    html += "<form name='dogs'><fieldset><legend>" + rowData['name'] + "</legend>";
                    for (const [key, value] of Object.entries(rowData)) {
                        if (key != 'id' && key != 'competitors_id') {
                            html += "<label for='" + key + "'>" + key + ": </label>";
                            html += "<input type='text' name='" + key + "' value='" + value + "'><br>";
                        } else {
                            html += "<input type='hidden' name='" + key + "' value='" + value + "'>";
                        }
                    }
                    html += "<input type='button' value='Update' onclick='updateData(this.form)'>";
                    html += "</fieldset></form>";
                });
            } else {
                html += "<p>No dogs found</p>";
            }
            resutlTable.innerHTML = html;
        })
    Promise.all([competitorsQuery, emergencyQuery, dogQuery]);
});

function updateData(form) {
    const tableName = form.getAttribute('name');
    const formData = new FormData(form);

    const primaryKeyValue = formData.get('id'); // Get the primary key value from the form

    let setClause = '';
    formData.forEach((value, key) => {
        if (key !== 'id') {
            setClause += `${key} = ${typeof value === 'string' ? `'${value}'` : value}, `;
        }
    });
    setClause = setClause.slice(0, -2); // Remove the trailing comma and space

    let query = `UPDATE ${tableName} SET ${setClause} WHERE id = '${primaryKeyValue}';`;
    sendQuery(query);

    console.log(query);
}