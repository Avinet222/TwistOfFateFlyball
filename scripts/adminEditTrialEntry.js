let id = "", compID = "";

document.addEventListener("DOMContentLoaded", function () {

    //Get competitor ID from URL
    id = new URLSearchParams(window.location.search).get("id");
    compID = new URLSearchParams(window.location.search).get("compId");

    sendQuery("SELECT * FROM entry WHERE id = " + id)
        .then(function (jsonResponse) {
            let tableElements = document.querySelector('#entry').elements;

            for (const [key, value] of Object.entries(jsonResponse.result[0])) {
                if (tableElements[key].type === 'checkbox') {
                    tableElements[key].checked = value === '1';
                } else {
                    tableElements[key].value = value;
                }
            }
        })

});

function deleteEntry() {
    let confirm = window.confirm("Are you sure you want to delete this entry?");
    if (confirm) {
        window.location.href = "../pages/admin_viewCompetition.html?id=" + compID;
        sendQuery("DELETE FROM entry WHERE id = " + id);
    }
}

function editEntry(form){
    const tableName = form.getAttribute('name');
    const formData = new FormData(form);

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        formData.set(checkbox.name, checkbox.checked ? '1' : '0');
    });

    let setClause = '';
    formData.forEach((value, key) => {
        if (key !== "id") {
            setClause += `${key} = ${typeof value === 'string' ? `'${value}'` : value}, `;
        }
    });
    setClause = setClause.slice(0, -2); // Remove the trailing comma and space

    let query = `UPDATE entry SET ${setClause} WHERE id = '${id}';`;

    sendQuery(query)
        .then(function (jsonResponse) {
            if(jsonResponse.message === "Request successful"){
                alert("Entry updated successfully");
                window.location.href = "../pages/admin_viewCompetition.html?id=" + compID;
            } else {
                alert(jsonResponse.message);
            }
        })

}