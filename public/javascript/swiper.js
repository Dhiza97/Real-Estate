const swiper = new Swiper('.swiper', {
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
    loop: true,

    // If we need pagination
    pagination: {
    el: '.swiper-pagination',
    clickable: true,
    },

    // Navigation arrows
    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    },

});

// Select all elements with the class "number"
const numbers = document.querySelectorAll('.number');

// Loop through each number element
numbers.forEach((number, index) => {
    // Get the current number value
    let currentValue = parseInt(number.textContent);
    
    // Generate a random interval between 500ms and 2000ms
    const interval = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;

    // Set an interval to increment the number
    setInterval(() => {
        // Increment the number by a random value between 1 and 5
        const increment = Math.floor(Math.random() * 5) + 1;
        currentValue += increment;

        // Update the number text content
        number.textContent = currentValue;
    }, interval);
});

// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
} else {
    mybutton.style.display = "none";
}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
document.body.scrollTop = 0; // For Safari
document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}