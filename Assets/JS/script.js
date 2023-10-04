document.getElementById('hideMenu').addEventListener('click', function() {
    const wrapperDiv = document.getElementById('wrapperDiv');
    const resultsSection = document.getElementById('resultsSection');

//   Checks if the wrapperDiv is visible  
if (getComputedStyle(wrapperDiv).display !== "none") {
    // Sets it to hidden on button click
    wrapperDiv.classList.add('hidden');
    // Removes the lg:w-2/3 limit to the width of the section
    resultsSection.classList.remove("lg:w-2/3");
    if (window.innerWidth <= 1024) {
        //Ensures that if the page is 1024px width or smaller, the section covers the full width
        resultsSection.classList.add("w-full");
    } else {
        // If the page is not 1024px or smaller, removes both limitations
        resultsSection.classList.remove("w-full", "lg:w-2/3");
    }
} else {
    // Resets pages layout classes
    wrapperDiv.classList.remove("hidden");
    resultsSection.classList.remove("w-full");
    resultsSection.classList.add("lg:w-2/3");

}
});



    // // Check if the wrapperDiv is currently visible
    // if (wrapperDiv.style.display !== 'none') {
    //     // If visible, hide the wrapperDiv and expand the resultsSection
    //      wrapperDiv.style.display = 'none';
    //     resultsSection.style.width = '100%';
    // } else {
    //     // If not visible, show the wrapperDiv and revert the resultsSection width
    //     wrapperDiv.style.display = 'flex';
    //     resultsSection.style.width = 'calc(100% - 33.33333%)'; // Adjust '--width-of-wrapperDiv' to the original width of the wrapperDiv
    // } 