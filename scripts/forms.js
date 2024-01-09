let competitorID = "", dogID = "", competitionID = "", levelBAR = "", levelBRH = "", levelTR = "", levelTL = "";

document.addEventListener('DOMContentLoaded', function () {
    bFoundOpenCompetition = false;
    sendQuery("SELECT id, openregistration FROM competitions")
        .then(function (jsonResponse) {
            jsonResponse.result.forEach(function (row) {
                if (bFoundOpenCompetition == false && row.openregistration == 1) {
                    document.getElementById('tab_formOverview').className = 'tab active';
                    document.getElementById('formOverview').className = 'form active';
                    competitionID = row.id;
                    bFoundOpenCompetition = true;
                }

            })
            if (bFoundOpenCompetition == false) {
                document.getElementById('message').style.display = 'block';
                document.getElementById('message').innerHTML = '<p>No registration open</p>';
            }

        })
        .catch(function (error) {
            console.error(error);
        })

    // Get all checkboxes with the class 'agreementCheck'
    const checkboxes = document.querySelectorAll('.agreementCheck');

    // Get the button element
    const button = document.getElementById('agreementButton'); // Use the actual ID of your button

    // Function to check if all checkboxes are checked
    function checkAllCheckboxes() {
        let allChecked = true;
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                allChecked = false;
            }
        });

        if (allChecked) {
            button.classList.add('active');
            button.classList.remove('disabled');
        } else {
            button.classList.remove('active');
            button.classList.add('disabled');
        }
    }

    // Add event listeners to checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkAllCheckboxes);
    });
})

function showForm(formId) {
    // Hide all forms and deactivate all tabs
    if (!document.getElementById('tab_' + formId).classList.contains('disabled')) {
        document.querySelector('.tab.active').classList.remove('active');

        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));

        // Show the selected form and activate the corresponding tab
        document.getElementById(formId).classList.add('active');
        document.querySelector(`.tab[data-form="${formId}"]`).classList.add('active');
    }
}

function nextForm(nextFormId) {
    document.getElementById('tab_' + nextFormId).classList.remove('disabled');
    showForm(nextFormId);
}

function findCompetitor() {

    const firstName = document.getElementById('searchFirstName').value;
    const lastName = document.getElementById('searchLastName').value;

    if (firstName === "" ) {
        document.getElementById('searchFirstName').classList.add('error');
        return;
    } else {
        document.getElementById('searchFirstName').classList.remove('error');
    }

    if (lastName === "") {
        document.getElementById('searchLastName').classList.add('error');
        return;
    } else {
        document.getElementById('searchLastName').classList.remove('error');
    }


    sendQuery("SELECT * FROM competitors WHERE firstname = '" + firstName + "' AND lastname = '" + lastName + "'")
        .then(function (jsonResponse) {
            if (jsonResponse.result) {
                competitorID = jsonResponse.result[0].id;
                document.getElementById('searchDog').innerHTML = "<option value='newDog'>Add Dog</option>";

                sendQuery("SELECT name, id FROM dogs WHERE competitors_id = '" + competitorID + "'")
                    .then(function (jsonResponse) {
                        if (jsonResponse.result) {
                            for (let i = 0; i < jsonResponse.result.length; i++) {
                                document.getElementById('searchDog').innerHTML += "<option value='" + jsonResponse.result[i].id + "'>" + jsonResponse.result[i].name + "</option>";
                            }
                        }
                    })
                resetDogForm();
                nextForm('formDog');
            } else {

                sendQuery("SELECT id FROM competitors ORDER BY id DESC LIMIT 1")
                    .then(function (jsonResponse) {
                        competitorID = (parseInt(jsonResponse.result[0].id) + 1).toString();
                        document.getElementById('entryCompetitor').style.display = 'block';
                        document.getElementById('competitorsFirstName').value = firstName;
                        document.getElementById('competitorsLastName').value = lastName;
                        document.getElementById('competitiorsID').value = competitorID;
                        document.getElementById('emergencyCompetitorsID').value = competitorID;
                        document.getElementById('dogsCompetitorsID').value = competitorID;

                    })

            }
            sendQuery("SELECT id FROM dogs ORDER BY id DESC LIMIT 1")
                .then(function (jsonResponse) {
                    dogID = (parseInt(jsonResponse.result[0].id) + 1).toString();
                    document.getElementById('dogsID').value = dogID;

                })
        })
        .catch(function (error) {
            console.error(error);
        });
}

function findDog(search) {
    const searchValue = search.value;
    const entryDogForm = document.getElementById('entryDog');
    entryDogForm.reset();
    if (searchValue !== "newDog") {
        document.getElementById('dogAddDataButton').style.display = 'none';
        document.getElementById('dogUpdateDataButton').style.display = 'block';
        sendQuery("SELECT * FROM dogs WHERE id = '" + searchValue + "'")
            .then(function (jsonResponse) {
                dogID = jsonResponse.result[0].id;
                levelBAR = jsonResponse.result[0].BAR_level;
                levelBRH = jsonResponse.result[0].BRH_level;
                levelTR = jsonResponse.result[0].TR_level;
                levelTL = jsonResponse.result[0].TL_level;
                setTrialForms();
                if (jsonResponse.result) {
                    for (const key in jsonResponse.result[0]) {
                        let inputField = entryDogForm.querySelectorAll(`[name="${key}"]`)[0];
                        inputField.value = jsonResponse.result[0][key];
                    }
                }
            })
            .catch(function (error) {
                console.error(error);
            })
    } else {
        resetDogForm();

        Promise.resolve(sendQuery("SELECT id FROM dogs ORDER BY id DESC LIMIT 1"))
            .then(function (jsonResponse) {
                dogID = (parseInt(jsonResponse.result[0].id) + 1).toString();
                document.getElementsByName("id")[1].value = dogID;
            })
    }
}

function addData(form) {

    let failed = false;

    const formElements = form.elements;

    Array.from(formElements).forEach(function (input) {
        if (input.required && input.value === "") {
            input.classList.add('error');
            failed = true;
        } else {
            input.classList.remove('error');
        }
    })

    if (!failed) {
        const tableName = form.getAttribute('name');
        const formData = new FormData(form);
    
        const buttonExists = form.querySelector('input[type="button"]');
    
        if (buttonExists && buttonExists.id.includes("dogAddDataButton")) {
            document.getElementById(buttonExists.id).value = "Added";
            document.getElementById(buttonExists.id).disabled = true;
        }
    
        // Save ratsID
        if (tableName === "dogs") {
            levelBAR = formData.get("BAR_level");
            levelBRH = formData.get("BRH_level");
            levelTR = formData.get("TR_level");
            levelTL = formData.get("TL_level");
            setTrialForms();
        } else if (tableName === "competitors") {
            document.getElementById("entryEmergency").style = "block";
        }
    
        const columns = Array.from(formData.keys()).join(', ');
        const values = Array.from(formData.values()).map(value => typeof value === 'string' ? `'${value}'` : value).join(', ');
    
        let query = `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
    
        sendQuery(query)
            .then(function (jsonResponse) {
                const nextFormId = getNextFormId(form.parentElement.getAttribute('id'));
                document.getElementsByName('competitors_id')[0].value = competitorID;
                if (tableName !== "entry" && tableName !== "competitors") {
                    nextForm(nextFormId);
                }
            })
            .catch(function (error) {
                console.error(error);
            })
    }
}

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

    sendQuery(query)
        .then(function (jsonResponse) {
            let nextFormId = getNextFormId(form.parentElement.parentElement.getAttribute('id'));
            if (nextFormId === null) {
                nextFormId = getNextFormId(form.parentElement.parentElement.parentElement.getAttribute('id'));
            }

            nextForm(nextFormId);
        })
}

function getNextFormId(currentFormId) {
    const tabs = document.querySelectorAll('.tab[data-form]');
    let found = false;
    let nextFormId = null;

    tabs.forEach(tab => {
        if (found) {
            nextFormId = tab.getAttribute('data-form');
            found = false; // Stop after finding the next form
        }

        if (tab.getAttribute('data-form') === currentFormId) {
            found = true;
        }
    });

    return nextFormId;
}

function resetDogForm() {
    document.getElementById('entryDog').reset();
    document.getElementById('searchDog').value = "newDog";
    document.getElementById('dogsCompetitorsID').value = competitorID;
    document.getElementsByName('id')[1].value = dogID;
    document.getElementById('dogAddDataButton').style.display = 'block';
    document.getElementById('dogUpdateDataButton').style.display = 'none';
}

function setTrialForms() {
    let count = 0;
    sendQuery("SELECT * FROM day WHERE competitions_id = '" + competitionID + "'")
        .then(function (jsonResponse) {
            let table = document.getElementById('trialTable');
            let html = "";
            let trial = 0;
            for (let i = 0; i < jsonResponse.result.length; i++) {
                html += `<h1>${dayEnglish(jsonResponse.result[i].trialdate)}</h1>
                <table><thead><tr><th>Game</th><th>Trial</th><th>Team</th><th>Price</th></tr></thead><tbody>`;
                const games = jsonResponse.result[i].games.split(';');
                const trialcount = jsonResponse.result[i].trialcount;
                for (let j = 0; j < trialcount; j++) {
                    trial++;
                    for (let k = 0; k < games.length; k++) {
                        if (games[k].includes("TR") && j != 0) {
                            continue;
                        }
                        let trType = "hidden";
                        if (games[k].includes("TR") && j == 0) {
                            trType = "text";
                        };
                        html += `<tr>
                        <td>${getGameName(games[k].split(',')[0])}</td>
                        <td>${trial}</td>
                        <td><input type='${trType}' id='team_${count}' value='' size='12' placeholder='11-111-AA'></td>
                        <td>${(games[k].split(',')[1])}$</td>`
                        let level = "";
                        switch (games[k].split(',')[0]) {
                            case "BAR":
                                level = levelBAR;
                                break;
                            case "BRH":
                                level = levelBRH;
                                break;
                            case "TR":
                                level = levelTR;
                                break;
                            case "TL":
                                level = levelTL;
                                break;
                            default:
                                break;
                        }
                        html += `<td><input id='dogAddDataButton_${count}' type='button' value='Register' onclick='register("row_${count}", "game_${games[k].split(',')[0]}", "trial_${trial}", "price_${games[k].split(',')[1]}", "id_${jsonResponse.result[i].id}", "level_${level}")'></td></tr>`; count++;
                    }
                }
                html += `</tbody></table><br/>&nbsp;<br/>`
            }
            table.innerHTML = html;
        })
        .catch(function (error) {
            console.error(error);
        })
}

function register(rowNum, game, trial, price, id, level) {
    rowNum = rowNum.split('_')[1];
    game = game.split('_')[1];
    trial = trial.split('_')[1];
    price = price.split('_')[1];
    id = id.split('_')[1];
    level = level.split('_')[1];
    const team = document.getElementById(`team_${rowNum}`).value;
    //const crating = document.getElementById(`crating_${rowNum}`).value;

    document.getElementById(`dogAddDataButton_${rowNum}`).value = "Added";
    document.getElementById(`dogAddDataButton_${rowNum}`).classList.add("disabled");
    document.getElementById(`dogAddDataButton_${rowNum}`).disabled = true;
    document.getElementById("nextButtonTrial").classList.add("enabled");
    document.getElementById("nextButtonTrial").classList.remove("disabled");

    sendQuery(`INSERT INTO entry 
    (id, day_id, dogs_id, orderNumber, dogs_ratsidteam, game, level, trialnumber, price, receivedpayment, deposited, agreement, waiver, signature) 
    VALUES 
    ('0', '${id}', '${dogID}', '0', '${team}', '${game}', '${level}', '${trial}', '${price}', '0', '0', '0', '0', '0')
    `);

    /*sendQuery(`INSERT INTO entry 
    (id, day_id, dogs_id, orderNumber, dogs_ratsidteam, game, level, trialnumber, price, crating, receivedpayment, deposited, agreement, waiver, signature) 
    VALUES 
    ('0', '${id}', '${dogID}', '0', '${team}', '${game}', '${level}', '${trial}', '${price}', '${crating}', '0', '0', '0', '0', '0')
    `);*/
}

function submit() {
    sendQuery(`UPDATE entry SET agreement = '1', waiver = '1', signature = '1' WHERE dogs_id = '${dogID}'`);
    nextForm('completed');
}



