class ThemeManager {
    constructor() {
        this.themeCookieName = 'theme_preference';
        this.darkThemeClass = 'dark';
        this.initializeTheme();
        this.initializeEventListeners();
    }

    // Initialize theme based on cookie
    initializeTheme() {
        const savedTheme = this.getThemeCookie();
        if (savedTheme === 'dark') {
            document.body.classList.add(this.darkThemeClass);
        } else {
            document.body.classList.remove(this.darkThemeClass);
        }
    }

    // Initialize event listeners for theme toggle buttons
    initializeEventListeners() {
        document.querySelectorAll('.btn-dark').forEach(button => {
            button.addEventListener('click', () => {
                this.toggleTheme();
                // button.textContent = currentTheme === ThemeManager.THEMES.DARK ? 'Switch to Light Mode' : 'Switch to Dark Mode';
            });
        });
    }

    // Toggle theme and update cookie
    toggleTheme() {
        const isDark = document.body.classList.toggle(this.darkThemeClass);
        this.setThemeCookie(isDark ? 'dark' : 'light');
    }

    // Get theme from cookie
    getThemeCookie() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.themeCookieName) {
                return value;
            }
        }
        return 'light'; // Default theme
    }

    // Set theme cookie
    setThemeCookie(theme) {
        // Set cookie to expire in 1 year
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `${this.themeCookieName}=${theme};expires=${expiryDate.toUTCString()};path=/`;
    }
}

// Initialize theme manager when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    // document.getElementsByClassName('btn-dark').onclick(function(){
    //     // document.body.classList.toggle('dark');
    //     // document.getElementsByClassName('convert').textContent=currentTheme === themeManager.THEMES.DARK ? 'Switch to Light Mode' : 'Switch to Dark Mode';
       
    // });
   
}); 
