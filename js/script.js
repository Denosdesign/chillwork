const App = (() => {
    const DEFAULT_IMAGE_URL = "https://images.pexels.com/photos/2064110/pexels-photo-2064110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    const MAX_HISTORY_SIZE = 10; // Max number of URLs to store per type
    const HKO_STATIONS = {
        "HKO": { nameTC: "香港天文台", nameEN: "Hong Kong Observatory" },
        "KP": { nameTC: "京士柏", nameEN: "King's Park" },
        "WCH": { nameTC: "黃竹坑", nameEN: "Wong Chuk Hang" },
        "TKL": { nameTC: "打鼓嶺", nameEN: "Ta Kwu Ling" },
        "LFS": { nameTC: "流浮山", nameEN: "Lau Fau Shan" },
        "TPO": { nameTC: "大埔", nameEN: "Tai Po" },
        "SHA": { nameTC: "沙田", nameEN: "Sha Tin" },
        "TM": { nameTC: "屯門", nameEN: "Tuen Mun" },
        "TKO": { nameTC: "將軍澳", nameEN: "Tseung Kwan O" },
        "SK": { nameTC: "西貢", nameEN: "Sai Kung" },
        "CCH": { nameTC: "長洲", nameEN: "Cheung Chau" },
        "CLK": { nameTC: "赤鱲角", nameEN: "Chek Lap Kok" },
        "TY": { nameTC: "青衣", nameEN: "Tsing Yi" },
        "SGP": { nameTC: "石崗", nameEN: "Shek Kong" },
        "TW": { nameTC: "荃灣可觀", nameEN: "Tsuen Wan Ho Koon" }, 
        "TWN": { nameTC: "荃灣城門谷", nameEN: "Tsuen Wan Shing Mun Valley" },
        "KC": { nameTC: "九龍城", nameEN: "Kowloon City" },
        "HVY": { nameTC: "跑馬地", nameEN: "Happy Valley" },
        "WTS": { nameTC: "黃大仙", nameEN: "Wong Tai Sin" },
        "SSP": { nameTC: "深水埗", nameEN: "Sham Shui Po" },
        "KTG": { nameTC: "觀塘", nameEN: "Kwun Tong" }, 
        "YLP": { nameTC: "元朗公園", nameEN: "Yuen Long Park" },
        "TMS": { nameTC: "大美督", nameEN: "Tai Mei Tuk" },
        "TC": { nameTC: "山頂", nameEN: "The Peak" }, 
        "HKP": { nameTC: "香港公園", nameEN: "Hong Kong Park" },
        "SKW": { nameTC: "筲箕灣", nameEN: "Shau Kei Wan" },
        "KSC": { nameTC: "滘西洲", nameEN: "Kau Sai Chau" },
        "NGP": { nameTC: "昂坪", nameEN: "Ngong Ping" },
        "CPH": { nameTC: "竹篙灣", nameEN: "Penny's Bay" },
        "PEN": { nameTC: "坪洲", nameEN: "Peng Chau" },
        "SSH": { nameTC: "上水", nameEN: "Sheung Shui" },
        "LMC": { nameTC: "濕地公園", nameEN: "Wetland Park" }, 
        "TIN": { nameTC: "天水圍", nameEN: "Tin Shui Wai" },
        "PLC": { nameTC: "橫瀾島", nameEN: "Waglan Island" } 
    };
    const getStationByCode = (code) => HKO_STATIONS[code];
    const getStationCodeByName = (name) => {
         if (!name) return null; // Handle null or empty names
         const lowerCaseName = name.toLowerCase(); // Convert search name to lower case once
         for (const code in HKO_STATIONS) {
             const station = HKO_STATIONS[code];
             // Compare TC name directly, compare EN name case-insensitively
             if (station.nameTC === name || (station.nameEN && station.nameEN.toLowerCase() === lowerCaseName)) {
                 return code;
             }
         }
         return null; // Not found
    };
    const WEATHER_ICONS = {
        50: '☀️', 51: '🌤️', 52: '⛅', 53: '🌦️', 54: '🌦️', 60: '☁️',
        61: '🌫️', 62: '☔', 63: '🌧️', 64: '🌧️🌧️', 65: '⛈️🌩',
    };

    const languageData = {
        page_title: { 'zh-TW': 'Chill Work', 'en': 'Chill Work' },
        // Widgets
        widget_meme_title: { 'zh-TW': '🐱 Meow?', 'en': '🐱 Meow?' },
        widget_todo_title: { 'zh-TW': '✅ 待辦事項', 'en': '✅ To-Do List' },
        widget_close_aria: { 'zh-TW': '關閉小工具', 'en': 'Close Widget' },
        widget_meme_loading_alt: { 'zh-TW': 'Meow...Meow...', 'en': 'Meow...Meow...' },
        widget_meme_new_button: { 'zh-TW': 'Meow!', 'en': 'Meow!' },
        widget_todo_placeholder: { 'zh-TW': '新增待辦事項...', 'en': 'Add a new task...' },
        widget_todo_add_aria: { 'zh-TW': '新增任務', 'en': 'Add Task' },
        // Settings Modal
        settings_modal_title: { 'zh-TW': '設定與幫助', 'en': 'Settings & Help' },
        settings_section_background: { 'zh-TW': '背景設定', 'en': 'Background Settings' },
        settings_label_youtube: { 'zh-TW': 'YouTube 影片:', 'en': 'YouTube Video:' },
        settings_placeholder_youtube: { 'zh-TW': '輸入 YouTube URL (會保存上限 10 條歷史記錄)', 'en': 'Enter YouTube URL (saves last 10)' },
        settings_button_set: { 'zh-TW': '設定', 'en': 'Set' },
        settings_label_youtube_resume: { 'zh-TW': '從上次關閉時繼續播放', 'en': 'Resume from last position' },
        settings_label_image: { 'zh-TW': '圖片背景:', 'en': 'Image Background:' },
        settings_placeholder_image: { 'zh-TW': '輸入圖片 URL (會保存上限 10 條歷史記錄)', 'en': 'Enter Image URL (saves last 10)' },
        settings_label_video: { 'zh-TW': '影片背景:', 'en': 'Video Background:' },
        settings_placeholder_video: { 'zh-TW': '輸入影片 URL (會保存上限 10 條歷史記錄)', 'en': 'Enter Video URL (saves last 10)' },
        settings_button_clear: { 'zh-TW': '清除背景 (或拖放檔案)', 'en': 'Clear Background (or drop file)' },
        settings_section_weather: { 'zh-TW': '天氣設定', 'en': 'Weather Settings' },
        settings_label_location: { 'zh-TW': '地區:', 'en': 'Location:' },
        location_select_placeholder: { 'zh-TW': '請選擇地區...', 'en': 'Please select location...' }, // Added missing key
        settings_label_weather_enable: { 'zh-TW': '顯示天氣資訊', 'en': 'Show Weather Info' },
        settings_label_warning_enable: { 'zh-TW': '顯示天氣警告 (若有)', 'en': 'Show Weather Warnings (if any)' },
        settings_button_update_weather: { 'zh-TW': '手動更新天氣', 'en': 'Update Weather Manually' },
        settings_section_other: { 'zh-TW': '其他功能', 'en': 'Other Functions' },
        settings_label_language: { 'zh-TW': '語言:', 'en': 'Language:' },
        settings_button_fullscreen: { 'zh-TW': '切換全螢幕', 'en': 'Toggle Fullscreen' },
        settings_button_todo: { 'zh-TW': '待辦事項', 'en': 'To-Do List' },
        settings_button_add_memo: { 'zh-TW': '新增 Memo', 'en': 'Add Memo' },
        settings_section_shortcuts: { 'zh-TW': '鍵盤快捷鍵', 'en': 'Keyboard Shortcuts' },
        // Shortcuts
        shortcut_toggle_modal: { 'zh-TW': '顯示/隱藏此視窗', 'en': 'Show/Hide this window' },
        shortcut_toggle_fullscreen: { 'zh-TW': '切換全螢幕', 'en': 'Toggle fullscreen mode' },
        shortcut_update_weather: { 'zh-TW': '更新天氣資訊', 'en': 'Update weather info' },
        shortcut_toggle_todo: { 'zh-TW': '顯示/隱藏待辦事項', 'en': 'Show/Hide To-Do List' },
        shortcut_add_memo: { 'zh-TW': '新增 Memo', 'en': 'Add Memo' },
        shortcut_close_modal: { 'zh-TW': '關閉此視窗', 'en': 'Close this window' },
        // Clock & Date (Weekdays)
        weekday_0: { 'zh-TW': '星期日', 'en': 'Sunday' },
        weekday_1: { 'zh-TW': '星期一', 'en': 'Monday' },
        weekday_2: { 'zh-TW': '星期二', 'en': 'Tuesday' },
        weekday_3: { 'zh-TW': '星期三', 'en': 'Wednesday' },
        weekday_4: { 'zh-TW': '星期四', 'en': 'Thursday' },
        weekday_5: { 'zh-TW': '星期五', 'en': 'Friday' },
        weekday_6: { 'zh-TW': '星期六', 'en': 'Saturday' },
        // Weather Status
        weather_err_format: { 'zh-TW': '天氣數據格式錯誤', 'en': 'Weather data format error' },
        weather_err_unavailable: { 'zh-TW': '天氣數據不可用', 'en': 'Weather data unavailable' },
        weather_updating: { 'zh-TW': '正在更新天氣資訊', 'en': 'Updating weather info...' },
        weather_disabled: { 'zh-TW': '天氣資訊已停用', 'en': 'Weather info disabled' },
        // Notifications (Examples - more needed)
        notify_set_youtube: { 'zh-TW': 'YouTube 背景已設定', 'en': 'YouTube background set' },
        notify_set_image: { 'zh-TW': '圖片背景已設定', 'en': 'Image background set' },
        notify_set_video: { 'zh-TW': '影片背景已設定', 'en': 'Video background set' },
        notify_clear_background: { 'zh-TW': '背景已清除', 'en': 'Background cleared' },
        notify_fullscreen_enter: { 'zh-TW': '進入全螢幕', 'en': 'Entered fullscreen mode' },
        notify_fullscreen_exit: { 'zh-TW': '退出全螢幕', 'en': 'Exited fullscreen mode' },
        notify_add_memo: { 'zh-TW': '新增 Memo', 'en': 'Memo added' },
        // Context Menu
        context_add_memo: { 'zh-TW': '新增 Memo', 'en': 'Add Memo' },
        context_toggle_todo: { 'zh-TW': '顯示/隱藏待辦事項', 'en': 'Show/Hide To-Do' },
        context_fullscreen: { 'zh-TW': '切換全螢幕', 'en': 'Toggle Fullscreen' },
        context_update_weather: { 'zh-TW': '更新天氣資訊', 'en': 'Update Weather' },
        context_settings: { 'zh-TW': '設定與幫助', 'en': 'Settings & Help' },
        // History List
        history_empty: { 'zh-TW': '(無歷史記錄)', 'en': '(No history)' },
        // Choices.js specific keys for location select
        itemSelectText: { 'zh-TW': '選擇', 'en': 'Select' }, 
        searchPlaceholder: { 'zh-TW': '搜尋地區...', 'en': 'Search location...' },
        noResultsText: { 'zh-TW': '找不到結果', 'en': 'No results found' },
        noChoicesText: { 'zh-TW': '沒有選項可選', 'en': 'No choices to choose from' },
        selectLocationPlaceholder: { 'zh-TW': '請選擇一個天文台地區...', 'en': 'Select an Observatory station...' },
        // Notifications (add missing ones)
        notify_location_set: { 'zh-TW': '已設置天氣地區為', 'en': 'Weather location set to' },
        notify_invalid_youtube: { 'zh-TW': '無效的 YouTube URL 或 ID', 'en': 'Invalid YouTube URL or ID' },
        notify_enter_image_url: { 'zh-TW': '請輸入圖片 URL', 'en': 'Please enter an image URL' },
        notify_enter_video_url: { 'zh-TW': '請輸入影片 URL', 'en': 'Please enter a video URL' },
        notify_geolocation_error: { 'zh-TW': '無法獲取位置，請在設定中手動選擇地區', 'en': 'Cannot get location, please select manually in settings' },

        // Font Settings (New)
        settings_section_font: { 'zh-TW': '字體設定', 'en': 'Font Settings' },
        settings_label_font: { 'zh-TW': '應用程式字體:', 'en': 'Application Font:' },

        notify_humidity_fallback: { 'zh-TW': '所選氣象站的濕度數據缺失，現改用香港天文台氣象站資料。', 'en': 'Selected station has no humidity data, using Hong Kong Observatory data instead.' },
        // Focus Timer Related
        focus_timer_start_title: { 'zh-TW': '開始專注計時', 'en': 'Start Focus Timer' },
        focus_timer_cancel_title: { 'zh-TW': '取消專注計時', 'en': 'Cancel Focus Timer' },
        focus_timer_cancel_button: { 'zh-TW': '⏹️ 取消', 'en': '⏹️ Cancel' },
        focus_complete_title: { 'zh-TW': '專注完成！', 'en': 'Focus Complete!' },
        focus_complete_message: { 'zh-TW': '做得好！休息一下吧！', 'en': 'Good job! Take a break!' },
        focus_complete_restart: { 'zh-TW': '重新開始', 'en': 'Restart' },
        focus_complete_close: { 'zh-TW': '關閉', 'en': 'Close' },
        notify_duration_saved: { 'zh-TW': '專注時間已儲存', 'en': 'Focus duration saved' },
        notify_invalid_duration: { 'zh-TW': '請輸入有效的專注時間 (1-120 分鐘)', 'en': 'Please enter a valid duration (1-120 minutes)' },
        focus_prompt_message: { 'zh-TW': '請輸入專注時間 (分鐘):' , 'en': 'Enter focus duration (minutes):' },
        notify_invalid_duration_prompt: { 'zh-TW': '輸入無效，請輸入 1-120 之間的數字。' , 'en': 'Invalid input. Please enter a number between 1 and 120.' },
        // New Duration Modal Keys
        focus_duration_title: { 'zh-TW': '設定專注時間', 'en': 'Set Focus Duration' },
        focus_duration_prompt: { 'zh-TW': '請輸入您想要專注的時間（HH:MM:SS）：', 'en': 'Enter the duration you want to focus for (HH:MM:SS):' },
        focus_duration_start_button: { 'zh-TW': '開始計時', 'en': 'Start Timer' },
        focus_duration_cancel_button: { 'zh-TW': '取消', 'en': 'Cancel' },
        minutes_unit: { 'zh-TW': '分鐘', 'en': 'minutes' }, // Added for notification
        notify_invalid_hms_input: { 'zh-TW': '輸入無效，請檢查時、分、秒格式 (總時間需大於 0)。', 'en': 'Invalid input. Check hours, minutes, seconds format (total duration must be greater than 0).' },
        // notify_duration_too_long: { 'zh-TW': '超過三小時？試試分段專注吧！', 'en': 'Over 3 hours? Try shorter focus sessions!' }, // REMOVED KEY
    };

    const DOMElements = {
        htmlElement: document.documentElement, // Get <html> element
        backgroundContainer: document.getElementById('background-container'),
        clock: document.getElementById('clock'),
        date: document.getElementById('date'),
        weather: document.getElementById('weather'),
        weatherContainer: document.getElementById('weather-container'),
        weatherWarningContainer: document.getElementById('weather-warning-container'), // Ensure this line exists
        settingsModal: document.getElementById('settings-modal'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        modalContent: document.querySelector('#settings-modal .modal-content'),
        modalButtons: document.querySelectorAll('#settings-modal .modal-btn'),
        tempMessageContainer: document.getElementById('temp-message-container'),
        locationSelect: document.getElementById('location-select'),
        weatherEnabledCheckbox: document.getElementById('weather-enabled-checkbox'),
        warningEnabledCheckbox: document.getElementById('warning-enabled-checkbox'),
        youtubeResumeCheckbox: document.getElementById('youtube-resume-checkbox'),
        memeWidget: document.getElementById('meme-widget'),
        memeImage: document.getElementById('meme-image'),
        memeTitle: document.getElementById('meme-title'),
        newMemeBtn: document.getElementById('new-meme-btn'),
        todoWidget: document.getElementById('todo-widget'),
        todoInput: document.getElementById('todo-input'),
        addTodoBtn: document.getElementById('add-todo-btn'),
        todoList: document.getElementById('todo-list'),
        widgetCloseBtns: document.querySelectorAll('.widget-close-btn'),
        memoContainer: document.getElementById('memo-container'),
        historyButtons: document.querySelectorAll('.history-btn'), // Add history buttons
        languageSelect: document.getElementById('language-select'),
        fontSelect: document.getElementById('font-select'), // Add font select element
        focusCompleteModal: document.getElementById('focus-complete-modal'),
        closeCompleteModalBtn: document.getElementById('close-complete-modal-btn'),
        completeModalContent: document.querySelector('#focus-complete-modal .modal-content'), // For shake effect
        completeModalButtons: document.querySelectorAll('#focus-complete-modal .modal-btn'),
        // New Duration Modal Elements
        focusDurationModal: document.getElementById('focus-duration-modal'),
        durationInputHours: document.getElementById('duration-input-hours'), // ADDED H
        durationInputMinutes: document.getElementById('duration-input-minutes'), // ADDED M
        durationInputSeconds: document.getElementById('duration-input-seconds'), // ADDED S
        startTimerModalBtn: document.getElementById('start-timer-modal-btn'),
        closeDurationModalBtn: document.getElementById('close-duration-modal-btn'),
        // End New Duration Modal Elements
        contentWrapper: document.querySelector('.content-wrapper'), // Need reference to hide/show
        clockContainer: document.getElementById('clock-container'), // Specific reference to clock container
    };

    let state = {
        mediaSource: null,
        mediaType: null,
        weatherUpdateInterval: null,
        clockUpdateInterval: null,
        locationChoiceInstance: null,
        languageChoiceInstance: null, // Added instance for language select
        weatherEnabled: true,
        weatherWarningEnabled: true,
        widgetPositions: {},
        memos: [],
        activeDraggable: {
            element: null,
            offsetX: 0,
            offsetY: 0,
            isDragging: false,
            type: null
        },
        activeResizable: {
            element: null,
            startX: 0,
            startY: 0,
            startWidth: 0,
            startHeight: 0,
            isResizing: false,
            type: null
        },
        youtubePlayer: null, // Instance of the YouTube player
        pendingYouTubeVideoId: null, // ID to load when API is ready
        initialYouTubeStartTime: 0, // Start time for the initial load
        youtubeResumeEnabled: true, // Default to true
        youtubeHistory: [],
        imageHistory: [],
        videoHistory: [],
        activeHistoryList: null, // Keep track of the currently open list
        historyHideTimeout: null, // Timeout ID for hiding list on blur
        currentLanguage: 'zh-TW', // Default language
        currentFontSet: 'default', // Default font set key
        humidityNotifiedOnce: false, // 只顯示一次 HKO 濕度通知
        isFocusTimerActive: false,
        focusTimerInterval: null,
        focusTimerEndTime: null,
        focusTimerDuration: 25 * 60, // Default 25 minutes in second
    };

    const Language = {
        DEFAULT_LANG: 'en', // Changed from 'zh-TW'
        SUPPORTED_LANGS: ['zh-TW', 'en'],

        loadPreference: () => {
            let savedLang = localStorage.getItem('focusTimerLanguage');
            if (savedLang && Language.SUPPORTED_LANGS.includes(savedLang)) {
                state.currentLanguage = savedLang;
            } else {
                const browserLang = navigator.language || navigator.userLanguage;
                // Default to 'en' if browserLang is not 'zh-TW' or related
                if (browserLang.toLowerCase().startsWith('zh')) {
                    state.currentLanguage = 'zh-TW';
                } else {
                     state.currentLanguage = 'en'; // Changed default fallback
                }
            }
        },

        savePreference: () => {
            localStorage.setItem('focusTimerLanguage', state.currentLanguage);
        },

        getText: (key) => {
            const translations = languageData[key];
            if (translations) {
                return translations[state.currentLanguage] || translations[Language.DEFAULT_LANG] || key; 
            } else {
                console.warn(`[Language] Translation key not found: ${key}`);
                return key; 
            }
        },

        translateElement: (element) => {
            const key = element.dataset.langKey;
            const attr = element.dataset.langAttr || 'textContent';
            const targetElement = element.dataset.langKeyTarget ? document.querySelector(element.dataset.langKeyTarget) : element;

            if (key && targetElement) {
                const translatedText = Language.getText(key);
                if (attr === 'textContent') {
                    targetElement.textContent = translatedText;
                } else {
                    targetElement.setAttribute(attr, translatedText);
                }
            } else if (key && !targetElement) {
                 console.warn(`[Language] Target element not found for key: ${key}, target selector: ${element.dataset.langKeyTarget}`);
            }
        },

        translateUI: () => {
            document.querySelectorAll('[data-lang-key]').forEach(Language.translateElement);

             if (DOMElements.languageSelect) {
                  DOMElements.languageSelect.value = state.currentLanguage;
                  // If Choices.js is active on languageSelect, update it too (might need try/catch)
                  if (state.languageChoiceInstance) { // Assuming we store instance
                       try {
                           // state.languageChoiceInstance.destroy(); 
                           // state.languageChoiceInstance = new Choices(...) // Re-create needed
                       } catch(e) { console.error("Error re-initializing language Choices:", e); }
                  } else {
                  }
             }

            Weather.initializeLocationSelect().catch(err => { // Call async function // Restore this call
                 console.error("[Language] Error re-initializing location select:", err);
            }); 
            
            Clock.update(); 
            if (state.weatherEnabled) { 
                 Weather.fetch(); 
            }
            ContextMenu.createMenu(true); // Force recreation of context menu
             
        },

        handleLanguageChange: (event) => {
            const newLang = event.target.value;
            if (newLang && Language.SUPPORTED_LANGS.includes(newLang) && newLang !== state.currentLanguage) {
                console.log(`[Language.handleLanguageChange] Language changed to: ${newLang}`);
                state.currentLanguage = newLang;
                Language.savePreference();
                Language.translateUI(); // Trigger UI update
            } else if (newLang === state.currentLanguage) {
                 console.log(`[Language.handleLanguageChange] Selected language (${newLang}) is already active.`);
            } else {
                console.warn(`[Language.handleLanguageChange] Invalid or unsupported language selected: ${newLang}`);
            }
        }
    };

    const Utils = {
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        calculateDistance: (lat1, lon1, lat2, lon2) => {
            const R = 6371; // km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        },
         extractYoutubeId: (input) => {
             if (!input) return null;
             const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
             const match = input.match(youtubeRegex);
             if (match && match[1]) {
                 return match[1];
             }
             if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
                 return input;
             }
             return null;
         }
    };

    const Notify = {
        show: (message, type = 'info', duration = 3000) => {
            if (!DOMElements.tempMessageContainer) return;
            const messageElement = document.createElement('div');
            messageElement.className = `temp-message ${type}`;
            messageElement.textContent = message;
            DOMElements.tempMessageContainer.appendChild(messageElement);
            requestAnimationFrame(() => {
                messageElement.classList.add('visible');
            });
            setTimeout(() => {
                messageElement.classList.remove('visible');
                messageElement.addEventListener('transitionend', () => messageElement.remove(), { once: true });
            }, duration);
        }
    };

    const Clock = {
        update: () => {
            if (!DOMElements.clock || !DOMElements.date) return;
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const weekdayKey = `weekday_${now.getDay()}`;
            const weekday = Language.getText(weekdayKey); 
            const timeString = `<span class="hour">${hours}</span><span class="separator">:</span><span class="minute">${minutes}</span>`;
            
            // Potentially adjust date format based on language?
            let dateString = '';
            if (state.currentLanguage === 'en') {
                 dateString = `${weekday}, ${day}/${month}/${year}`;
            } else { // Default to zh-TW format
                 dateString = `${year}年${month}月${day}日 ${weekday}`;
            }

            if (DOMElements.clock.innerHTML !== timeString) {
                 DOMElements.clock.innerHTML = timeString;
            }
             if (DOMElements.date.textContent !== dateString) {
                 DOMElements.date.textContent = dateString;
            }
        },
        start: () => {
            Clock.update();
            if(state.clockUpdateInterval) clearInterval(state.clockUpdateInterval);
            state.clockUpdateInterval = setInterval(Clock.update, 1000);
        }
    };

     const Weather = {
        getIcon: (iconCode) => WEATHER_ICONS[iconCode] || '🌡️',
        // Now gets/saves only the station code
        getStationCode: async () => {
            let savedCode = localStorage.getItem('userWeatherStationCode');
            if (savedCode && HKO_STATIONS[savedCode]) { // Check if saved code is valid
                console.log(`[Weather.getStationCode] Found saved code: ${savedCode}`);
                return savedCode;
            }
            console.log("[Weather.getStationCode] No valid saved code found, attempting auto-detection.");
            localStorage.removeItem('userWeatherStationCode'); // Remove invalid code if any

            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: false, timeout: 8000, maximumAge: 600000
                    });
                });
                const { latitude: userLat, longitude: userLng } = position.coords;
                console.warn("[Weather.getStationCode] Auto-detection needs station coordinates - fetching RSTM list.");
                const response = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/opendata.php?dataType=RSTM&lang=tc'); // Fetch station list with coords
                if (!response.ok) throw new Error(`Station list fetch failed: ${response.status}`);
                const stationListData = await response.json();

                let nearestCode = null;
                let minDistance = Infinity;

                 if (stationListData && stationListData.stations) {
                      stationListData.stations.forEach(stationFromApi => {
                         if (stationFromApi.latitude && stationFromApi.longitude) {
                             const distance = Utils.calculateDistance(
                                 userLat, userLng,
                                 parseFloat(stationFromApi.latitude), parseFloat(stationFromApi.longitude)
                             );
                              if (distance < minDistance) {
                                 // Find the corresponding code in our HKO_STATIONS using the name
                                 const code = getStationCodeByName(stationFromApi.nameTC); 
                                 if (code) {
                                     minDistance = distance;
                                     nearestCode = code;
                                     console.log(`[Weather.getStationCode] New nearest: ${stationFromApi.nameTC} (${code}), Dist: ${distance.toFixed(2)}km`);
                                 } else {
                                     console.warn(`[Weather.getStationCode] Could not find code for station from RSTM API: ${stationFromApi.nameTC}`);
                                 }
                             }
                         }
                     });
                 }

                if (nearestCode) {
                    console.log(`[Weather.getStationCode] Auto-detected nearest station code: ${nearestCode}`);
                    localStorage.setItem('userWeatherStationCode', nearestCode);
                    return nearestCode;
                } else {
                     console.warn("[Weather.getStationCode] Could not auto-detect nearest station. Falling back to HKO.");
                     localStorage.setItem('userWeatherStationCode', 'HKO'); // Fallback to HKO
                     return 'HKO';
                }

            } catch (error) {
                console.error('[Weather.getStationCode] Error during auto-detection:', error);
                if (error.code === 1 || error.code === 2) { // Geolocation permission denied or unavailable
                     Notify.show(Language.getText('notify_geolocation_error') || '無法獲取位置，請在設定中手動選擇地區', 'warning', 5000);
                }
                 // Fallback to HKO if auto-detection fails
                 const fallbackCode = 'HKO';
                 console.log(`[Weather.getStationCode] Falling back to default code: ${fallbackCode}`);
                 localStorage.setItem('userWeatherStationCode', fallbackCode);
                return fallbackCode; 
            }
        },
        fetch: async (isInitialFetch = false) => {
            if (!state.weatherEnabled) {
                if (DOMElements.weatherContainer) DOMElements.weatherContainer.classList.add('hidden');
                if (DOMElements.weatherWarningContainer) DOMElements.weatherWarningContainer.classList.remove('visible'); 
                return;
            } else {
                 if (DOMElements.weatherContainer) DOMElements.weatherContainer.classList.remove('hidden');
            }
            if (!DOMElements.weather) return;

            const apiLang = (state.currentLanguage === 'en') ? 'en' : 'tc';
            
            try {
                const targetCode = await Weather.getStationCode(); 
                const stationDetails = getStationByCode(targetCode);

                if (!stationDetails) {
                     console.error(`[Weather.fetch] Invalid station code determined: ${targetCode}`);
                     DOMElements.weather.textContent = Language.getText('weather_err_unavailable');
                     if (DOMElements.weatherWarningContainer) DOMElements.weatherWarningContainer.classList.remove('visible');
                     return;
                }
                
                // Determine the display name based on target code and current language
                const displayStationName = (state.currentLanguage === 'en') ? stationDetails.nameEN : stationDetails.nameTC;
                console.log(`[Weather.fetch] Target station: ${displayStationName} (Code: ${targetCode})`);

                const apiUrl = `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=${apiLang}`;
                const response = await fetch(apiUrl);
                 if (!response.ok) throw new Error(`Weather data fetch failed: ${response.statusText} (Status: ${response.status})`); 
                const data = await response.json();
                console.log("[Weather.fetch] Raw API data received."); 
                // console.debug("[Weather.fetch] Raw API data details:", data); // Optional: for deep debugging

                const tempDataByCode = {};
                const humidityDataByCode = {};

                if (data && data.temperature && data.temperature.data) {
                     data.temperature.data.forEach(item => {
                         if (item && item.place) {
                             const code = getStationCodeByName(item.place); 
                             if (code) {
                                 if (tempDataByCode[code] !== undefined) {
                                     console.warn(`[Weather.fetch Mapping] Temp: Duplicate entry found for code ${code} (Place: ${item.place}). Overwriting.`);
                                 }
                                 tempDataByCode[code] = item.value; 
                             } else {
                                 if (item.place.trim()) { 
-                                     console.warn(`[Weather.fetch] Could not map temp place "${item.place}" to a known station code.`);
+                                     console.warn(`[Weather.fetch Mapping] Temp: Failed to map place "${item.place}" to any known code.`);
                                 } 
                             }
                         }
                     });
                 } else {
                      console.warn("[Weather.fetch] Temperature data missing or in unexpected format in API response.");
                 }
                 
                 if (data && data.humidity && data.humidity.data) {
+                    // 列印所有濕度資料的地點名稱
+                    console.log('[Weather.fetch] 濕度資料地點名稱：', data.humidity.data.map(item => item.place));
                     data.humidity.data.forEach(item => {
                         if (item && item.place) {
                             const code = getStationCodeByName(item.place);
                              if (code) {
                                    if (humidityDataByCode[code] !== undefined) {
                                      console.warn(`[Weather.fetch Mapping] Humidity: Duplicate entry found for code ${code} (Place: ${item.place}). Overwriting.`);
                                 }
                                 humidityDataByCode[code] = item.value;
                             } else {
                                  if (item.place.trim()) { 
                                       console.warn(`[Weather.fetch Mapping] Humidity: Failed to map place "${item.place}" to any known code.`);
                                   } 
                              }
                         }
                     });
                 } else {
                     console.warn("[Weather.fetch] Humidity data missing or in unexpected format in API response.");
                 }

                  console.log("[Weather.fetch] Mapped Temp Data:", tempDataByCode);
                  console.log("[Weather.fetch] Mapped Humidity Data:", humidityDataByCode);

                const temp = tempDataByCode[targetCode];
                let humidity = humidityDataByCode[targetCode];
                // 判斷是否只有 HKO 有濕度資料
                const humidityCodes = Object.keys(humidityDataByCode);
                if (humidityCodes.length === 1 && humidityCodes[0] === 'HKO') {
                    // 只在本次開啟頁面時第一次顯示通知
                     if (!state.humidityNotifiedOnce) {
                         // Notify.show(Language.getText('notify_humidity_fallback'), 'warning', 3500); // Temporarily disabled
                         state.humidityNotifiedOnce = true;
                     }
                    // 若選擇的不是 HKO，則 fallback 用 HKO 的濕度
                    if (targetCode !== 'HKO') {
                        humidity = humidityDataByCode['HKO'];
                    }
                }

                if (isInitialFetch && state.locationChoiceInstance) {
                     state.locationChoiceInstance.setValue([targetCode]);
                }

                const iconCode = data.icon && data.icon[0];
                const icon = Weather.getIcon(iconCode);
                
                let warningInfo = ''; 
                if (state.weatherWarningEnabled && data.warningMessage && Array.isArray(data.warningMessage) && data.warningMessage.length > 0) {
                     const firstWarning = data.warningMessage.find(msg => typeof msg === 'string' && msg.trim() !== '');
                     if (firstWarning) {
                          warningInfo = ` <span class="weather-item warning">⚠️ ${firstWarning}</span>`;
                     } else {
                          console.log("[Weather.fetch] Warning message array present but contains no valid message.");
                     }
                } 
                
                let uviValue = undefined;
                let uviDesc = '';
                if (data.uvindex && data.uvindex.data && data.uvindex.data.length > 0) {
                    uviValue = data.uvindex.data[0].value;
                    uviDesc = data.uvindex.data[0].desc; // Description like 'Low', '低'
                    console.log(`[Weather.fetch] UV Index found: ${uviValue} (${uviDesc})`);
                } else {
                    console.warn("[Weather.fetch] UV Index data not found in API response.");
                }
                 
                const weatherHTML = `
                   <span class="weather-item">${displayStationName}</span> 
                   <span class="weather-item"><span class="weather-icon">${icon}</span>${temp !== undefined ? temp + '°C' : 'N/A'}</span>
                   <span class="weather-item"><span class="weather-icon">💧</span>${humidity !== undefined ? humidity + '%' : 'N/A'}</span>
                   <span class="weather-item"><span class="weather-icon">🔆</span>${uviValue !== undefined ? uviValue + (uviDesc ? ' (' + uviDesc + ')' : '') : 'N/A'}</span>
               `; // Ensure no warningInfo is appended here
                DOMElements.weather.innerHTML = weatherHTML;
                
                let warningMessage = ''; 
                if (state.weatherWarningEnabled && data.warningMessage && Array.isArray(data.warningMessage) && data.warningMessage.length > 0) {
                     const firstWarning = data.warningMessage.find(msg => typeof msg === 'string' && msg.trim() !== '');
                     if (firstWarning) {
                          warningMessage = `⚠️ ${firstWarning}`; // Only store the warning text
                     } else {
                          console.log("[Weather.fetch] Warning message array present but contains no valid message.");
                     }
                } 
                
                if (DOMElements.weatherWarningContainer) {
                     if (warningMessage) {
                         DOMElements.weatherWarningContainer.textContent = warningMessage;
                         DOMElements.weatherWarningContainer.classList.add('visible');
                     } else {
                         DOMElements.weatherWarningContainer.classList.remove('visible');
                         // Optional: Clear text after transition for smoother disappearance
                         setTimeout(() => {
                             if (!DOMElements.weatherWarningContainer.classList.contains('visible')) {
                                 DOMElements.weatherWarningContainer.textContent = '';
                             }
                         }, 300); // Match CSS transition duration
                     }
                } else {
                     console.warn("[Weather.fetch] Weather warning container element not found.");
                }
                
            } catch (error) {
                console.error('獲取或處理天氣數據時出錯:', error);
                 if (DOMElements.weather) {
                    DOMElements.weather.textContent = Language.getText('weather_err_unavailable');
                 }
                 if (DOMElements.weatherWarningContainer) {
                     DOMElements.weatherWarningContainer.classList.remove('visible');
                     DOMElements.weatherWarningContainer.textContent = ''; // Clear text on error
                 }
            }
        },
        initializeLocationSelect: async () => {
            console.log("[Weather.initLocSelect] Starting initialization.");
            if (state.locationChoiceInstance) {
                 console.log("[Weather.initLocSelect] Destroying existing Choices instance:", state.locationChoiceInstance);
                 try {
                      state.locationChoiceInstance.destroy();
                      console.log("[Weather.initLocSelect] Existing instance destroyed.");
                 } catch (e) {
                      console.error("[Weather.initLocSelect] Error destroying Choices instance:", e);
                 }
                 state.locationChoiceInstance = null; 
            }

            const selectElement = DOMElements.locationSelect;
            if (!selectElement) {
                console.error("[Weather.initLocSelect] Location select element not found.");
                return Promise.reject("Location select element not found."); // Return rejected promise
            }

            selectElement.innerHTML = ''; 
            console.log("[Weather.initLocSelect] Cleared native select options.");

            const choices = [];
            const currentCode = state.selectedLocationCode; 
            const lang = state.currentLanguage; // Get current language

            for (const code in HKO_STATIONS) {
                 const station = HKO_STATIONS[code];
                 const label = lang === 'en' ? station.nameEN : station.nameTC;
                 choices.push({
                     value: code, 
                     label: label, 
                     selected: code === currentCode, 
                     disabled: false
                 });
            }
            
            console.log(`[Weather.initLocSelect] Generated ${choices.length} choices for language '${lang}'.`);
            
            selectElement.add(new Option(Language.getText('selectLocationPlaceholder'), '', true, true)); // text, value, defaultSelected, selected

            return new Promise((resolve, reject) => { // Return a promise
                
                try {
                     console.log("[Weather.initLocSelect] Creating new Choices instance...");
                    state.locationChoiceInstance = new Choices(selectElement, {
                        searchEnabled: true,
                        itemSelectText: Language.getText('itemSelectText'), // Use translated text
                        allowHTML: false,
                        shouldSort: false,
                        placeholderValue: Language.getText('selectLocationPlaceholder'), // Set placeholder here
                        searchPlaceholderValue: Language.getText('searchPlaceholder'), // Use translated text
                        removeItemButton: false,
                        noResultsText: Language.getText('noResultsText'),
                        noChoicesText: Language.getText('noChoicesText')
                    });
                     console.log("[Weather.initLocSelect] New Choices instance created:", state.locationChoiceInstance);

                    state.locationChoiceInstance.setChoices(choices, 'value', 'label', true); // true to replace all choices
                    console.log("[Weather.initLocSelect] Choices set in Choices instance.");
                    
                    selectElement.addEventListener('change', Weather.handleLocationChange);                    
                     console.log("[Weather.initLocSelect] Event listener attached.");
                     resolve(); // Resolve the promise on success
                } catch (error) {
                    console.error("[Weather.initLocSelect] Failed to initialize Choices.js:", error);
                    state.locationChoiceInstance = null; // Ensure it's null on error
                    reject(error); // Reject the promise on error
                }
                
           });
        },

        handleLocationChange: (event) => {
            try {
                const selectedCode = event.target.value; // Get the selected code directly
                 if (!selectedCode || selectedCode === "") return; 
                 
                const stationDetails = getStationByCode(selectedCode);
                if (!stationDetails) {
                     console.error(`[Weather.handleLocationChange] Invalid station code selected: ${selectedCode}`);
                     Notify.show("選擇了無效的地區代碼", "error");
                     return;
                }

                localStorage.setItem('userWeatherStationCode', selectedCode); // Save only the code
                Notify.show(`${Language.getText('notify_location_set') || '已設置天氣地區為'}: ${stationDetails.nameTC}`, 'info');
                Weather.fetch(false); // Re-fetch weather for the new location
                Modal.close();
            } catch (e) {
                console.error("Error handling location change:", e);
                Notify.show("設置地區時出錯", "error");
            }
        },
         start: async () => {
             if (!state.weatherEnabled) {
                 console.log("[Weather.start] Weather display disabled. Preventing fetch/interval.");
                 return; 
             }
             
             if (DOMElements.weatherContainer) DOMElements.weatherContainer.classList.remove('hidden');
             await Weather.initializeLocationSelect(); 
             await Weather.fetch(true); // Await the first fetch
             if(state.weatherUpdateInterval) clearInterval(state.weatherUpdateInterval);
             state.weatherUpdateInterval = setInterval(() => Weather.fetch(false), 3600000);
         },
         stop: () => {
             if (state.weatherUpdateInterval) {
                clearInterval(state.weatherUpdateInterval);
                state.weatherUpdateInterval = null;
                console.log("[Weather.stop] Weather update interval cleared.");
             }
             if (DOMElements.weatherContainer) DOMElements.weatherContainer.classList.add('hidden');
             if (DOMElements.weatherWarningContainer) {
                  DOMElements.weatherWarningContainer.classList.remove('visible');
                  DOMElements.weatherWarningContainer.textContent = ''; // Clear text
             }
         }
    };

     const Background = {
         createYouTubePlayer: () => {
             const videoId = state.pendingYouTubeVideoId;
             const startTime = state.initialYouTubeStartTime;
             console.log(`[Background.createYouTubePlayer] Attempting to create player for ID: ${videoId}, Start time: ${startTime}`);

             if (!videoId) {
                 console.warn("[Background.createYouTubePlayer] No pending video ID found.");
                 return;
             }

             const playerElement = document.getElementById('youtube-player');
             if (!playerElement) {
                 console.error("[Background.createYouTubePlayer] YouTube player placeholder element not found!");
                 return;
             }

             if (state.youtubePlayer && typeof state.youtubePlayer.destroy === 'function') {
                try {
                    state.youtubePlayer.destroy();
                    console.log("[Background.createYouTubePlayer] Destroyed previous player instance.");
                } catch(e) {
                    console.error("[Background.createYouTubePlayer] Error destroying previous player:", e);
                }
                state.youtubePlayer = null;
             }

             try {
                 state.youtubePlayer = new YT.Player('youtube-player', {
                     height: '100%', // Make player fill the placeholder
                     width: '100%',
                     videoId: videoId,
                     playerVars: {
                         'autoplay': 1,
                         'mute': 1,
                         'loop': 1, // Loop the video
                         'playlist': videoId, // Required for loop=1 to work
                         'controls': 0, // Hide player controls
                         'showinfo': 0, // Hide video title, etc.
                         'rel': 0, // Do not show related videos
                         'iv_load_policy': 3, // Hide annotations
                         'modestbranding': 1, // Minimal YouTube logo
                         'start': Math.floor(startTime) // Start time in seconds
                         // 'origin': window.location.origin // Might be needed for some environments
                     },
                     events: {
                         'onReady': Background.onPlayerReady,
                         'onError': Background.onPlayerError
                         // 'onStateChange': Background.onPlayerStateChange // Add if needed later
                     }
                 });
                 console.log("[Background.createYouTubePlayer] YT.Player instance created for:", videoId);
                 state.mediaSource = state.youtubePlayer; // Store player instance as mediaSource
                 state.mediaType = 'youtube';
                 state.pendingYouTubeVideoId = null; // Clear pending ID after creation
             } catch (error) {
                 console.error("[Background.createYouTubePlayer] Error creating YouTube player:", error);
                 Notify.show('無法初始化 YouTube 播放器', 'error');
             }
         },

         onPlayerReady: (event) => {
             console.log("[Background.onPlayerReady] Player ready for video:", event.target.getVideoData().video_id);
             const playerIframe = event.target.getIframe();
             if (playerIframe) {
                 playerIframe.style.opacity = 0;
                 anime({ targets: playerIframe, opacity: 1, duration: 1000, easing: 'linear' });
             }
         },

         onPlayerError: (event) => {
             console.error('[Background.onPlayerError] YouTube Player Error:', event.data);
             let errorMessage = 'YouTube 播放器錯誤';
             switch (event.data) {
                 case 2: errorMessage = '無效的 YouTube 影片 ID'; break;
                 case 5: errorMessage = 'HTML5 播放器錯誤'; break;
                 case 100: errorMessage = '找不到影片或影片被設為私人'; break;
                 case 101:
                 case 150: errorMessage = '影片擁有者禁止嵌入播放'; break;
             }
             Notify.show(`${errorMessage} (Code: ${event.data})`, 'error');
             // Background.clear();
             // state.pendingYouTubeVideoId = DEFAULT_YOUTUBE_ID;
             // state.initialYouTubeStartTime = 0;
             // Background.createYouTubePlayer();
         },

         clear: () => {
             console.log("[Background.clear] Clearing background. Current type:", state.mediaType);
             if (state.mediaType === 'youtube' && state.youtubePlayer && typeof state.youtubePlayer.destroy === 'function') {
                 try {
                    state.youtubePlayer.destroy();
                    console.log("[Background.clear] YouTube player destroyed.");
                 } catch(e) {
                     console.error("[Background.clear] Error destroying YouTube player:", e);
                 }
                 state.youtubePlayer = null;
             } else if (state.mediaSource) { // Handle other types (video, image)
                 if (state.mediaType === 'video' && typeof state.mediaSource.pause === 'function') state.mediaSource.pause();
                 if (typeof state.mediaSource.remove === 'function') state.mediaSource.remove();
                 console.log(`[Background.clear] Removed ${state.mediaType} element.`);
             }

             if (DOMElements.backgroundContainer) {
                 DOMElements.backgroundContainer.style.backgroundImage = '';
                 const ytPlayerEl = document.getElementById('youtube-player');
                 if (ytPlayerEl) ytPlayerEl.innerHTML = '';
                 while (DOMElements.backgroundContainer.firstChild && DOMElements.backgroundContainer.firstChild.id !== 'youtube-player') {
                     DOMElements.backgroundContainer.removeChild(DOMElements.backgroundContainer.firstChild);
                 }

             }
             state.mediaSource = null;
             state.mediaType = null;
             console.log("[Background.clear] Background cleared.");
         },

         setImage: (src) => {
             if (!DOMElements.backgroundContainer) return;
             Background.clear(); // Clear previous background (including YT player)
             const img = new Image();
             img.onload = () => {
                 DOMElements.backgroundContainer.style.backgroundImage = `url(${src})`;
                 DOMElements.backgroundContainer.style.opacity = 0;
                  anime({ targets: DOMElements.backgroundContainer, opacity: 1, duration: 1000, easing: 'linear' });
                 state.mediaType = 'image';
                 state.mediaSource = src; // Store URL as source for image
             };
             img.onerror = () => Notify.show('無法加載圖片背景', 'error');
             img.src = src;
         },

         setVideo: (src) => {
             if (!DOMElements.backgroundContainer) return;
             Background.clear(); // Clear previous background (including YT player)
             const video = document.createElement('video');
             video.src = src;
             video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true;
             video.style.opacity = 0;
             video.onerror = () => Notify.show('無法加載視頻背景', 'error');
             video.oncanplay = () => anime({ targets: video, opacity: 1, duration: 1000, easing: 'linear' });
             DOMElements.backgroundContainer.appendChild(video);
             state.mediaSource = video; state.mediaType = 'video';
         },

         setYouTube: (videoId) => {
             console.log(`[Background.setYouTube] User requested video ID: ${videoId}`);
             if (!videoId) {
                 Notify.show('無效的 YouTube 影片 ID', 'error');
                 return;
             }
             Background.clear();

             // Set the pending state for the API ready callback or direct creation
             state.pendingYouTubeVideoId = videoId;
             state.initialYouTubeStartTime = 0; // Manual set starts from beginning
             state.mediaType = 'youtube'; // Set type immediately

             // If YT API is already loaded, create player directly. Otherwise, it will be created by onYouTubeIframeAPIReady.
             if (typeof YT !== 'undefined' && YT.Player) {
                 console.log("[Background.setYouTube] YT API ready, creating player directly.");
                 Background.createYouTubePlayer();
             } else {
                  console.log("[Background.setYouTube] YT API not ready yet, player will be created by callback.");
                  // API loading is handled in App.init
             }
         },

         savePreference: (type, value) => {
             let prefData = { type };
             if (type === 'youtube') {
                 prefData.id = Utils.extractYoutubeId(value);
                 if (!prefData.id) return;
             } else if (type === 'image' || type === 'video') {
                 if (typeof value === 'string' && value.startsWith('blob:')) {
                     console.warn("Skipping save of temporary Object URL to preferences.");
                     return;
                 }
                 prefData.url = value;
             }
             localStorage.setItem('mediaPreference', JSON.stringify(prefData));
         },

         loadPreference: () => {
             const savedMedia = localStorage.getItem('mediaPreference');
             state.youtubeResumeEnabled = localStorage.getItem('youtubeResumeEnabled') !== 'false';

             let loadedType = null;
             let loadedValue = null;
             state.initialYouTubeStartTime = 0;

             if (savedMedia) {
                 try {
                     const mediaData = JSON.parse(savedMedia);
                     loadedType = mediaData.type;
                     if (mediaData.type === 'youtube' && mediaData.id) {
                        loadedValue = mediaData.id;
                        if (state.youtubeResumeEnabled) {
                             const savedTime = parseFloat(localStorage.getItem('youtubePlaybackTime') || '0');
                             state.initialYouTubeStartTime = savedTime;
                        }
                        state.pendingYouTubeVideoId = mediaData.id;
                        
                     } else if (mediaData.type === 'image' && mediaData.url) {
                        Background.setImage(mediaData.url); 
                     } else if (mediaData.type === 'video' && mediaData.url) {
                         Background.setVideo(mediaData.url); 
                     } else if (mediaData.type === 'none') {
                         Background.clear(); 
                     } else {
                         loadedType = 'image'; 
                         loadedValue = DEFAULT_IMAGE_URL;
                     }
                 } catch (e) {
                     console.error('Error loading saved media preference:', e);
                     localStorage.removeItem('mediaPreference');
                     loadedType = 'image'; 
                     loadedValue = DEFAULT_IMAGE_URL;
                 }
             } else {
                 loadedType = 'image'; 
                 loadedValue = DEFAULT_IMAGE_URL;
             }

             if (loadedType === 'youtube' && !state.youtubePlayer && loadedValue) {
                  state.pendingYouTubeVideoId = loadedValue;
                  state.mediaType = 'youtube'; 
             } else if (loadedType === 'image' && loadedValue) {
                 Background.setImage(loadedValue);
             }
         },
         
         saveYouTubeTime: () => {
             // Only save time if the feature is enabled
             if (state.youtubeResumeEnabled && state.mediaType === 'youtube' && state.youtubePlayer && typeof state.youtubePlayer.getCurrentTime === 'function') {
                 try {
                    const currentTime = state.youtubePlayer.getCurrentTime();
                    if (currentTime > 0) { 
                        localStorage.setItem('youtubePlaybackTime', currentTime);
                        console.log(`[Background.saveYouTubeTime] Saved time: ${currentTime}`);
                    }
                 } catch (e) {
                      console.error("[Background.saveYouTubeTime] Error getting current time:", e);
                 }
             } else if (!state.youtubeResumeEnabled) {
                 // If resume is disabled, ensure no old time persists
                 localStorage.removeItem('youtubePlaybackTime');
                 console.log("[Background.saveYouTubeTime] Resume disabled, cleared saved time.");
             }
         }
     };

    const MemeWidget = {
        // Placeholder: 1x1 transparent GIF
        PLACEHOLDER_IMG: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',

        fetchMeme: async () => {
            if (!DOMElements.memeImage) return;
            // Set loading state using placeholder
            DOMElements.memeImage.src = MemeWidget.PLACEHOLDER_IMG; // Set to placeholder
            DOMElements.memeImage.classList.add('loading'); // Add loading class
            DOMElements.memeImage.alt = Language.getText('widget_meme_loading_alt');

            try {
                const isGif = Math.random() < 0.3; // 30% chance for a GIF
                const endpoint = isGif ? 'gif' : '';
                const apiUrl = `https://cataas.com/cat${endpoint ? '/' + endpoint : ''}?t=${Date.now()}`;
                console.log(`[MemeWidget.fetchMeme] Fetching from: ${apiUrl}`);

                // Preload image in memory
                const img = new Image(); 
                img.onload = () => {
                    DOMElements.memeImage.src = apiUrl; // Set src only when loaded
                    DOMElements.memeImage.alt = isGif ? 'Random Cat GIF' : 'Random Cat Image';
                    DOMElements.memeImage.classList.remove('loading'); // Remove loading class
                    console.log("[MemeWidget.fetchMeme] Cat loaded.");
                };
                img.onerror = () => {
                    console.error("[MemeWidget.fetchMeme] Error loading cat image/gif.");
                    Notify.show('無法加載貓咪圖片', 'error');
                    // Keep placeholder src on error
                    DOMElements.memeImage.alt = Language.getText('widget_meme_loading_alt'); 
                    DOMElements.memeImage.classList.remove('loading'); // Remove loading class
                    // DOMElements.memeImage.src = MemeWidget.PLACEHOLDER_IMG;
                };
                img.src = apiUrl; // Start preloading
                
            } catch (error) {
                // This catch block might be less likely to trigger now unless there's a setup error
                console.error("獲取貓咪時出錯:", error);
                Notify.show(`無法獲取貓咪: ${error.message}`, 'error');
                DOMElements.memeImage.alt = Language.getText('widget_meme_loading_alt');
            }
        },
        toggle: () => {
            if (!DOMElements.memeWidget) return;
            const isHidden = DOMElements.memeWidget.classList.toggle('hidden');
            if (!isHidden) {
                MemeWidget.fetchMeme();
            }
            localStorage.setItem('memeWidgetVisible', !isHidden);
        },
        setup: () => {
            if (DOMElements.newMemeBtn) {
                DOMElements.newMemeBtn.addEventListener('click', MemeWidget.fetchMeme);
            }
            const header = DOMElements.memeWidget?.querySelector('.widget-header');
            if (header) {
                header.addEventListener('mousedown', (event) => Draggable.startDrag(event, DOMElements.memeWidget, 'widget'));
            }
            // Close button
            const closeBtn = DOMElements.memeWidget?.querySelector('.widget-close-btn');
            closeBtn?.addEventListener('click', MemeWidget.toggle);
            
            // Force hidden on setup, ignore localStorage for visibility
            if (DOMElements.memeWidget) {
                 DOMElements.memeWidget.classList.add('hidden');
            }
            /* // Removed loading visibility from localStorage
             const savedVisibility = localStorage.getItem('memeWidgetVisible');
             if (savedVisibility === 'true' && DOMElements.memeWidget) {
                 DOMElements.memeWidget.classList.remove('hidden');
                 MemeWidget.fetchMeme();
             } else if (DOMElements.memeWidget) {
                 DOMElements.memeWidget.classList.add('hidden');
             }
             */
             Resizable.setupWidgetResizing(DOMElements.memeWidget); 
             Draggable.loadWidgetPosition('meme-widget'); // Still load position
        }
    };

     const TodoWidget = {
         state: {
            tasks: []
         },
         toggle: () => {
             if (!DOMElements.todoWidget) return;
             const isHidden = DOMElements.todoWidget.classList.toggle('hidden');
             localStorage.setItem('todoWidgetVisible', !isHidden);
         },
         loadTasks: () => {
             const savedTasks = localStorage.getItem('todoTasks');
             if (savedTasks) {
                 try {
                     TodoWidget.state.tasks = JSON.parse(savedTasks);
                 } catch (e) {
                     console.error("Error parsing saved tasks:", e);
                     TodoWidget.state.tasks = [];
                     localStorage.removeItem('todoTasks');
                 }
             } else {
                 TodoWidget.state.tasks = [];
             }
             TodoWidget.renderList();
         },
         saveTasks: () => {
             try {
                 localStorage.setItem('todoTasks', JSON.stringify(TodoWidget.state.tasks));
             } catch (e) {
                 console.error("Error saving tasks:", e);
                 Notify.show("無法儲存待辦事項", "error");
             }
         },
         renderTask: (task) => {
             if (!DOMElements.todoList) return;

             const li = document.createElement('li');
             li.dataset.id = task.id;
             if (task.completed) {
                 li.classList.add('completed');
             }

             const checkbox = document.createElement('input');
             checkbox.type = 'checkbox';
             checkbox.checked = task.completed;
             checkbox.addEventListener('change', () => TodoWidget.toggleTask(task.id));

             const span = document.createElement('span');
             span.textContent = task.text;

             const deleteBtn = document.createElement('button');
             deleteBtn.className = 'delete-todo';
             deleteBtn.innerHTML = '&times;';
             deleteBtn.ariaLabel = '刪除任務';
             deleteBtn.addEventListener('click', () => TodoWidget.deleteTask(task.id));

             li.appendChild(checkbox);
             li.appendChild(span);
             li.appendChild(deleteBtn);

             DOMElements.todoList.appendChild(li);
         },
         renderList: () => {
             if (!DOMElements.todoList) return;
             DOMElements.todoList.innerHTML = '';
             TodoWidget.state.tasks.forEach(task => TodoWidget.renderTask(task));
         },
         addTask: () => {
             if (!DOMElements.todoInput) return;
             const text = DOMElements.todoInput.value.trim();
             if (text) {
                 const newTask = {
                     id: Date.now(),
                     text: text,
                     completed: false
                 };
                 TodoWidget.state.tasks.push(newTask);
                 TodoWidget.renderTask(newTask);
                 TodoWidget.saveTasks();
                 DOMElements.todoInput.value = '';
                 DOMElements.todoInput.focus();
             } else {
                 Notify.show("請輸入待辦事項內容", "warning");
             }
         },
         toggleTask: (taskId) => {
             const taskIndex = TodoWidget.state.tasks.findIndex(t => t.id === taskId);
             if (taskIndex > -1) {
                 TodoWidget.state.tasks[taskIndex].completed = !TodoWidget.state.tasks[taskIndex].completed;
                 
                 const li = DOMElements.todoList.querySelector(`li[data-id="${taskId}"]`);
                 if (li) {
                    li.classList.toggle('completed', TodoWidget.state.tasks[taskIndex].completed);
                 }
                 
                 TodoWidget.saveTasks();
             } else {
                 console.error(`TodoWidget: Task ID ${taskId} not found for toggle.`);
             }
         },
         deleteTask: (taskId) => {
             const initialLength = TodoWidget.state.tasks.length;
             TodoWidget.state.tasks = TodoWidget.state.tasks.filter(t => t.id !== taskId);
             
             if (TodoWidget.state.tasks.length < initialLength) {
                 const li = DOMElements.todoList.querySelector(`li[data-id="${taskId}"]`);
                 if (li) {
                     li.remove();
                 }
                 TodoWidget.saveTasks();
             } else {
                 console.error(`TodoWidget: Task ID ${taskId} not found for deletion.`);
             }
         },
         setup: () => {
             if (DOMElements.addTodoBtn) {
                DOMElements.addTodoBtn.addEventListener('click', TodoWidget.addTask);
             }
             if (DOMElements.todoInput) {
                DOMElements.todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') TodoWidget.addTask(); });
             }
             const header = DOMElements.todoWidget?.querySelector('.widget-header');
             console.log("[TodoWidget.setup] Finding header for todo-widget:", header); // Log header finding
             if (header) {
                 header.addEventListener('mousedown', (event) => {
                     console.log("[TodoWidget.setup] Mousedown detected on todo-widget header."); // Log mousedown
                     Draggable.startDrag(event, DOMElements.todoWidget, 'widget');
                 });
                 console.log("[TodoWidget.setup] Mousedown listener attached to header."); // Log listener attached
             } else {
                 console.error("[TodoWidget.setup] Could not find header for todo-widget!");
             }
             // Close button
             const closeBtn = DOMElements.todoWidget?.querySelector('.widget-close-btn');
             closeBtn?.addEventListener('click', TodoWidget.toggle);
             TodoWidget.loadTasks();
             const savedVisibility = localStorage.getItem('todoWidgetVisible');
             if (savedVisibility === 'false' && DOMElements.todoWidget) { DOMElements.todoWidget.classList.add('hidden'); }
             else if (savedVisibility === 'true' && DOMElements.todoWidget) { DOMElements.todoWidget.classList.remove('hidden'); }
             Draggable.loadWidgetPosition('todo-widget');
             Resizable.setupWidgetResizing(DOMElements.todoWidget);
         }
     };

    const MemoManager = {
        createMemoElement: (memo) => {
            const memoEl = document.createElement('div');
            memoEl.className = 'memo-note draggable';
            memoEl.dataset.id = memo.id;
            memoEl.style.top = memo.top || '20%';
            memoEl.style.left = memo.left || `${Math.random() * 60 + 10}%`;
            // Apply saved dimensions if they exist
            if (memo.width) memoEl.style.width = memo.width;
            if (memo.height) memoEl.style.height = memo.height;
            
            const textarea = document.createElement('textarea');
            textarea.value = memo.text;
            textarea.placeholder = "Meow Meow...";
            textarea.addEventListener('input', Utils.debounce((e) => {
                 MemoManager.updateMemoText(memo.id, e.target.value);
            }, 500));

            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'memo-controls';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'memo-delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.ariaLabel = 'Delete Memo';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                MemoManager.deleteMemo(memo.id);
            });

            controlsDiv.appendChild(deleteBtn);
            memoEl.appendChild(textarea);
            memoEl.appendChild(controlsDiv);

            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            resizeHandle.addEventListener('mousedown', (event) => Resizable.startResize(event, memoEl, 'memo'));
            memoEl.appendChild(resizeHandle); 

            memoEl.addEventListener('mousedown', (event) => {
                 if (event.target.tagName === 'TEXTAREA' || event.target.classList.contains('memo-delete-btn') || event.target.classList.contains('resize-handle')) {
                    return; // Prevent drag if clicking controls or resize handle
                 }
                Draggable.startDrag(event, memoEl, 'memo');
            });

            return memoEl;
        },
        addMemo: () => {
            const newId = Date.now();
            const newMemo = {
                id: newId,
                text: '',
                top: '15%',
                left: `${Math.random() * 50 + 25}%`
            };
            state.memos.push(newMemo);
            const memoEl = MemoManager.createMemoElement(newMemo);
            DOMElements.memoContainer?.appendChild(memoEl);
            MemoManager.saveMemos();
            memoEl.querySelector('textarea')?.focus();
            Notify.show('新增 Memo', 'info');
        },
        updateMemoText: (id, newText) => {
            const memo = state.memos.find(m => m.id === id);
            if (memo) {
                memo.text = newText;
                MemoManager.saveMemos();
            }
        },
        updateMemoPosition: (id, top, left) => {
            const memo = state.memos.find(m => m.id === id);
            if (memo) {
                memo.top = top;
                memo.left = left;
                MemoManager.saveMemos();
            }
        },
        updateMemoDimensions: (id, width, height) => {
             const memo = state.memos.find(m => m.id === id);
             if (memo) {
                 memo.width = width;
                 memo.height = height;
                 MemoManager.saveMemos();
             }
        },
        deleteMemo: (id) => {
            state.memos = state.memos.filter(m => m.id !== id);
            const memoEl = DOMElements.memoContainer?.querySelector(`.memo-note[data-id="${id}"]`);
            memoEl?.remove();
            MemoManager.saveMemos();
            Notify.show('Memo 已刪除', 'info');
        },
        loadMemos: () => {
            const savedMemos = localStorage.getItem('memos');
            if (savedMemos) {
                try {
                    state.memos = JSON.parse(savedMemos);
                } catch (e) {
                    console.error("Error parsing saved memos:", e);
                    state.memos = [];
                    localStorage.removeItem('memos');
                }
            } else {
                state.memos = [];
            }
            DOMElements.memoContainer.innerHTML = '';
            state.memos.forEach(memo => {
                const memoEl = MemoManager.createMemoElement(memo);
                DOMElements.memoContainer?.appendChild(memoEl);
            });
             console.log("Memos loaded");
        },
        saveMemos: () => {
             try {
                 localStorage.setItem('memos', JSON.stringify(state.memos));
             } catch (e) {
                 console.error("Error saving memos:", e);
                 Notify.show("無法儲存 Memos", "error");
             }
        },
        setup: () => {
             MemoManager.loadMemos();
        }
    };

    const Draggable = {
        startDrag: (event, element, type) => {
            console.log(`[Draggable.startDrag] Called. Type: ${type}, Element:`, element, "Target:", event.target);
            // Prevent drag if clicking resize handle too
            if (type === 'widget' && event.target.closest('button, input, select, .widget-content, .resize-handle')) {
                 return; 
            }
             if (type === 'memo' && event.target.closest('textarea, button, .resize-handle')) {
                  return; 
             }
            
            console.log("[Draggable.startDrag] Proceeding with drag start."); // Log proceeding
            event.preventDefault(); 

            state.activeDraggable.element = element;
            state.activeDraggable.isDragging = true;
            state.activeDraggable.type = type;

            const rect = element.getBoundingClientRect();
            state.activeDraggable.offsetX = event.clientX - rect.left;
            state.activeDraggable.offsetY = event.clientY - rect.top;

            element.style.cursor = 'grabbing'; 
            element.style.userSelect = 'none'; 
             element.style.zIndex = (type === 'memo') ? 7 : 11;

            document.addEventListener('mousemove', Draggable.drag);
            document.addEventListener('mouseup', Draggable.stopDrag);
            document.addEventListener('mouseleave', Draggable.stopDrag);
        },
        drag: (event) => {
            if (!state.activeDraggable.isDragging || !state.activeDraggable.element) return;

            const element = state.activeDraggable.element;
            let newX = event.clientX - state.activeDraggable.offsetX;
            let newY = event.clientY - state.activeDraggable.offsetY;

            const vpWidth = window.innerWidth;
            const vpHeight = window.innerHeight;
            const elWidth = element.offsetWidth;
            const elHeight = element.offsetHeight;

            const constrainedX = Math.max(0, Math.min(newX, vpWidth - elWidth));
            const constrainedY = Math.max(0, Math.min(newY, vpHeight - elHeight));

            requestAnimationFrame(() => {
                element.style.left = `${constrainedX}px`;
                element.style.top = `${constrainedY}px`;
            });
        },
        stopDrag: () => {
            if (!state.activeDraggable.isDragging) return;

            const element = state.activeDraggable.element;
            const type = state.activeDraggable.type;

            if (element) {
                element.style.cursor = (type === 'memo') ? 'grab' : '';
                element.style.userSelect = ''; 
                element.style.zIndex = (type === 'memo') ? 6 : 10;

                const finalTop = element.style.top;
                const finalLeft = element.style.left;

                if (type === 'memo') {
                    const memoId = parseInt(element.dataset.id, 10);
                    if (!isNaN(memoId)) {
                         MemoManager.updateMemoPosition(memoId, finalTop, finalLeft);
                    }
                } else if (type === 'widget') {
                    const widgetId = element.id;
                    if (widgetId) {
                       console.log(`[Draggable.stopDrag] Saving position for widget: ${widgetId}, Top: ${finalTop}, Left: ${finalLeft}`);
                       state.widgetPositions[widgetId] = { top: finalTop, left: finalLeft };
                        console.log("[Draggable.stopDrag] state.widgetPositions before save:", JSON.stringify(state.widgetPositions));
                        localStorage.setItem('widgetPositions', JSON.stringify(state.widgetPositions));
                    }
                }
            }

            state.activeDraggable = { element: null, offsetX: 0, offsetY: 0, isDragging: false, type: null };

            document.removeEventListener('mousemove', Draggable.drag);
            document.removeEventListener('mouseup', Draggable.stopDrag);
            document.removeEventListener('mouseleave', Draggable.stopDrag);
        },
        loadWidgetPosition: (widgetId) => {
              const savedPositions = localStorage.getItem('widgetPositions');
              let positions = {};
              if (savedPositions) { 
                  try { 
                      positions = JSON.parse(savedPositions); 
                  } catch (e) { 
                      console.error(`[Draggable.loadWidgetPosition] Error parsing saved positions: ${e}`); 
                      localStorage.removeItem('widgetPositions'); 
                  } 
              }
              
              const pos = positions[widgetId];
              console.log(`[Draggable.loadWidgetPosition] Attempting to load position for: ${widgetId}. Found:`, pos);
              const element = document.getElementById(widgetId);
              if (element && pos && pos.top && pos.left) {
                  element.style.top = pos.top;
                  element.style.left = pos.left;
                  console.log(`[Draggable.loadWidgetPosition] Applied position to ${widgetId}: Top: ${pos.top}, Left: ${pos.left}`);
              }
         }
    };

    const Resizable = {
        MIN_WIDTH: 150, // Minimum dimensions
        MIN_HEIGHT: 100,

        startResize: (event, element, type) => {
            event.stopPropagation(); // Prevent triggering drag on the element below
            event.preventDefault();

            state.activeResizable.element = element;
            state.activeResizable.isResizing = true;
            state.activeResizable.type = type;
            state.activeResizable.startX = event.clientX;
            state.activeResizable.startY = event.clientY;
            state.activeResizable.startWidth = element.offsetWidth;
            state.activeResizable.startHeight = element.offsetHeight;

            // element.classList.add('resizing');

            document.addEventListener('mousemove', Resizable.resize);
            document.addEventListener('mouseup', Resizable.stopResize);
            document.addEventListener('mouseleave', Resizable.stopResize); 
            console.log(`[Resizable.startResize] Started resizing ${type}:`, element);
        },

        resize: (event) => {
            if (!state.activeResizable.isResizing || !state.activeResizable.element) return;

            const element = state.activeResizable.element;
            const dx = event.clientX - state.activeResizable.startX;
            const dy = event.clientY - state.activeResizable.startY;

            // Calculate new dimensions (bottom-right handle logic)
            let newWidth = state.activeResizable.startWidth + dx;
            let newHeight = state.activeResizable.startHeight + dy;

            // Apply minimum size constraints
            newWidth = Math.max(Resizable.MIN_WIDTH, newWidth);
            newHeight = Math.max(Resizable.MIN_HEIGHT, newHeight);
            
            // Apply directly to style
             requestAnimationFrame(() => {
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
             });
        },

        stopResize: () => {
            if (!state.activeResizable.isResizing) return;
            console.log(`[Resizable.stopResize] Stopped resizing.`);

            const element = state.activeResizable.element;
            const type = state.activeResizable.type;

            if (element) {
                // element.classList.remove('resizing');
                const finalWidth = element.style.width;
                const finalHeight = element.style.height;
                
                // Save dimensions based on type
                if (type === 'memo') {
                    const memoId = parseInt(element.dataset.id, 10);
                    if (!isNaN(memoId)) {
                        MemoManager.updateMemoDimensions(memoId, finalWidth, finalHeight);
                    }
                } else if (type === 'widget') {
                    // TODO: Save widget dimensions if needed (currently not saved)
                    console.warn(`Widget resizing finished, but saving dimensions is not implemented yet for ID: ${element.id}`);
                }
            }

            // Reset state
            state.activeResizable = { element: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0, isResizing: false, type: null };

            document.removeEventListener('mousemove', Resizable.resize);
            document.removeEventListener('mouseup', Resizable.stopResize);
            document.removeEventListener('mouseleave', Resizable.stopResize);
        },

        setupWidgetResizing: (widgetElement) => {
             const handle = widgetElement?.querySelector('.resize-handle');
             if (handle) {
                 handle.addEventListener('mousedown', (event) => Resizable.startResize(event, widgetElement, 'widget'));
             } else {
                  console.warn(`[Resizable] Could not find resize handle for widget: ${widgetElement.id}`);
             }
        }
    };

    const Modal = {
        setup: () => {
            console.log("[Modal.setup] Starting setup..."); // Add start log
            if (!DOMElements.settingsModal) {
                 console.error("Settings modal element not found!");
                 return;
            }
            DOMElements.closeModalBtn?.addEventListener('click', Modal.close);
            
            // Setup Button Actions
            DOMElements.modalButtons.forEach(btn => {
                 const action = btn.dataset.action;
                 // Special handling for location handled by Choices.js change event
                 if (action === 'location') return; 

                 btn.addEventListener('click', () => {
                     // Find the corresponding input element (if any)
                     let inputElement = null;
                     if (action === 'youtube') inputElement = document.getElementById('youtube-input');
                     else if (action === 'image') inputElement = document.getElementById('image-input');
                     else if (action === 'video') inputElement = document.getElementById('video-input');

                     let value = inputElement ? inputElement.value.trim() : null;

                     // Actions that require a non-empty value from their input
                     const needsValue = ['youtube', 'image', 'video'];
                     if (needsValue.includes(action) && !value) {
                         Notify.show('請輸入有效的值', 'warning');
                         inputElement?.focus();
                         return;
                     }
                     
                     Modal.handleAction(action, value); 

                     if (inputElement && needsValue.includes(action)) { 
                          // For now, let's clear it.
                          inputElement.value = ''; 
                     }
                 });
            });

            // Setup Checkbox Listeners
            if (DOMElements.weatherEnabledCheckbox && DOMElements.warningEnabledCheckbox) {
                DOMElements.weatherEnabledCheckbox.addEventListener('change', (e) => {
                    const isEnabled = e.target.checked;
                    state.weatherEnabled = isEnabled;
                    localStorage.setItem('weatherEnabled', state.weatherEnabled);

                    DOMElements.warningEnabledCheckbox.disabled = !isEnabled;
                    if (!isEnabled) {
                        // If weather is disabled, automatically disable and uncheck warnings
                        DOMElements.warningEnabledCheckbox.checked = false;
                        state.weatherWarningEnabled = false;
                        localStorage.setItem('weatherWarningEnabled', state.weatherWarningEnabled);
                         // Weather.stop() will handle hiding the container
                    } else {
                        // If weather is enabled, automatically enable AND check warnings
                        DOMElements.warningEnabledCheckbox.checked = true; 
                        state.weatherWarningEnabled = true;
                        localStorage.setItem('weatherWarningEnabled', state.weatherWarningEnabled);
                        // Weather.start() below will trigger an initial fetch which respects the new warning state
                    }

                    // Start or stop weather updates
                    if (isEnabled) {
                        Weather.start(); 
                    } else {
                        Weather.stop(); 
                    }
                });
            } else {
                 console.warn("Weather enabled or warning checkbox not found.");
            }

            if (DOMElements.warningEnabledCheckbox) {
                DOMElements.warningEnabledCheckbox.addEventListener('change', (e) => {
                    // This listener only needs to update the state and storage
                    // The enabled/disabled state is handled by the weatherEnabledCheckbox listener
                    state.weatherWarningEnabled = e.target.checked;
                    localStorage.setItem('weatherWarningEnabled', state.weatherWarningEnabled);
                    
                    // Re-fetch immediately to show/hide warning if present, but only if weather is enabled
                     if (state.weatherEnabled) { 
                         Weather.fetch(false);
                     }
                });
            } else {
                 console.warn("Weather warning checkbox not found.");
            }

            // YouTube Resume Checkbox Listener
            if (DOMElements.youtubeResumeCheckbox) {
                DOMElements.youtubeResumeCheckbox.addEventListener('change', (e) => {
                    state.youtubeResumeEnabled = e.target.checked;
                    localStorage.setItem('youtubeResumeEnabled', state.youtubeResumeEnabled);
                    // If disabled, clear any previously saved time
                    if (!state.youtubeResumeEnabled) {
                        localStorage.removeItem('youtubePlaybackTime');
                    }
                });
            } else {
                 console.warn("YouTube resume checkbox not found.");
            }

            // Close modal on background click
            DOMElements.settingsModal.addEventListener('click', (event) => { if (event.target === DOMElements.settingsModal) { Modal.close(); } });

            DOMElements.historyButtons.forEach(btn => {
                const type = btn.dataset.historyFor;
                if (type) {
                    btn.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevent click from bubbling up to document listener immediately
                        UrlHistory.toggleList(type);
                    });
                } else {
                     console.warn("[Modal.setup] History button found without data-history-for attribute.", btn);
                }
            });

            /* 
             DOMElements.historyButtons.forEach(btn => { ... });
            */
           
            const historyInputMappings = {
                'youtube-input': 'youtube',
                'image-input': 'image',
                'video-input': 'video'
            };
            
            for (const inputId in historyInputMappings) {
                 const inputElement = document.getElementById(inputId);
                 const type = historyInputMappings[inputId];
                 if (inputElement) {
                     inputElement.addEventListener('input', (e) => UrlHistory.handleInput(e, type));
                     inputElement.addEventListener('focus', (e) => UrlHistory.handleFocus(e, type));
                     inputElement.addEventListener('blur', (e) => UrlHistory.handleBlur(e, type));
                     // Prevent browser autocomplete 
                     inputElement.setAttribute('autocomplete', 'off');
                 } else {
                     console.warn(`[Modal.setup] Input element not found for history: #${inputId}`);
                 }
            }

            if (DOMElements.languageSelect) {
                DOMElements.languageSelect.value = state.currentLanguage; 
                try {
                    // Store the instance in state
                    state.languageChoiceInstance = new Choices(DOMElements.languageSelect, { 
                        searchEnabled: false, 
                        itemSelectText: '選擇', 
                        allowHTML: false,
                        shouldSort: false,
                        placeholder: false, 
                        removeItemButton: false,
                        addItemText: null,
                        addItemFilter: false,
                    });
                    console.log("[Modal.setup] Choices.js initialized for language select.");
                } catch (error) {
                    console.error("[Modal.setup] Failed to initialize Choices.js for language select:", error);
                    state.languageChoiceInstance = null; // Ensure it's null on error
                }

                DOMElements.languageSelect.addEventListener('change', Language.handleLanguageChange);
            } else {
                 console.warn("[Modal.setup] Language select element not found.");
            }

            if (DOMElements.fontSelect) {
                DOMElements.fontSelect.value = state.currentFontSet; // Set initial value
                try {
                    // Store the instance in state (optional but good practice)
                    state.fontChoiceInstance = new Choices(DOMElements.fontSelect, {
                        searchEnabled: false,
                        itemSelectText: 'Select', // This might need translation key
                        allowHTML: false,
                        shouldSort: false,
                        placeholder: false, 
                        removeItemButton: false,
                        addItemFilter: () => false // Explicitly disable adding items
                    });
                    console.log("[Modal.setup] Choices.js initialized for font select.");
                } catch (error) {
                    console.error("[Modal.setup] Failed to initialize Choices.js for font select:", error);
                    state.fontChoiceInstance = null; // Ensure it's null on error
                }
                // Remove existing listener before adding
                DOMElements.fontSelect.removeEventListener('change', FontManager.handleFontChange);
                DOMElements.fontSelect.addEventListener('change', FontManager.handleFontChange);
            } else {
                 console.warn("[Modal.setup] Font select element not found.");
            }
                        if (DOMElements.startTimerModalBtn) {
                            DOMElements.startTimerModalBtn.addEventListener('click', FocusTimer.handleDurationSet);
                        } else {
                             console.warn("[Modal.setup] startTimerModalBtn not found!");
                        }
                        if (DOMElements.closeDurationModalBtn) {
                            DOMElements.closeDurationModalBtn.addEventListener('click', Modal.closeDurationModal);
                        } else {
                             console.warn("[Modal.setup] closeDurationModalBtn not found!");
                        }
                        if (DOMElements.durationInputHours || DOMElements.durationInputMinutes || DOMElements.durationInputSeconds) {
                            [DOMElements.durationInputHours, DOMElements.durationInputMinutes, DOMElements.durationInputSeconds].forEach(input => {
                                 if (input) {
                                      input.addEventListener('keypress', (e) => {
                                          if (e.key === 'Enter') {
                                               FocusTimer.handleDurationSet();
                                           }
                                      });
                                 } else {
                                      console.warn("[Modal.setup] One or more duration HMS input elements not found for Enter key listener!");
                                 }
                            });
                        } else {
                             console.warn("[Modal.setup] durationInputHours, durationInputMinutes, or durationInputSeconds not found for Enter key listener!");
                        }
                        // Close duration modal on background click
                        if (DOMElements.focusDurationModal) {
                            DOMElements.focusDurationModal.addEventListener('click', (event) => {
                                 if (event.target === DOMElements.focusDurationModal) {
                                      Modal.closeDurationModal();
                                 }
                            });
                        } else {
                             console.warn("[Modal.setup] focusDurationModal not found for background click listener!");
                        }
            console.log("[Modal.setup] Setup complete."); // Add end log
        },
        handleAction: (action, value) => {
            let success = false; // Flag to track if action likely succeeded
            let notifyKey = null; // Key for notification message
            switch (action) {
                case 'youtube':
                    const videoId = Utils.extractYoutubeId(value);
                    if (videoId) { 
                        Background.setYouTube(videoId); 
                        Background.savePreference('youtube', videoId); 
                        notifyKey = 'notify_set_youtube';
                        success = true; 
                    } else { Notify.show(Language.getText('notify_invalid_youtube'), 'error'); }
                    break;
                case 'image':
                    if (!value) { Notify.show(Language.getText('notify_enter_image_url'), 'warning'); return; }
                    Background.setImage(value);
                    Background.savePreference('image', value);
                    notifyKey = 'notify_set_image';
                    success = true; 
                    break;
                case 'video':
                      if (!value) { Notify.show(Language.getText('notify_enter_video_url'), 'warning'); return; }
                     Background.setVideo(value);
                     Background.savePreference('video', value);
                     notifyKey = 'notify_set_video';
                     success = true; 
                     break;
                case 'clear':
                    Background.clear(); Background.savePreference('none'); 
                    notifyKey = 'notify_clear_background';
                    break;
                case 'fullscreen':
                    Fullscreen.toggle(); // Toggle handles its own notifications for now
                    Modal.close(); 
                    break;
                case 'update-weather':
                    if (state.weatherEnabled) {
                        Weather.fetch(false); 
                        Notify.show(Language.getText('weather_updating'));
                    } else {
                        Notify.show(Language.getText('weather_disabled'), 'info');
                    }
                    break;
                case 'toggle-meme':
                    MemeWidget.toggle();
                    Modal.close(); 
                    break;
                case 'toggle-todo':
                    TodoWidget.toggle();
                    Modal.close(); 
                    break;
                case 'add-memo':
                    MemoManager.addMemo();
                    // Notify.show(Language.getText('notify_add_memo')); // Add key if needed
                    break;
                default:
                    console.warn(`Unknown modal action: ${action}`);
            }
            
            if (notifyKey) {
                  Notify.show(Language.getText(notifyKey), 'info');
             }

            if (success && (action === 'youtube' || action === 'image' || action === 'video')) {
                 UrlHistory.add(action, value); 
                 if (state.activeHistoryList && state.activeHistoryList.id === `${action}-history-container`) {
                      UrlHistory.populateList(action);
                 }
            }
        },
        open: () => {
            if (!DOMElements.settingsModal) return;
            DOMElements.settingsModal.style.display = 'flex';
            DOMElements.settingsModal.classList.add('visible');
            requestAnimationFrame(() => {
                 requestAnimationFrame(() => {
                      if (DOMElements.modalContent) {
                           DOMElements.modalContent.style.transform = 'scale(1)';
                           DOMElements.modalContent.style.opacity = '1';
                      }
                 });
            });
            const firstInput = DOMElements.settingsModal.querySelector('input[type="text"], select');
            firstInput?.focus();
        },
        close: () => {
            if (!DOMElements.settingsModal) return;
             if (DOMElements.modalContent) {
                 DOMElements.modalContent.style.transform = 'scale(0.95)';
                 DOMElements.modalContent.style.opacity = '0';
             }
            DOMElements.settingsModal.classList.remove('visible');
            UrlHistory.hideActiveList(); // Hide history list when modal closes
            const transitionDuration = 300;
            setTimeout(() => {
                DOMElements.settingsModal.style.display = 'none';
                 if (DOMElements.modalContent) {
                      DOMElements.modalContent.style.transform = '';
                      DOMElements.modalContent.style.opacity = '';
                 }
            }, transitionDuration);
        },
        openCompleteModal: () => {
            if (!DOMElements.focusCompleteModal) return;
            DOMElements.focusCompleteModal.style.display = 'flex';
            DOMElements.focusCompleteModal.classList.add('visible');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (DOMElements.completeModalContent) {
                        DOMElements.completeModalContent.style.transform = 'scale(1)';
                        DOMElements.completeModalContent.style.opacity = '1';
                        DOMElements.focusCompleteModal.classList.add('shake');
                        // Remove shake effect after animation
                        setTimeout(() => {
                            DOMElements.focusCompleteModal.classList.remove('shake');
                        }, 500); // Match animation duration
                    }
                });
            });
            // Focus the 'Close' button perhaps?
            DOMElements.focusCompleteModal.querySelector('[data-action="close-modal"]')?.focus();
        },

        closeCompleteModal: () => {
            if (!DOMElements.focusCompleteModal) return;
            if (DOMElements.completeModalContent) {
                DOMElements.completeModalContent.style.transform = 'scale(0.95)';
                DOMElements.completeModalContent.style.opacity = '0';
            }
            DOMElements.focusCompleteModal.classList.remove('visible');
            const transitionDuration = 300;
            setTimeout(() => {
                DOMElements.focusCompleteModal.style.display = 'none';
                if (DOMElements.completeModalContent) {
                    DOMElements.completeModalContent.style.transform = '';
                    DOMElements.completeModalContent.style.opacity = '';
                }
            }, transitionDuration);
        },
        openDurationModal: () => {
            if (!DOMElements.focusDurationModal || !DOMElements.durationInputHours || !DOMElements.durationInputMinutes || !DOMElements.durationInputSeconds) return;
            if (state.isFocusTimerActive) { // Prevent opening if timer already running
                 console.log("[Modal.openDurationModal] Timer is already active. Ignoring request.");
                 Notify.show("計時器已在運行中", "info");
                 return;
            }
            // Set current duration as default value
            const totalSeconds = state.focusTimerDuration;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if(DOMElements.durationInputHours) DOMElements.durationInputHours.value = hours;
            if(DOMElements.durationInputMinutes) DOMElements.durationInputMinutes.value = minutes;
            if(DOMElements.durationInputSeconds) DOMElements.durationInputSeconds.value = seconds;

            const initialTotalDurationSeconds = (hours * 3600) + (minutes * 60) + seconds;
            const THREE_HOURS_IN_SECONDS = 3 * 3600;
            if (initialTotalDurationSeconds > THREE_HOURS_IN_SECONDS) {
                 console.log("[Modal.openDurationModal] Initial duration > 3 hours. Starting dodge.");
                 setTimeout(() => {
                    // Animation.dodgeCursor(DOMElements.startTimerModalBtn); // REMOVED
                    // Notify.show(Language.getText('notify_duration_too_long'), 'warning', 4000); // Optional notification on open
                 }, 50); // Short delay
            } else {
                 // Animation.stopDodgeCursor(DOMElements.startTimerModalBtn); // REMOVED
            }

            DOMElements.focusDurationModal.style.display = 'flex';
            DOMElements.focusDurationModal.classList.add('visible');
            requestAnimationFrame(() => {
                 requestAnimationFrame(() => {
                      const content = DOMElements.focusDurationModal.querySelector('.modal-content');
                      if (content) {
                           content.style.transform = 'scale(1)';
                           content.style.opacity = '1';
                      }
                 });
            });
            DOMElements.durationInputHours.focus();
            DOMElements.durationInputMinutes.select(); // Select the text
            DOMElements.durationInputSeconds.select(); // Select the text
        },

        closeDurationModal: () => {
            if (!DOMElements.focusDurationModal) return;
            // Stop dodging when modal closes
            // Animation.stopDodgeCursor(DOMElements.startTimerModalBtn); // REMOVED
            const content = DOMElements.focusDurationModal.querySelector('.modal-content');
             if (content) {
                 content.style.transform = 'scale(0.95)';
                 content.style.opacity = '0';
             }
            DOMElements.focusDurationModal.classList.remove('visible');
            const transitionDuration = 300;
            setTimeout(() => {
                DOMElements.focusDurationModal.style.display = 'none';
                 if (content) {
                      content.style.transform = '';
                      content.style.opacity = '';
                 }
            }, transitionDuration);
        },
    };

    const DragDrop = {
         setup: () => {
             if(document.body) {
                 document.body.addEventListener('dragover', DragDrop.handleDragOver);
                 document.body.addEventListener('dragleave', DragDrop.handleDragLeave);
                 document.body.addEventListener('drop', DragDrop.handleDrop);
             } else {
                 document.addEventListener('DOMContentLoaded', () => {
                      if(document.body) {
                          document.body.addEventListener('dragover', DragDrop.handleDragOver);
                          document.body.addEventListener('dragleave', DragDrop.handleDragLeave);
                          document.body.addEventListener('drop', DragDrop.handleDrop);
                      }
                 });
             }
         },
        handleDragOver: (e) => { e.preventDefault(); if(document.body) document.body.style.opacity = '0.7'; },
        handleDragLeave: () => { if(document.body) document.body.style.opacity = '1'; },
        handleDrop: (e) => {
            e.preventDefault(); if(document.body) document.body.style.opacity = '1';
            if (e.dataTransfer.files.length > 0) DragDrop.handleFile(e.dataTransfer.files[0]);
        },
        handleFile: (file) => {
            const fileType = file.type.split('/')[0];
            const objectURL = URL.createObjectURL(file);
            if (fileType === 'video') { 
                Background.setVideo(objectURL); 
                Notify.show(`影片 "${file.name}" 已設為背景 (僅限本次)`); 
            }
            else if (fileType === 'image') { 
                Background.setImage(objectURL); 
                Notify.show(`圖片 "${file.name}" 已設為背景 (僅限本次)`); 
            }
            else { 
                Notify.show('不支持的文件類型', 'error'); 
                URL.revokeObjectURL(objectURL); 
            }
        }
    };

    const Fullscreen = {
        toggle: () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen()
                    .then(() => Notify.show(Language.getText('notify_fullscreen_enter')))
                    .catch(err => Notify.show(`無法進入全螢幕: ${err.message}`, 'error'));
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                        .then(() => Notify.show(Language.getText('notify_fullscreen_exit')))
                        .catch(err => Notify.show(`無法退出全螢幕: ${err.message}`, 'error'));
                }
            }
        }
    };

     const Keyboard = {
         setup: () => { document.addEventListener('keydown', Keyboard.handleKeyDown); },
         handleKeyDown: (e) => {
             if (!DOMElements.settingsModal) return; // Should probably check for other essential elements too
             const isModalVisible = DOMElements.settingsModal.classList.contains('visible');
             
             // Close modal with Escape key regardless of focus
             if (e.key === 'Escape') { 
                 if (isModalVisible) Modal.close(); 
                 e.preventDefault(); 
                 return; 
             }

             // **Simplified check: Prevent ALL shortcuts if typing in ANY input or textarea**
             const targetTagName = e.target.tagName;
             if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA') {
                 // Allow specific inputs if needed in the future, but for now, block all
                 console.log("[Keyboard] Input focus detected, blocking shortcut.");
                 return; 
             }

             // Keep the modal visibility check for 'h' key if needed, 
             // but the input check above should already handle focus within the modal.
             // const isInsideModal = isModalVisible && DOMElements.settingsModal.contains(e.target);
             // if (isInsideModal) { return; } // This check is likely redundant now

             const key = e.key.toLowerCase();
             switch (key) {
                 case 'h': 
                     // Toggle modal - This might still be desired even if not typing?
                     // Let's keep it for now.
                     if (isModalVisible) Modal.close(); else Modal.open(); 
                     e.preventDefault(); break;
                 case 'f': Fullscreen.toggle(); e.preventDefault(); break;
                 case 'w': Weather.fetch(false); Notify.show('正在更新天氣資訊'); e.preventDefault(); break;
                 case 'm': MemeWidget.toggle(); e.preventDefault(); break;
                 case 't': TodoWidget.toggle(); e.preventDefault(); break;
                 case 'n': MemoManager.addMemo(); e.preventDefault(); break; 
             }
         }
     };

    const initialAnimation = () => {
         const targets = [DOMElements.date, DOMElements.clock, DOMElements.weather].filter(el => el);
         if (targets.length > 0) {
             anime({ targets: targets, translateY: [20, 0], opacity: [0, 1], delay: anime.stagger(150, { start: 300 }), duration: 1000, easing: 'easeOutCubic' });
         }
    };

    const ContextMenu = {
        menuElement: null,
        isVisible: false,

        // Updated menu items
        /* // Original Items for reference
        menuItems: [
            { key: 'context_add_memo' },
            { key: 'context_toggle_todo' },
            { separator: true }, 
            { key: 'context_fullscreen' },
            { key: 'context_update_weather' },
            { separator: true }, 
            { key: 'context_settings' }
        ],
        */
        // New structure with timer actions
         menuActions: {
             'start-timer': { textKey: 'focus_timer_start_title', icon: '⏱️', requires: '!isFocusTimerActive' },
             'stop-timer': { textKey: 'focus_timer_cancel_title', icon: '⏹️', requires: 'isFocusTimerActive' },
             'separator1': { separator: true },
             'add-memo': { textKey: 'context_add_memo', icon: '📝' },
             'toggle-todo': { textKey: 'context_toggle_todo', icon: '✅' },
             'separator2': { separator: true },
             'fullscreen': { textKey: 'context_fullscreen', icon: ' F' }, // Use F for fullscreen
             'update-weather': { textKey: 'context_update_weather', icon: '☀️', requires: 'weatherEnabled' },
             'separator3': { separator: true },
             'settings': { textKey: 'context_settings', icon: '⚙️' },
         },

        createMenu: (forceRecreate = false) => {
            // Only recreate if forced (e.g., language change) or not created yet
            if (ContextMenu.menuElement && !forceRecreate) return; 
            if (ContextMenu.menuElement && forceRecreate) {
                 ContextMenu.menuElement.remove();
                 ContextMenu.menuElement = null;
            }

            ContextMenu.menuElement = document.createElement('div');
            ContextMenu.menuElement.id = 'context-menu';

            // Build menu from menuActions
            for (const actionId in ContextMenu.menuActions) {
                 const itemConfig = ContextMenu.menuActions[actionId];
                 if (itemConfig.separator) {
                     const separator = document.createElement('div');
                     separator.className = 'context-menu-separator';
                     ContextMenu.menuElement.appendChild(separator);
                 } else {
                     const menuItem = document.createElement('div');
                     menuItem.className = 'context-menu-item';
                     menuItem.textContent = Language.getText(itemConfig.textKey) || itemConfig.textKey; // Use translated text
                     menuItem.dataset.action = actionId;
                     if (itemConfig.icon) {
                        // Set icon using ::before content in CSS based on data-action
                     }
                     menuItem.addEventListener('click', ContextMenu.handleItemClick);
                     ContextMenu.menuElement.appendChild(menuItem);
                 }
            }

            document.body.appendChild(ContextMenu.menuElement);
        },

        showMenu: (event) => {
            event.preventDefault(); // Prevent native context menu
            if (!ContextMenu.menuElement) ContextMenu.createMenu();

            // Basic check to avoid showing menu over interactive elements
            if (event.target.closest('button, input, textarea, select, a, .widget-header, .memo-note, .resize-handle')) {
                ContextMenu.hideMenu(); 
                return;
            }

             for (const actionId in ContextMenu.menuActions) {
                 const itemConfig = ContextMenu.menuActions[actionId];
                 const menuItemElement = ContextMenu.menuElement.querySelector(`[data-action="${actionId}"]`);
                 if (!menuItemElement || itemConfig.separator) continue; // Skip separators or non-existent elements

                 let shouldBeEnabled = true;
                 let shouldBeVisible = true;

                 if (itemConfig.requires) {
                     switch (itemConfig.requires) {
                         case 'weatherEnabled':
                             shouldBeEnabled = state.weatherEnabled;
                             break;
                         case 'isFocusTimerActive':
                             // This item should ONLY be visible/enabled if timer IS active
                             shouldBeVisible = state.isFocusTimerActive;
                             break;
                         case '!isFocusTimerActive':
                             // This item should ONLY be visible/enabled if timer IS NOT active
                             shouldBeVisible = !state.isFocusTimerActive;
                             break;
                     }
                 }
                 
                 // Apply visibility and enabled/disabled state
                 menuItemElement.style.display = shouldBeVisible ? '' : 'none';
                 menuItemElement.classList.toggle('disabled', !shouldBeEnabled);
             }

            const x = event.clientX;
            const y = event.clientY;
            const menu = ContextMenu.menuElement;

            menu.style.display = 'block';
            ContextMenu.isVisible = true;

            // Adjust position if menu goes off-screen
            const menuWidth = menu.offsetWidth;
            const menuHeight = menu.offsetHeight;
            const vpWidth = window.innerWidth;
            const vpHeight = window.innerHeight;

            const finalX = (x + menuWidth > vpWidth) ? vpWidth - menuWidth - 5 : x;
            const finalY = (y + menuHeight > vpHeight) ? vpHeight - menuHeight - 5 : y;

            menu.style.left = `${finalX}px`;
            menu.style.top = `${finalY}px`;

             setTimeout(() => {
                 document.addEventListener('click', ContextMenu.handleClickOutside, { once: true });
                 document.addEventListener('scroll', ContextMenu.hideMenu, { once: true, capture: true }); 
             }, 0);
        },

        hideMenu: () => {
            if (ContextMenu.isVisible && ContextMenu.menuElement) {
                ContextMenu.menuElement.style.display = 'none';
                ContextMenu.isVisible = false;
                // Clean up listeners if needed (handleClickOutside has {once: true})
                document.removeEventListener('scroll', ContextMenu.hideMenu, { once: true, capture: true });
            }
        },

        handleClickOutside: (event) => {
            if (ContextMenu.isVisible && ContextMenu.menuElement && !ContextMenu.menuElement.contains(event.target)) {
                ContextMenu.hideMenu();
            }
            // If the click was inside, the item handler will take over (and might hide)
        },

        handleItemClick: (event) => {
            const clickedItem = event.currentTarget;
            if (clickedItem.classList.contains('disabled')) {
                return; // Do nothing if disabled
            }

            const action = clickedItem.dataset.action;
            ContextMenu.hideMenu(); // Hide menu after action

            switch (action) {
                case 'start-timer':
                    // FocusTimer.promptAndStart(); // REMOVED
                    Modal.openDurationModal(); // Open the new modal instead
                    break;
                case 'stop-timer':
                    FocusTimer.stopTimer();
                    break;
                case 'add-memo':
                    MemoManager.addMemo();
                    break;
                case 'toggle-todo':
                    TodoWidget.toggle();
                    break;
                case 'fullscreen':
                    Fullscreen.toggle();
                    break;
                case 'update-weather':
                    // No need to check state.weatherEnabled here again as disabled check handles it
                    Weather.fetch(false); 
                    Notify.show('正在更新天氣資訊');
                    break;
                case 'settings':
                    Modal.open();
                    break;
                default:
                    console.warn(`Unknown context menu action: ${action}`);
            }
        },

        setup: () => {
            ContextMenu.createMenu(); // Create menu structure on load
            document.addEventListener('contextmenu', ContextMenu.showMenu);
        }
    };

    const UrlHistory = {
        HISTORY_KEYS: {
            youtube: 'youtubeUrlHistory',
            image: 'imageUrlHistory',
            video: 'videoUrlHistory'
        },

        loadAll: () => {
            for (const type in UrlHistory.HISTORY_KEYS) {
                const key = UrlHistory.HISTORY_KEYS[type];
                const savedHistory = localStorage.getItem(key);
                if (savedHistory) {
                    try {
                        state[type + 'History'] = JSON.parse(savedHistory);
                    } catch (e) {
                        console.error(`[UrlHistory] Error parsing saved ${type} history:`, e);
                        state[type + 'History'] = [];
                        localStorage.removeItem(key); // Remove corrupted data
                    }
                } else {
                    state[type + 'History'] = [];
                }
            }
        },

        add: (type, url) => {
            if (!type || !url || !UrlHistory.HISTORY_KEYS[type]) return;
            
             // For youtube, ensure we store the original input URL/ID, not just extracted ID if needed
             // Current implementation stores the exact string passed

            const historyKey = type + 'History';
            let historyArray = state[historyKey] || [];

            // Remove existing entry if present
            historyArray = historyArray.filter(item => item !== url);

            historyArray.unshift(url);

            // Trim array to max size
            if (historyArray.length > MAX_HISTORY_SIZE) {
                historyArray = historyArray.slice(0, MAX_HISTORY_SIZE);
            }

            state[historyKey] = historyArray;
            try {
                localStorage.setItem(UrlHistory.HISTORY_KEYS[type], JSON.stringify(historyArray));
            } catch (e) {
                console.error(`[UrlHistory] Error saving ${type} history:`, e);
            }
        },

        populateList: (type, filteredHistory) => {
            const listId = `${type}-history-list`;
            const listElement = document.getElementById(listId);
            const historyToDisplay = filteredHistory !== undefined ? filteredHistory : (state[type + 'History'] || []);

            if (!listElement) {
                console.error(`[UrlHistory] List element not found: #${listId}`);
                return;
            }

            listElement.innerHTML = ''; // Clear previous items

            if (historyToDisplay.length === 0) {
                // Don't show "no history" when filtering, only when showing full list and it's empty?
                // Or maybe always hide the container if empty.
                // For now, let's just not add the placeholder when filtering might be active.
                if (filteredHistory === undefined && (state[type + 'History'] || []).length === 0) {
                     const li = document.createElement('li');
                     li.textContent = Language.getText('history_empty');
                     li.style.fontStyle = 'italic';
                     li.style.opacity = '0.6';
                     li.classList.add('no-hover'); // Prevent hover effect
                     listElement.appendChild(li);
                }
                return historyToDisplay.length; // Return count
            }

            historyToDisplay.forEach(url => {
                const li = document.createElement('li');
                li.textContent = url;
                li.title = url; 
                li.dataset.url = url;
                li.addEventListener('mousedown', (event) => { // Use mousedown to potentially fire before blur
                    event.preventDefault(); // Prevent input blur if possible
                    const selectedUrl = event.currentTarget.dataset.url;
                    const inputId = `${type}-input`;
                    const inputElement = document.getElementById(inputId);
                    if (inputElement && selectedUrl) {
                        inputElement.value = selectedUrl;
                        inputElement.focus(); // Keep focus or refocus
                        UrlHistory.hideActiveList(); // Hide list after selection
                    } else {
                        console.error(`[UrlHistory] Could not find input #${inputId} or URL missing for selection.`);
                    }
                });
                listElement.appendChild(li);
            });
            return historyToDisplay.length; // Return count
        },
        
        hideActiveList: () => {
            if (state.historyHideTimeout) {
                 clearTimeout(state.historyHideTimeout);
                 state.historyHideTimeout = null;
            }
            if (state.activeHistoryList) {
                 state.activeHistoryList.classList.add('hidden');
                 state.activeHistoryList = null;
            }
        },
        
        showList: (type) => {
             const containerId = `${type}-history-container`;
             const containerElement = document.getElementById(containerId);
             if (!containerElement) return;
             
             if (state.activeHistoryList && state.activeHistoryList !== containerElement) {
                  UrlHistory.hideActiveList();
             }
             
             containerElement.classList.remove('hidden');
             state.activeHistoryList = containerElement;
        },

        // Removed handleClickOutside
        // Removed toggleList
        
        handleInput: (event, type) => {
             const inputElement = event.target;
             const value = inputElement.value.toLowerCase();
             const fullHistory = state[type + 'History'] || [];
             let filteredHistory = [];

             if (value) {
                 filteredHistory = fullHistory.filter(url => url.toLowerCase().includes(value));
             }
             // If input is not empty, populate with filtered results
             // If input is empty, maybe hide or show full history? Let's hide for now.
             const itemCount = UrlHistory.populateList(type, filteredHistory);

             if (itemCount > 0) {
                 UrlHistory.showList(type);
             } else {
                 UrlHistory.hideActiveList();
             }
        },
        
        handleFocus: (event, type) => {
             if (state.historyHideTimeout) { // Clear any pending hide timeout
                 clearTimeout(state.historyHideTimeout);
                 state.historyHideTimeout = null;
             }
             // Show full history on focus
             const itemCount = UrlHistory.populateList(type); // Populate with full history
             if (itemCount > 0) {
                 UrlHistory.showList(type);
             } else {
                  // For consistency, let's hide it if populateList returned 0 items.
                 UrlHistory.hideActiveList(); 
             }
        },
        
        handleBlur: (event, type) => {
             state.historyHideTimeout = setTimeout(() => {
                 UrlHistory.hideActiveList();
                 state.historyHideTimeout = null;
             }, 150); // 150ms delay
        }

    };

    const FontManager = {
        FONT_CLASSES: ['font-default', 'font-opensans', 'font-serif', 'font-system'], // Available font classes
        DEFAULT_FONT_SET: 'default',

        loadPreference: () => {
            const savedFontSet = localStorage.getItem('fontPreference');
            if (savedFontSet && FontManager.FONT_CLASSES.includes(`font-${savedFontSet}`)) {
                state.currentFontSet = savedFontSet;
            } else {
                state.currentFontSet = FontManager.DEFAULT_FONT_SET;
                if (savedFontSet) localStorage.removeItem('fontPreference'); // Clear invalid preference
            }
            FontManager.applyFontClass(); // Apply the class to body
        },

        savePreference: () => {
            localStorage.setItem('fontPreference', state.currentFontSet);
        },

        applyFontClass: () => {
            const body = document.body;
            // Remove any existing font classes
            FontManager.FONT_CLASSES.forEach(cls => body.classList.remove(cls));
            const newClass = `font-${state.currentFontSet}`;
            if (FontManager.FONT_CLASSES.includes(newClass)) {
                body.classList.add(newClass);
            } else {
                console.warn(`[FontManager] Attempted to apply invalid font class: ${newClass}. Applying default.`);
                body.classList.add(`font-${FontManager.DEFAULT_FONT_SET}`);
                state.currentFontSet = FontManager.DEFAULT_FONT_SET; // Reset state if invalid was attempted
            }
        },

        reinitializeChoices: () => {
            if (state.fontChoiceInstance) {
                try {
                    state.fontChoiceInstance.destroy();
                } catch (e) {
                    console.error("[FontManager] Error destroying font Choices instance:", e);
                }
                state.fontChoiceInstance = null;
            }

            const selectElement = DOMElements.fontSelect;
            if (!selectElement) {
                console.error("[FontManager] Font select element not found for reinitialization.");
                return;
            }

            // Set the native select value BEFORE initializing Choices.js
            selectElement.value = state.currentFontSet;

            try {
                state.fontChoiceInstance = new Choices(selectElement, {
                    searchEnabled: false,
                    itemSelectText: 'Select', // Use translated text? Need key if so
                    allowHTML: false,
                    shouldSort: false,
                    placeholder: false,
                    removeItemButton: false,
                    addItemFilter: () => false
                });
            } catch (error) {
                console.error("[FontManager] Failed to reinitialize Choices.js for font select:", error);
                state.fontChoiceInstance = null;
            }
        },

        handleFontChange: (event) => {
            const newFontSet = event.target.value;
            if (newFontSet && newFontSet !== state.currentFontSet) {
                if (FontManager.FONT_CLASSES.includes(`font-${newFontSet}`)) {
                    state.currentFontSet = newFontSet;
                    FontManager.savePreference();
                    FontManager.applyFontClass();
                    // Remove setValue, call reinitialize instead
                    FontManager.reinitializeChoices(); 
                    /* // Remove this block
                    if (state.fontChoiceInstance) {
                         try {
                              state.fontChoiceInstance.setValue([newFontSet]); // Restore this line
                         } catch (e) { console.error("Error updating font Choices instance value:", e); }
                    }
                    */
                } else {
                     console.warn(`[FontManager] Invalid font set value selected: ${newFontSet}`);
                     // Reset dropdown by reinitializing with current state
                     FontManager.reinitializeChoices(); 
                }
            } else {
            }
        }
    };

    const FocusTimer = {
        DEFAULT_DURATION_MINUTES: 25,

        formatTime: (totalSeconds) => {
            if (totalSeconds < 0) totalSeconds = 0;
            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        },

        startTimerInternal: (durationSeconds) => {
            if (state.isFocusTimerActive) return;

            state.isFocusTimerActive = true;
            state.focusTimerEndTime = Date.now() + durationSeconds * 1000;

            // Stop the regular clock updates
            if (state.clockUpdateInterval) {
                clearInterval(state.clockUpdateInterval);
                state.clockUpdateInterval = null; // Clear state variable too
                console.log('[FocusTimer.start] Cleared Clock interval.');
            }
            
            // Show the cancel button - REMOVED
            // if (DOMElements.cancelTimerBtn) DOMElements.cancelTimerBtn.classList.remove('hidden');

            /*
            if (DOMElements.focusTimerBtn) {
                DOMElements.focusTimerBtn.classList.add('active');
                DOMElements.focusTimerBtn.title = Language.getText('focus_timer_cancel_title');
                DOMElements.focusTimerBtn.querySelector('.icon').textContent = '⏹️';
            }
            */

            // Start the focus timer update interval
            FocusTimer.updateDisplay(); // Initial display update
            if (state.focusTimerInterval) clearInterval(state.focusTimerInterval);
            state.focusTimerInterval = setInterval(FocusTimer.updateDisplay, 1000);
            console.log('[FocusTimer.start] Started focus timer interval.');
        },

        stopTimer: () => { // Removed showClock parameter, always restart clock
            console.log('[FocusTimer.stop] === Stop Timer Called === Current focus interval:', state.focusTimerInterval); // ADDED LOG
            if (state.focusTimerInterval) {
                clearInterval(state.focusTimerInterval);
                console.log('[FocusTimer.stop] Focus Interval cleared.');
                state.focusTimerInterval = null;
            }
            state.isFocusTimerActive = false;
            state.focusTimerEndTime = null;

            // if (DOMElements.cancelTimerBtn) DOMElements.cancelTimerBtn.classList.add('hidden');

            // Restart the regular clock updates
            Clock.start(); // Clock.start handles clearing/setting its own interval
            console.log('[FocusTimer.stop] Restarted Clock.');
            
            // Reset button appearance & title
            if (DOMElements.focusTimerBtn) {
                 DOMElements.focusTimerBtn.classList.remove('active');
                 DOMElements.focusTimerBtn.title = Language.getText('focus_timer_start_title');
                 DOMElements.focusTimerBtn.querySelector('.icon').textContent = '⏱️';
            }
            document.title = Language.getText('page_title');
            console.log('[FocusTimer.stop] === Stop Timer Finished ==='); // ADDED LOG
        },

        updateDisplay: () => {
            if (!state.isFocusTimerActive) {
                return; // Exit early if timer is not active
            }

            const now = Date.now();
            const endTime = state.focusTimerEndTime || now;
            const remainingSeconds = Math.round((endTime - now) / 1000);
            
            if (remainingSeconds <= 0) {
                 console.log(`[FocusTimer.update] Remaining seconds <= 0 (${remainingSeconds}). Calling completeTimer.`);
                 FocusTimer.completeTimer();
                 return; // Timer completed, exit function
            }

            // Removed the hover check - always display timer if active and not completed
            const timeString = FocusTimer.formatTime(remainingSeconds);

            if (DOMElements.clock) {
                DOMElements.clock.textContent = timeString;
            } else {
                console.warn('[FocusTimer.update] clock element not found!');
            }

            document.title = `${timeString} - ${Language.getText('page_title')}`;
        }, // End of updateDisplay function

        completeTimer: () => {
            console.log('[FocusTimer.complete] === Complete Timer Called ==='); // ADDED LOG
            FocusTimer.stopTimer(); // Stop timer and restart clock
            Modal.openCompleteModal();
            // Optional: Play sound
        },

        setup: () => {
            // Main Timer Button - REMOVED
            /*
            if (DOMElements.focusTimerBtn) {
                console.log('[FocusTimer.setup] Adding listener to focusTimerBtn');
                DOMElements.focusTimerBtn.addEventListener('click', FocusTimer.toggleTimer); // Now promptAndStart
            }
            */

            // Cancel Button - REMOVED
            /*
            const cancelBtn = DOMElements.cancelTimerBtn;
            if (cancelBtn) {
                console.log('[FocusTimer.setup] Adding listener to cancelTimerBtn');
                cancelBtn.addEventListener('click', () => {
                    console.log('[FocusTimer.setup] cancelTimerBtn clicked!');
                    FocusTimer.stopTimer();
                });
                cancelBtn.innerHTML = Language.getText('focus_timer_cancel_button') || '⏹️ Cancel';
            } else {
                console.warn('[FocusTimer.setup] cancelTimerBtn element NOT found!');
            }
            */
            
            // Remove Hover listeners
            // const timerDisplayEl = DOMElements.timerDisplay; 
            // const clockEl = DOMElements.clock; 
            // if (timerDisplayEl && clockEl) { ... remove listeners ... }

            const clockEl = DOMElements.clock; // The <p> element
            if (clockEl) {
                console.log('[FocusTimer.setup] Adding hover listeners to clock <p>');
                clockEl.addEventListener('mouseenter', () => {
                    console.log('[FocusTimer Hover] Mouse Enter Clock <p>');
                    if (state.isFocusTimerActive) { 
                        state.isHoveringClock = true;
                        console.log('[FocusTimer Hover] Set isHoveringClock = true');
                        FocusTimer.updateDisplay(); // Immediately update display
                    }
                });
                clockEl.addEventListener('mouseleave', () => {
                    console.log('[FocusTimer Hover] Mouse Leave Clock <p>');
                    state.isHoveringClock = false;
                    console.log('[FocusTimer Hover] Set isHoveringClock = false');
                    if (state.isFocusTimerActive) { 
                        FocusTimer.updateDisplay(); // Immediately update display
                    }
                });
            } else {
                 console.warn('[FocusTimer.setup] Could not find clock element for hover listeners.');
            }
            
            console.log('[FocusTimer.setup] Setting up Completion Modal buttons...'); // ADDED LOG
            if (DOMElements.closeCompleteModalBtn) {
                console.log('[FocusTimer.setup] Found closeCompleteModalBtn, adding listener.'); // ADDED LOG
                DOMElements.closeCompleteModalBtn.addEventListener('click', Modal.closeCompleteModal);
            } else {
                 console.warn('[FocusTimer.setup] closeCompleteModalBtn not found!'); // ADDED LOG
            }
            if (DOMElements.completeModalButtons && DOMElements.completeModalButtons.length > 0) {
                console.log(`[FocusTimer.setup] Found ${DOMElements.completeModalButtons.length} completeModalButtons, adding listeners...`); // ADDED LOG
                DOMElements.completeModalButtons.forEach(btn => {
                    const action = btn.dataset.action;
                    console.log(`[FocusTimer.setup] Adding listener for action: ${action} to button:`, btn); // ADDED LOG
                    btn.addEventListener('click', () => {
                         console.log(`[FocusTimer.setup] Completion modal button clicked: ${action}`); // ADDED LOG
                        if (action === 'restart-timer') {
                            Modal.closeCompleteModal();
                            // Get duration again (maybe prompt or use last value?)
                            const lastDurationSeconds = state.focusTimerDuration; // Reuse last duration
                            FocusTimer.startTimerInternal(lastDurationSeconds);
                        } else if (action === 'close-modal') {
                            Modal.closeCompleteModal();
                        }
                    });
                });
            } else {
                 console.warn('[FocusTimer.setup] completeModalButtons collection not found or empty!'); // ADDED LOG
            }

        },

        toggleTimer: () => {
            if (state.isFocusTimerActive) {
                // Timer is running, clicking main button should do nothing.
                console.log('[FocusTimer.toggleTimer] Timer is already active. Click ignored. Use Cancel button to stop.');
                // FocusTimer.stopTimer(); // REMOVED THIS LINE
                return; // Stop further execution in this function
            } else {
                const defaultMinutes = state.focusTimerDuration / 60;
                const promptMessage = Language.getText('focus_prompt_message') || 'Enter focus duration (minutes):';
                const userInput = prompt(promptMessage, defaultMinutes);

                if (userInput === null) {
                    return;
                }

                const durationMinutes = parseInt(userInput, 10);

                if (isNaN(durationMinutes) || durationMinutes < 1 || durationMinutes > 120) {
                    Notify.show(Language.getText('notify_invalid_duration_prompt') || 'Invalid input. Please enter a number between 1 and 120.', 'error');
                    console.warn(`[FocusTimer] Invalid duration input: ${userInput}`);
                } else {
                    const durationSeconds = durationMinutes * 60;
                    state.focusTimerDuration = durationSeconds; // Update state (already in seconds)
                    localStorage.setItem('focusTimerDuration', durationSeconds);
                    FocusTimer.startTimerInternal(durationSeconds); // Pass seconds
                }
            }
        },

        handleDurationSet: () => {
            // Read values from the three input fields
            const hoursInput = DOMElements.durationInputHours;
            const minutesInput = DOMElements.durationInputMinutes;
            const secondsInput = DOMElements.durationInputSeconds;

            if (!hoursInput || !minutesInput || !secondsInput) {
                console.error("[FocusTimer.handleDurationSet] Duration input elements not found!");
                return;
            }

            const hours = parseInt(hoursInput.value, 10) || 0;
            const minutes = parseInt(minutesInput.value, 10) || 0;
            const seconds = parseInt(secondsInput.value, 10) || 0;

            // Validate input values
            if (
                isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
                hours < 0 || 
                minutes < 0 || minutes > 59 || 
                seconds < 0 || seconds > 59 ||
                (hours === 0 && minutes === 0 && seconds === 0) // Total duration must be > 0
            ) {
                Notify.show(Language.getText('notify_invalid_hms_input') || 'Invalid HMS input', 'error');
                console.warn(`[FocusTimer] Invalid duration input from modal: H=${hoursInput.value}, M=${minutesInput.value}, S=${secondsInput.value}`);
                // Focus the first invalid field?
                if (isNaN(parseInt(hoursInput.value, 10)) || parseInt(hoursInput.value, 10) < 0) hoursInput.focus();
                else if (isNaN(parseInt(minutesInput.value, 10)) || parseInt(minutesInput.value, 10) < 0 || parseInt(minutesInput.value, 10) > 59) minutesInput.focus();
                else secondsInput.focus();
                
                // Shake the modal
                if (DOMElements.focusDurationModal) {
                    DOMElements.focusDurationModal.classList.add('shake');
                    setTimeout(() => { DOMElements.focusDurationModal.classList.remove('shake'); }, 500);
                }
            } else {
                const totalDurationSeconds = (hours * 3600) + (minutes * 60) + seconds;
                const THREE_HOURS_IN_SECONDS = 3 * 3600;

                if (totalDurationSeconds > THREE_HOURS_IN_SECONDS) {
                    // Duration is too long - activate dodge!
                    Notify.show(Language.getText('notify_duration_too_long'), 'warning', 4000);
                    // Animation.dodgeCursor(DOMElements.startTimerModalBtn); // REMOVED
                    // DO NOT start timer or close modal
                } else {
                    // Duration is acceptable - stop any dodging and proceed
                    // Animation.stopDodgeCursor(DOMElements.startTimerModalBtn); // REMOVED

                    state.focusTimerDuration = totalDurationSeconds; 
                    localStorage.setItem('focusTimerDuration', totalDurationSeconds);
                    Notify.show(`${Language.getText('notify_duration_saved')}`, 'info');
                    FocusTimer.startTimerInternal(totalDurationSeconds);
                    Modal.closeDurationModal(); 
                }
           }
       },

       handleDurationInput: () => {
            const hoursInput = DOMElements.durationInputHours;
            const minutesInput = DOMElements.durationInputMinutes;
            const secondsInput = DOMElements.durationInputSeconds;
            if (!hoursInput || !minutesInput || !secondsInput) return;

            const hours = parseInt(hoursInput.value, 10) || 0;
            const minutes = parseInt(minutesInput.value, 10) || 0;
            const seconds = parseInt(secondsInput.value, 10) || 0;
            const totalDurationSeconds = (hours * 3600) + (minutes * 60) + seconds;
            const THREE_HOURS_IN_SECONDS = 3 * 3600;

            if (totalDurationSeconds <= THREE_HOURS_IN_SECONDS && Animation.isDodging) {
                Animation.stopDodgeCursor(DOMElements.startTimerModalBtn);
            } else if (totalDurationSeconds > THREE_HOURS_IN_SECONDS && !Animation.isDodging) {
                // Start dodging if duration becomes > 3 hours
                Animation.dodgeCursor(DOMElements.startTimerModalBtn);
                // Notify.show(Language.getText('notify_duration_too_long'), 'warning', 4000);
            }
       }
    };

    const Animation = {
        isDodging: false, // Track if dodging is active
        dodgeListener: null, // Store the listener function
        originalTransform: '', // Store original transform

        dodgeCursor: (buttonElement) => {
            if (!buttonElement || Animation.isDodging) return;
            const modalContent = DOMElements.focusDurationModal?.querySelector('.modal-content');
            if (!modalContent) return;

            console.log("[Animation] Starting continuous dodgeCursor");
            Animation.isDodging = true;
            Animation.originalTransform = buttonElement.style.transform || ''; // Store original
            buttonElement.style.transition = 'transform 0.1s linear'; // Optional: Use CSS transition for smoother immediate movement?

            const SAFE_RADIUS = 180; // Pixels
            const REPEL_STRENGTH = 1; // How strongly it moves away

            Animation.dodgeListener = (event) => {
                const buttonRect = buttonElement.getBoundingClientRect();
                const buttonCenterX = buttonRect.left + buttonRect.width / 2;
                const buttonCenterY = buttonRect.top + buttonRect.height / 2;

                const cursorX = event.clientX;
                const cursorY = event.clientY;

                const dx = buttonCenterX - cursorX;
                const dy = buttonCenterY - cursorY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let targetTranslateX = 0;
                let targetTranslateY = 0;

                if (distance < SAFE_RADIUS && distance > 0) { // distance > 0 prevents division by zero
                    const repelDistance = SAFE_RADIUS - distance;
                    // Calculate unit vector pointing away from cursor
                    const unitX = dx / distance;
                    const unitY = dy / distance;

                    targetTranslateX = unitX * repelDistance * REPEL_STRENGTH;
                    targetTranslateY = unitY * repelDistance * REPEL_STRENGTH;
                    
                    // Get current transform values to animate FROM
                    const currentTransform = buttonElement.style.transform;
                    let currentX = 0, currentY = 0;
                    const match = currentTransform.match(/translateX\(([^)]+)\) translateY\(([^)]+)\)/);
                    if(match){
                        currentX = parseFloat(match[1]) || 0;
                        currentY = parseFloat(match[2]) || 0;
                    }

                    anime.remove(buttonElement); // Stop previous animation on this target
                    anime({
                        targets: buttonElement,
                        translateX: [currentX, targetTranslateX], // Animate from current to target
                        translateY: [currentY, targetTranslateY],
                        duration: 100, // Short duration for responsiveness
                        easing: 'linear' // Linear for direct reaction
                    });
                } else {
                    // Optional: If far away, smoothly return to origin?
                    const currentTransform = buttonElement.style.transform;
                     if (currentTransform && currentTransform !== 'translateX(0px) translateY(0px)') {
                        anime.remove(buttonElement); // Stop previous animation
                        anime({
                            targets: buttonElement,
                            translateX: 0,
                            translateY: 0,
                            duration: 300, // Slower return
                            easing: 'easeOutQuad'
                        });
                    }
                }
            };

            modalContent.addEventListener('mousemove', Animation.dodgeListener);
            // modalContent.addEventListener('mouseleave', () => Animation.stopDodgeCursor(buttonElement)); // Could be abrupt
        },

        stopDodgeCursor: (buttonElement) => {
            if (!buttonElement || !Animation.isDodging) return;
             const modalContent = DOMElements.focusDurationModal?.querySelector('.modal-content');
            
            console.log("[Animation] Stopping continuous dodgeCursor");
            Animation.isDodging = false;
            buttonElement.style.transition = ''; // Remove temporary CSS transition

            if (Animation.dodgeListener && modalContent) {
                modalContent.removeEventListener('mousemove', Animation.dodgeListener);
                Animation.dodgeListener = null;
            }
            
            // Animate back to original position (remove transform)
            anime.remove(buttonElement); // Stop any active animation
            anime({
                targets: buttonElement,
                translateX: 0,
                translateY: 0,
                duration: 200,
                easing: 'easeOutQuad'
                // transform: Animation.originalTransform // Restore original fully?
            });
        }
    };

    const init = async () => {
        Language.loadPreference(); // Load language preference first
        FontManager.loadPreference(); // Load font preference

        const savedDuration = localStorage.getItem('focusTimerDuration');
        state.focusTimerDuration = parseInt(savedDuration, 10) || (FocusTimer.DEFAULT_DURATION_MINUTES * 60);
        // Corrected Validation:
        const MAX_DURATION_SECONDS = (99 * 3600) + (59 * 60) + 59; // 99:59:59
        if (isNaN(state.focusTimerDuration) || state.focusTimerDuration < 1 || state.focusTimerDuration > MAX_DURATION_SECONDS) {
            console.warn(`[App.init] Invalid saved duration (${savedDuration}). Resetting to default.`); // Added warning
            state.focusTimerDuration = FocusTimer.DEFAULT_DURATION_MINUTES * 60;
            localStorage.removeItem('focusTimerDuration'); // Clear invalid item
        }
        console.log(`[App.init] Loaded Focus Timer Duration: ${state.focusTimerDuration} seconds (${state.focusTimerDuration / 60} minutes)`); // Log seconds too
        // No need to set input field value anymore
        // if (DOMElements.focusDurationInput) { ... }

        try {
            const savedPositions = localStorage.getItem('widgetPositions');
            if (savedPositions) {
                state.widgetPositions = JSON.parse(savedPositions);
                console.log("[App.init] Loaded initial widget positions:", state.widgetPositions);
            } else {
                state.widgetPositions = {}; // Initialize as empty object if none saved
                console.log("[App.init] No saved widget positions found, initialized empty state.");
            }
        } catch (e) {
             console.error("[App.init] Error loading or parsing widget positions:", e);
             state.widgetPositions = {}; // Reset on error
             localStorage.removeItem('widgetPositions'); // Clear potentially corrupted data
        }

        // This is now handled by Language.translateUI

        // ... (Load other settings, URL History, Media Pref, etc.) ...
        UrlHistory.loadAll();
        Background.loadPreference();
        const savedWeatherEnabled = localStorage.getItem('weatherEnabled');
        state.weatherEnabled = savedWeatherEnabled !== 'false'; // Default to true if not found or invalid
        const savedWarningEnabled = localStorage.getItem('weatherWarningEnabled');
        // Only enable warnings if weather is also enabled
        state.weatherWarningEnabled = state.weatherEnabled && (savedWarningEnabled !== 'false'); 
        console.log(`[App.init] Loaded Weather Enabled: ${state.weatherEnabled}, Warning Enabled: ${state.weatherWarningEnabled}`);

        window.addEventListener('beforeunload', Background.saveYouTubeTime);
        // ... (API injection, element checks, Choices init) ...
        try {
            await Weather.initializeLocationSelect(); // Initialize with potentially translated placeholder
            console.log("[App.init] Location select initialized.");
        } catch (error) { 
             console.error("[App.init] Failed to initialize location select:", error);
        } 

        // Translate UI based on loaded language AFTER essential DOM is ready
        Language.translateUI();

        if (DOMElements.weatherEnabledCheckbox) {
             DOMElements.weatherEnabledCheckbox.checked = state.weatherEnabled;
        }
        if (DOMElements.warningEnabledCheckbox) {
            DOMElements.warningEnabledCheckbox.checked = state.weatherWarningEnabled;
            DOMElements.warningEnabledCheckbox.disabled = !state.weatherEnabled;
        }
 
        // Start Modules
        Clock.start();
        await Weather.start(); // Weather.start already checks state.weatherEnabled
        console.log("[App.init] Calling Modal.setup()..."); // Add log before call
        Modal.setup(); // Includes language selector setup now
        FocusTimer.setup(); // Setup focus timer listeners
        DragDrop.setup();
        Keyboard.setup();
        MemeWidget.setup(); // Might need translation updates
        TodoWidget.setup(); // Might need translation updates
        MemoManager.setup();
        ContextMenu.setup(); 
        initialAnimation();
        console.log("Focus Timer Initialized with Language Support");
    };
    
    // Method to be called by the global onYouTubeIframeAPIReady
    const handleYouTubeApiReady = () => {
        console.log("[App.handleYouTubeApiReady] YouTube API is ready.");
        Background.createYouTubePlayer(); // Create player with pending ID and time
    };

    // Expose necessary methods (init and the API ready handler)
    return { 
        init: init,
        handleYouTubeApiReady: handleYouTubeApiReady 
    };
})();

// This function MUST be in the global scope
function onYouTubeIframeAPIReady() {
    console.log("Global: onYouTubeIframeAPIReady triggered.");
    // Call the method inside our App module
    App.handleYouTubeApiReady(); 
}

// Run the App only after the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    // If DOM is already ready, but API might not be, init still proceeds.
    // YouTube player creation depends on the API callback.
    App.init();
}
