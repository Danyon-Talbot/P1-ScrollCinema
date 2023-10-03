// Select the button and the section to hide
const hideMenuButton = document.getElementById('hideMenu');
const wrapperDiv = document.getElementById('wrapperDiv');

// Add an event listener to the button
hideMenuButton.addEventListener('click', function() {
    // Check if the section is already hidden
    if (wrapperDiv.style.transform === 'translateX(-100%)') {
        // If it's hidden, show it
        wrapperDiv.style.transform = 'translateX(0)';
    } else {
        // If it's visible, hide it
        wrapperDiv.style.transform = 'translateX(-100%)';
    }
});