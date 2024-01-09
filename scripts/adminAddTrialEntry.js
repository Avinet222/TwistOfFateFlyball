let competitionID = "", dogID = "";

document.addEventListener('DOMContentLoaded', function () {

    competitionID = new URLSearchParams(window.location.search).get("compId");

});

function findDog() {

    const searchValue = document.getElementById('searchDog').value;
    let choices = document.getElementById('searchDogSelect');
    choices.innerHTML = "<option value='N/A'>Select owner</option>";

    let bFound = false, bComplete = false;

    sendQuery('SELECT dogs.id, dogs.name, dogs.ratsid, competitors.firstname, competitors.lastname FROM dogs LEFT JOIN competitors ON dogs.competitors_id = competitors.id')
        .then(function (jsonResponse) {
            jsonResponse.result.forEach(function (rowData) {

                if (rowData.name === searchValue || rowData.ratsid === searchValue) {
                    if (bFound) {
                        alert(`More than one dog with the name ${searchValue} found. Please try again.`)
                        choices.style.display = 'block';
                        choices.options[choices.options.length] = new Option(rowData.firstname + " " + rowData.lastname, rowData.id);
                        bComplete = false;
                    } else {
                        choices.options[choices.options.length] = new Option(rowData.firstname + " " + rowData.lastname, rowData.id);
                        bFound = true;
                        bComplete = true;
                        dogID = rowData.id;

                    }
                }
            })
            if (!bFound) {
                alert(`Dog ${searchValue} not found. Please try again.`)
            }

            if(bComplete) {
                completeForm();
            }
        })
}

function findDogMultiple() {

    let dogID = document.getElementById('searchDogSelect').value;

    sendQuery('SELECT dogs.id, competitors.firstname, competitors.lastname FROM dogs LEFT JOIN competitors ON dogs.competitors_id = competitors.id WHERE dogs.id = ' + dogID)
        .then(function (jsonResponse) {

            if(jsonResponse.result){
                dogID = jsonResponse.result[0].id;
                completeForm();
            } else {
                alert("Please select valid owner.")
            }
        })
}

function completeForm() {
    document.getElementById('form').style.display = 'block';
}

function submitForm(form) {
    const formData = new FormData(form);
    let query = "INSERT INTO entry ";

    formData.set("dogs_id", dogID);

    const promise = getDayID(competitionID, formData.get("trialnumber"));

    promise.then((dayID) => {
        formData.set("day_id", dayID);
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            formData.set(checkbox.name, checkbox.checked ? '1' : '0');
        });

    
        const columns = [];
        const values = [];
    
        formData.forEach((value, key) => {
            columns.push(key);
            values.push(typeof value === 'string' ? `'${value}'` : value);
        });
    
        query += `(${columns.join(", ")}) VALUES (${values.join(", ")});`;

        sendQuery(query)
            .then(function (jsonResponse) {
                if(jsonResponse.message === "Request successful"){
                    alert("Entry added successfully");
                    window.location.href = "../pages/admin_viewCompetition.html?id=" + competitionID;
                } else {
                    alert(jsonResponse.message);
                }
                
            })
    })
}