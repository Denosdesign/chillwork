const Logger = {
    debugMode: false,
    loadPreference() {
        const stored = localStorage.getItem('debugMode');
        this.debugMode = stored === 'true';
    },
    savePreference() {
        localStorage.setItem('debugMode', this.debugMode);
    },
    log(...args) { if (this.debugMode) console.log(...args); },
    warn(...args) { console.warn(...args); },
    error(...args) { console.error(...args); }
};

Logger.loadPreference();

