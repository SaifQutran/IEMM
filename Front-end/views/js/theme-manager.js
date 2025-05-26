class ThemeManager {
    constructor() {
        this.themeCookieName = 'theme_preference';
        this.darkThemeClass = 'dark';
        this.buttonText = {
            light: 'الوضع الليلي',
            dark: 'الوضع النهاري'
        };
        this.addTransitionStyles() ;
        this.initializeTheme();
        this.initializeEventListeners();
    }
    addTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            html,body {
                transition: background-color .8s ease-in-out , color 0.3s ease-in-out;
            }
            .btn-dark {
                transition: background-color .8s ease-in-out, color 0.3s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize theme based on cookie
    initializeTheme() {
        const savedTheme = this.getThemeCookie();
        if (savedTheme === 'dark') {
            document.body.classList.add(this.darkThemeClass);
        } else {
            document.body.classList.remove(this.darkThemeClass);
        }
        this.updateButtonText(document.getElementsByClassName('btn-dark')[0]);
    }

    // Initialize event listeners for theme toggle buttons
    initializeEventListeners() {
        document.querySelectorAll('.btn-dark').forEach(button => {
            button.addEventListener('click', () => {
                this.toggleTheme(button);
                
                // button.textContent = currentTheme === ThemeManager.THEMES.DARK ? 'Switch to Light Mode' : 'Switch to Dark Mode';
            });
        });
        // document.querySelectorAll('.btn-dark').forEach(button => {
        //     button.addEventListener('click', () => {
        //         this.toggleTheme(button);
        //     });
        // });
    }

    // Toggle theme and update cookie
    toggleTheme(button) {
        const isDark = document.body.classList.toggle(this.darkThemeClass);
        this.setThemeCookie(isDark ? 'dark' : 'light');
        this.updateButtonText(button);
    }
    updateButtonText(button) {
        const isDark = document.body.classList.contains(this.darkThemeClass);
        button.textContent = isDark ? this.buttonText.dark : this.buttonText.light;
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
   
}); 
