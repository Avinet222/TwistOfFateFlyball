function sendQuery(sqlQuery) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (xhr.getResponseHeader("Content-Type") === "application/json") {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        resolve(jsonResponse);
                    } else {
                        resolve({ message: "Request successful" });
                    }
                } else {
                    reject("Error: " + xhr.status);
                }
            }
        };
        xhr.open("POST", "../scripts/query.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.send("sqlQuery=" + encodeURIComponent(sqlQuery));
    });
}

function getGameName(game) {
    switch (game) {
        case "BAR":
            return "Barn Ratting";
        case "BRH":
            return "Brush Hunting";
        case "TR":
            return "Team Relay";
        case "TL":
            return "Trailing and Locating";
        default:
            return game;
    }
}

function dateEnglish(date) {
    date = new Date(date);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return month + " " + day + ", " + year;
}

function getDayID(compID, index) {
    let total = 0;
    return sendQuery(`SELECT id, trialcount FROM day WHERE competitions_id = ${compID}`)
        .then(function (jsonResponse) {
            if (jsonResponse.result) {
                let count = 0;
                let total = index;
                for (const row of jsonResponse.result) {
                    count = parseInt(row.trialcount);
                    total = total - count;
                    if (total <= 0) {
                        return row.id;
                    }
                }
            }
            // If no suitable ID found, return a default value or handle it accordingly
            return null;
        })
        .catch(error => {
            console.error(error); // Handle any errors from the query
            return null; // Return null in case of an error
        });
}


function dayEnglish(dateString) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const suffix = getNumberSuffix(dayOfMonth);

    return `${dayOfWeek} ${dayOfMonth}${suffix}`;
}

function getNumberSuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function phoneFormat(phone) {
    let count = phone.replace(/\D/g, '').length;
    let newPhone = phone;
    if (count === 1) {
        newphone = phone.replace(/\D/g, '');
        newPhone = newphone.replace(/(\d{1})/, '($1');
    } else if (count === 3) {
        newphone = phone.replace(/\D/g, '');
        newPhone = newphone.replace(/(\d{3})/, '($1) ');
    } else if (count === 6) {
        newphone = phone.replace(/\D/g, '');
        newPhone = newphone.replace(/(\d{3})(\d{3})/, '($1) $2-');
    } else if (count === 10) {
        newphone = phone.replace(/\D/g, '');
        newPhone = newphone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (count === 11){
        newphone = phone.replace(/\D/g, '');
        newPhone = newphone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    }

    return newPhone;
}

function postalCodeFormat(postalCode) {
    let count = postalCode.replace(/\S/, '').length;
    console.log(count);
    let newPostalCode = postalCode;
    if (count === 2){
        newPostalCode = postalCode.replace(/([\w.-]{3})/, '$1 ');
    }
    return newPostalCode.toUpperCase();
}
