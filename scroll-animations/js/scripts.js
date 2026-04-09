
//keep functions on top
const h2 = document.querySelectorAll('h2');
const hiddenElements = document.querySelectorAll('.hidden');
const observer = new IntersectionObserver((entry) => {
    // creates a forEach loop to loop through the entries
    entry.forEach((entry) => {

        if (entry.isIntersecting) {
            // using replace instead of add and remove to prevent class list from growing infinitely
            entry.target.classList.replace('hidden', 'show');
        } else {

            entry.target.classList.replace('show', 'hidden');
        }

    });
    // set threshold so that the animation will trigger when the element is at a certain percentage visible in the viewport
}, { threshold: 0.15 });

// observe all elements with the class "hidden" and "h2"
hiddenElements.forEach((el) => observer.observe(el));
h2.forEach((el) => observer.observe(el));