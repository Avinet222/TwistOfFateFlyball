document.addEventListener("DOMContentLoaded", function () {
    sendQuery(`SELECT day.id, dogs.ratsid, dogs.name, competitors.lastname, day.trialdate, entry.orderNumber, entry.game, entry.trialnumber, entry.level FROM entry JOIN dogs ON entry.dogs_id = dogs.id JOIN competitors ON dogs.competitors_id = competitors.id JOIN day ON entry.day_id = day.id JOIN competitions ON day.competitions_id = competitions.id WHERE competitions.schedule = 1 ORDER BY entry.orderNumber ASC`)
        .then(function (jsonResponse) {
            let data = [];
            let order = ["BAR-novice", "BRH-novice", "BRH-advanced", "BAR-advanced", "TR", "BRH-master", "BAR-master", "BAR-champion", "BRH-champion"];
            let days = [];

            jsonResponse.result.forEach(row => {
                let level = "";

                if (row.level === "grand_champion"){
                    level = "-champion";
                } else if (row.game === "TR"){
                    level = "";
                } else {
                    level = "-"+row.level;
                }

                if (data[row.game + level + "-" + row.trialnumber] === undefined) {
                    data[row.game + level + "-" + row.trialnumber] = [];
                }
                data[row.game + level + "-" + row.trialnumber].push(row);

                if (days.indexOf(row.trialdate) === -1) {
                    days.push(row.trialdate);
                }
             
            });

            const table = document.getElementById("scheduleTable");
            let currentGame = [], nextGame = [];
            let trialCount = 1, rowCount = 0;
            let emptyRow = { ratsid: "", name: "", lastname: "" };
            let html = "";


            days.forEach(day => {
                html += "<table><thead><tr><th colspan='4'><h1>" + dateEnglish(day) + "</h1></th></tr></thead><tbody>";
                order.forEach(level => {

                    currentGame = data[level + "-" + trialCount];
                    nextGame = data[level + "-" + (trialCount + 1)];
        
                    if(currentGame === undefined && nextGame === undefined){
                        return;
                    }
    
                    if (currentGame === undefined) {
                        currentGame = {0: "-"};
                    }
    
                    if (nextGame === undefined) {
                        nextGame = [{0: "-"}];
                    }
    
                    if (currentGame !== undefined && currentGame.length >= nextGame.length) {
                        rowCount = currentGame.length;
                    } else {
                        rowCount = nextGame.length;
                    }
    
                    if (!(rowCount < 1)) {
                        let gameName = getGameName(level.split("-")[0]);
                        let gameLevel = level.split("-")[1];
                        if (gameLevel === undefined){
                            gameLevel = "";
                        }
                        html += "<tr><th colspan='2'><h2>" + gameName + " " + gameLevel + "</h2></th></tr>";
                        html += "<tr><th><h3>Run 1</h2></th><th><h3>Run 2</h2></th></tr>";
    
                        for (i = 0; i < rowCount; i++) {
                            if (currentGame[i] === undefined || currentGame[i] === "-") {
                                currentGame[i] = emptyRow;
                            }
                            if (nextGame[i] === undefined || nextGame[i] === "-") {
                                nextGame[i] = emptyRow;
                            }
                            html += `<tr><td>${currentGame[i].ratsid} ${currentGame[i].lastname} ${currentGame[i].name}</td><td>${nextGame[i].ratsid} ${nextGame[i].lastname} ${nextGame[i].name}</td></tr>`
                        }
                    }
                    
                })
                html += "</tbody></table><br><br>";
            })
            table.innerHTML = html;
        })
});