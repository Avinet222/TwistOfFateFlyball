let competitionID = "";

document.addEventListener('DOMContentLoaded', function () {

    competitionID = new URLSearchParams(window.location.search).get("id");

    // Get the competition details
    sendQuery("SELECT ratstrialid, location, registrationstart, registrationend FROM competitions WHERE id = '" + competitionID + "'")
        .then(function (jsonResponse) {

            let competitionDetails = document.getElementById('competitionDetails');
            let html = "";
            const response = jsonResponse.result[0];

            html += "<h1>Trial: " + response.ratstrialid + "</h1>";
            html += "<h2>Location: " + response.location + "</h2>";
            html += "<p>Registration: " + dateEnglish(response.registrationstart) + " - " + dateEnglish(response.registrationend) + "</p>";

            competitionDetails.innerHTML = html;

        })
        .catch(function (error) {
            console.error(error);
        })

    //Get all entries
    sendQuery(`SELECT DISTINCT e.id, o.firstname, o.lastname, d.name, d.BAR_level, e.level, e.game, e.trialnumber
                FROM dogs d
                JOIN entry e ON d.id = e.dogs_id
                JOIN day y ON e.day_id = y.id
                JOIN competitions c ON y.competitions_id = ${competitionID}
                JOIN competitors o ON d.competitors_id = o.id  
                ORDER BY e.trialnumber, o.firstname, o.lastname ASC;`)

        .then(function (jsonResponse) {

            let entries = document.getElementById('entries');
            let html = "", level = "", trial = 1;

            html += "<h1>Trial 1</h1><table><thead><tr><th>First Name</th><th>Last Name</th><th>Dog</th><th>Game</th><th>Level</th></tr></thead><tbody>";
            if (jsonResponse.result) {
                jsonResponse.result.forEach(row => {
                    if (row.trialnumber != trial) {
                        html += "</tbody></table>";
                        html += "<h1>Trial " + row.trialnumber + "</h1><table><thead><tr><th>First Name</th><th>Last Name</th><th>Dog</th><th>Game</th><th>Level</th></tr></thead><tbody>";
                    }
                    gameName = getGameName(row.game);
                    html += "<tr ' class='row-click' onclick='editEntry(" + row.id + ")'><td>" + row.firstname + "</td><td>" + row.lastname + "</td><td>" + row.name + "</td><td>" + gameName + "</td><td>" + row.level + "</td></tr>";
                    trial = row.trialnumber;
                })
            } else {
                html += "<p>No Entries</p>";
            }

            entries.innerHTML = html;

        })
        .catch(function (error) {
            console.error(error);
        })

    setRegistrationStatus();
});

function openRegistrations() {

    sendQuery(`SELECT ratstrialid FROM competitions WHERE openregistration = 1 AND id <> ${competitionID}`)
        .then(function (jsonResponse) {
            if (jsonResponse.result) {
                alert(`Trial ${jsonResponse.result[0].ratstrialid} is already open. Please close it first.`);

            } else {
                const currentStatus = document.getElementById('openRegistrations').className;
                let newStatus = "";

                if (currentStatus === "opened") {
                    newStatus = "0";
                } else {
                    newStatus = "1";
                }

                sendQuery(`UPDATE competitions SET openregistration = ${newStatus} WHERE id = ${competitionID}`)
                    .then(function (jsonResponse) {
                        setRegistrationStatus();
                    })
            }
        })
}

function editEntry(id) {
    window.location.href = "../pages/admin_editTrialEntry.html?id=" + id + "&compId=" + competitionID;
}

function setRegistrationStatus() {

    sendQuery(`SELECT openregistration FROM competitions WHERE id = ${competitionID}`)
        .then(function (jsonResponse) {

            if (jsonResponse.result[0].openregistration === "1") {
                document.getElementById('openRegistrations').className = "opened";
                document.getElementById('openRegistrations').innerText = "Close Entries";
            } else {
                document.getElementById('openRegistrations').className = "closed";
                document.getElementById('openRegistrations').innerText = "Open Entries";
            }
        })

}

function addEntry() {
    window.location.href = "../pages/admin_addTrialEntry.html?table=entry&compId=" + competitionID;
}

function createSchedule() {
    let table = [], final = [];
    let order = ["BAR-novice", "BRH-novice", "BRH-advanced", "BAR-advanced", "TR", "BRH-master", "BAR-master", "BAR-champion", "BRH-champion"];
    sendQuery(`SELECT entry.day_id, entry.id, entry.game, entry.level FROM entry JOIN day ON entry.day_id = day.id WHERE day.competitions_id = ${competitionID} ORDER BY entry.day_id, entry.trialnumber, entry.game, entry.level ASC;`)
        .then(function (jsonResponse) {

            const queryPromises = [];

            if (jsonResponse.result) {
                jsonResponse.result.forEach(row => {

                    let dogLevel = row.level;
                    if (dogLevel.includes("grand")) { dogLevel = dogLevel.split("_")[1]; }
                    if (!table[row.day_id]) { table[row.day_id] = []; }
                    if (!table[row.day_id][row.game + "-" + dogLevel]) { table[row.day_id][row.game + "-" + dogLevel] = []; }

                    table[row.day_id][row.game + "-" + dogLevel].push([row.day_id, row.game, dogLevel, row.id]);

                })
            }
            let orderNumber = 1;
            let dayID = 0, id = 0;
            table.forEach(day => {
                order.forEach(level => {
                    if (day[level]) {
                        day[level].forEach(entry => {
                            if (dayID != entry[0]) {
                                orderNumber = 1;
                            }
                            id = parseInt(entry[3]);
                            dayID = parseInt(entry[0]);
                            final.push([id, orderNumber]);
                            orderNumber++;
                        });
                    }
                });
            });

            final.forEach(([id, orderNumber]) => {
                const query = `UPDATE entry SET orderNumber = ${orderNumber} WHERE id = ${id};`;
                queryPromises.push(sendQuery(query));
            });

            return Promise.all(queryPromises);
        })
        .then(function () {
            sendQuery(`SELECT id, schedule FROM competitions`)
                .then(function (jsonResponse) {
                    jsonResponse.result.forEach(row => {
                        if (row.id == competitionID && row.schedule == 0) {
                            sendQuery(`UPDATE competitions SET schedule = '1' WHERE id = ${row.id}`);
                        } else if (row.id != competitionID && row.schedule == 1) {
                            sendQuery(`UPDATE competitions SET schedule = '0' WHERE id = ${row.id}`);
                        }
                    })
                })
                alert("Schedule created successfully");
        })
}

function enterResults() {
    window.location.href = "../pages/admin_resultEntry.html?compId=" + competitionID;
}