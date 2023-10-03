document.getElementById('hideMenu').addEventListener('click', function() {
    const wrapperDiv = document.getElementById('wrapperDiv');
    const resultsSection = document.getElementById('resultsSection');

    // Check if the wrapperDiv is currently visible
    if (wrapperDiv.style.display !== 'none') {
        // If visible, hide the wrapperDiv and expand the resultsSection
        wrapperDiv.style.display = 'none';
        resultsSection.style.width = '100%';
    } else {
        // If not visible, show the wrapperDiv and revert the resultsSection width
        wrapperDiv.style.display = 'flex';
        resultsSection.style.width = 'calc(100% - 33.33333%)'; // Adjust '--width-of-wrapperDiv' to the original width of the wrapperDiv
    }
});




