document.getElementById('scan-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;
    const ip = document.getElementById('ip').value;
    const fileInput = document.getElementById('file').files[0];
    
    let formData = new FormData();
    if (url) formData.append('url', url);
    if (ip) formData.append('ip', ip);
    if (fileInput) formData.append('file', fileInput);

    let result;
    try {
        result = await fetch('/scan', {
            method: 'POST',
            body: formData
        }).then(res => res.json());
    } catch (error) {
        result = { error: 'Error occurred during the scan' };
    }

    const resultsContainer = document.getElementById('results');

    // Display results with color-coded threat levels
    resultsContainer.innerHTML = getStyledResult(result);
});

function getStyledResult(result) {
    // Define colors for threat levels
    const successColor = '#39ff14';  // Green
    const warningColor = '#ffcc00';  // Yellow
    const dangerColor = '#ff0000';   // Red

    // Logic to determine threat level and color
    let color, message;
    if (result.error) {
        color = dangerColor;
        message = "Error: " + result.error;
    } else {
        // Example logic, adjust based on actual results
        const threatLevel = result.data.attributes.last_analysis_stats;
        if (threatLevel.malicious > 0) {
            color = dangerColor;
            message = "Threat Detected: Malicious!";
        } else if (threatLevel.suspicious > 0) {
            color = warningColor;
            message = "Caution: Suspicious content!";
        } else {
            color = successColor;
            message = "No Threats Found!";
        }
    }

    return `<div style="color: ${color};">${message}</div>`;
}
