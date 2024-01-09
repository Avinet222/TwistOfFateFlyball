let entryID = "", compID = "";

document.addEventListener("DOMContentLoaded", function () {

    //Get competitor ID from URL
    entryID = new URLSearchParams(window.location.search).get("id");
    compID = new URLSearchParams(window.location.search).get("compId");

});

function printTable() {
    let printContents = document.getElementById('scoresheet').outerHTML;
    let newWin = window.open('');
    newWin.document.write('<html><head><title>Print Table</title>');
    newWin.document.write('<link rel="stylesheet" href="../styles/reset.css" type="text/css" />');
    newWin.document.write('<link rel="stylesheet" href="../styles/style.css" type="text/css" />');
    newWin.document.write('<link rel="stylesheet" href="../styles/scoresheet.css" type="text/css" />');
    newWin.document.write('<style>@media print { .content { width: 100%; } }</style>');
    newWin.document.write('</head><body>');
    newWin.document.write(printContents);
    newWin.document.write('</body></html>');

    // Update input values in the print window
    let inputFields = document.querySelectorAll('#scoresheet input');
    inputFields.forEach((input) => {
        let id = input.getAttribute('id');
        let type = input.getAttribute('type');
        if (type === 'checkbox') {
            newWin.document.getElementById(id).checked = input.checked;
        } else {
            if (input.value) {
                newWin.document.getElementById(id).value = input.value;
            } else {
                newWin.document.getElementById(id).value = "";
            }
        }
    });

    newWin.document.close();
    newWin.print();
}
