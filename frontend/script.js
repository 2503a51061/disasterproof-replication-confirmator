
let totalTests = 0;
let successCount = 0;
let failedCount = 0;

const API_URL = "https://rwfqb44j9e.execute-api.us-east-1.amazonaws.com/prod/backup";

async function testReplication() {
    const button = document.getElementById("testButton");
    const led = document.getElementById("led");
    const status = document.getElementById("status");
    const message = document.getElementById("message");

    button.disabled = true;
    button.textContent = "TESTING...";

    led.className = "led loading";
    status.textContent = "TESTING";
    message.textContent = "Connecting to AWS Lambda...";

    let success = false;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "START_BACKUP",
                project: "DisasterProof"
            })
        });

        const data = await response.json();

        let result = data;

        if (typeof data.body === "string") {
            result = JSON.parse(data.body);
        } else if (data.body && typeof data.body === "object") {
            result = data.body;
        }

        success = response.ok &&
            result.status === "SUCCESS";

        if (!success) {
            throw new Error(result.message || "Backup failed");
        }

        led.className = "led success";
        status.textContent = "SUCCESS";
        message.textContent = "Backup completed and verified successfully!";

    } catch (error) {
        led.className = "led failure";
        status.textContent = "FAILED";
        message.textContent = error.message;
    }

    totalTests++;

    if (success) {
        successCount++;
    } else {
        failedCount++;
    }

    document.getElementById("totalTests").textContent = totalTests;
    document.getElementById("successCount").textContent = successCount;
    document.getElementById("failedCount").textContent = failedCount;

    addHistory(success);

    button.disabled = false;
    button.textContent = "▶ TEST REPLICATION";
}

function addHistory(success) {
    const history = document.getElementById("history");

    if (totalTests === 1) {
        history.innerHTML = "";
    }

    const item = document.createElement("div");
    item.className = "history-item";

    const timeElement = document.createElement("span");
    timeElement.textContent = new Date().toLocaleString();

    const resultElement = document.createElement("strong");
    resultElement.textContent = success ? "SUCCESS" : "FAILED";
    resultElement.className = success
        ? "history-success"
        : "history-failure";

    item.appendChild(timeElement);
    item.appendChild(resultElement);

    history.prepend(item);
}
