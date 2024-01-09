let competitionID = "";

document.addEventListener('DOMContentLoaded', function () {

    competitionID = new URLSearchParams(window.location.search).get("compId");

    let table = document.getElementById('tableBody');
    html = "";

    // Get the competition details
    sendQuery("SELECT e.orderNumber, d.ratsid, d.name, c.firstname, c.lastname, e.game, e.level, e.trialnumber, COALESCE(r.time, '') AS time, COALESCE(r.result, '') AS result, COALESCE(r.title, '') AS title, COALESCE(r.judge, '') AS judge, COALESCE(r.dogdesc, '') AS dogdesc, COALESCE(r.handlerdesc, '') AS handlerdesc, COALESCE(r.comments, '') AS comments, COALESCE(r.id, '') AS r_id, e.id, day.trialdate FROM dogs d JOIN competitors c ON d.competitors_id = c.id JOIN entry e ON e.dogs_id = d.id JOIN day ON e.day_id = day.id JOIN competitions comp ON day.competitions_id = comp.id LEFT JOIN results r ON r.entry_id = e.id WHERE comp.id = " + competitionID + " ORDER BY e.day_id, e.orderNumber;")
        .then(function (jsonResponse) {
            if (!jsonResponse.result) {
                html += "<tr><td></td><td colspan='14'>No results found.</td></tr>";
            } else {
                let trialdate = dateEnglish(jsonResponse.result[0].trialdate);
                html += "<tr style='font-weight: bold;'><td colspan='14'>"+trialdate + "</td></tr>";
                jsonResponse.result.forEach(row => {
                    if (dateEnglish(row.trialdate) !== trialdate) {
                        trialdate = dateEnglish(row.trialdate);
                        html += "<tr style='font-weight: bold'><td colspan='14'>" + trialdate + "</td></tr>";
                    }
                    if (row.r_id !== "") {
                        html += `<tr class='row-click' onclick='editResult(${row.r_id})'>`;
                    } else {
                        html += `<tr class='row-click' onclick='addResult(${row.id})'>`;
                    }
                    for (let [key, value] of Object.entries(row)) {
                        if (key === "id" || key === "trialdate" || key === "r_id") {
                            continue;
                        }
                        if (key === "game") {
                            value = getGameName(value)
                        }
                        html += "<td>" + value + "</td>";
                    }
                    html += "</tr>";

                })
            }
            table.innerHTML = html;

        })
        .catch(function (error) {
            console.error(error);
        })
});

function addResult(id){
    let popUp = document.getElementById("addPopup");
    popUp.classList.add("show");
    popUp.classList.remove("hide");

    let form = document.getElementById("addForm");
    form.name = "add";

    form.querySelector("input[name='id']").value = "0";
    form.querySelector("input[name='entry_id']").value = id;
    form.querySelector("input[name='time']").value = "";
    form.querySelector("input[name='result']").value = "";
    form.querySelector("input[name='title']").value = "";
    form.querySelector("input[name='judge']").value = "";
    form.querySelector("input[name='dogdesc']").value = "";
    form.querySelector("input[name='handlerdesc']").value = "";
    form.querySelector("input[name='comments']").value = "";

}

function editResult(id){
    let popUp = document.getElementById("addPopup");
    popUp.classList.add("show");
    popUp.classList.remove("hide");

    let form = document.getElementById("addForm");
    form.name = "edit";

    sendQuery("SELECT * FROM results WHERE id = " + id)
        .then(function (jsonResponse) {
            if (jsonResponse.result) {
                form.querySelector("input[name='id']").value = jsonResponse.result[0].id;
                form.querySelector("input[name='entry_id']").value = jsonResponse.result[0].entry_id;
                form.querySelector("input[name='time']").value = jsonResponse.result[0].time;
                form.querySelector("input[name='result']").value = jsonResponse.result[0].result;
                form.querySelector("input[name='title']").value = jsonResponse.result[0].title;
                form.querySelector("input[name='judge']").value = jsonResponse.result[0].judge;
                form.querySelector("input[name='dogdesc']").value = jsonResponse.result[0].dogdesc;
                form.querySelector("input[name='handlerdesc']").value = jsonResponse.result[0].handlerdesc;
                form.querySelector("input[name='comments']").value = jsonResponse.result[0].comments;
            }
        })
    
}

function closePopup(popup){
    let form = document.getElementById(popup);
    form.classList.add("hide");
    form.classList.remove("show");
}

function submitForm(){

    const form = document.getElementById("addForm");
    const formName = form.getAttribute("name");
    const formInputs = form.elements;
    let query = "";

    if (formName === "edit"){
        query += "UPDATE results SET ";
        for (let i = 0; i < formInputs.length; i++) {
            if (formInputs[i].name === "id") {
                continue;
            }
            query += formInputs[i].name + " = '" + formInputs[i].value + "'";
            if (i < formInputs.length - 1) {
                query += ", ";
            }    
          }
        query += " WHERE id = " + formInputs[0].value + ";";
    } else {
        query += "INSERT INTO results (";
        for (let i = 0; i < formInputs.length; i++) {
            query += formInputs[i].name;
            if (i < formInputs.length - 1) {
                query += ", ";
            }
          }
        query += ") VALUES (";
        for (let i = 0; i < formInputs.length; i++) {
            query += "'" + formInputs[i].value + "'";
            if (i < formInputs.length - 1) {
                query += ", ";
            }
        }
        query += ");";
    }

    sendQuery(query)
    .then(function (jsonResponse) {
        location.reload();
    })
}

function start(){
    window.location.href = "../pages/scoresheet.html?compId=" + competitionID;
}