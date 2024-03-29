const API_KEY="TkvMcIg34YOaMuvitXRbSlKDFu8";
const API_URL="https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form) {
    let optArr = [];

    for (let entry of form.entries()) {
        if (entry[0]==='options'){
            optArr.push(entry[1]);
        }
    }
    form.delete("options");
    form.append("options", optArr.join());

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));


    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form,
                        });

                        const data = await response.json();

                        if(response.ok) {
                            displayErrors(data);
                        } else {
                            displayExecption(data);
                            throw new Error(data.error);
                        }
}

function displayErrors(data) {
    let heading = `JSHints results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors found</div>`;

    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayExecption(data);
        throw new Error(data.error);
    }
}

function displayStatus (data) {
    let heading = "API key status";
    let msg = `<div>Your key is valid until</div>`;
    msg += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = msg;
    resultsModal.show()
}

async function displayExecption (data) {
    let heading = `JSHints exceptions`;


    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: ${data.error_no}</div>`;
    results += `<div>Error text: ${data.error}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}
