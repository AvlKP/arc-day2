document.querySelector(".dark-mode-button").addEventListener("click", darkMode)

function darkMode(event) {
    let rootClasses = document.documentElement.classList
    if (rootClasses.contains("dark-mode")) {
        rootClasses.remove("dark-mode")
    } else {
        rootClasses.add("dark-mode")
    }
}