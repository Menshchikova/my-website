// Общие функции для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    // База данных для поиска (в реальном приложении можно загружать с сервера)
    const searchDatabase = [
        {
            title: 'Функции в JavaScript',
            link: 'functions.html',
            category: 'Основы JavaScript',
            preview: 'Function declaration, function expression, стрелочные функции, замыкания',
            keywords: ['функция', 'function', 'замыкание', 'callback']
        },
        {
            title: 'Стрелочные функции ES6+',
            link: 'es6.html',
            category: 'Продвинутые темы',
            preview: 'Современный синтаксис стрелочных функций с примерами использования',
            keywords: ['стрелочная', 'arrow', 'es6', 'функция']
        },
        {
            title: 'Переменные и типы данных',
            link: 'variables.html',
            category: 'Основы JavaScript',
            preview: 'let, const, var, типы данных, приведение типов',
            keywords: ['переменная', 'variable', 'тип', 'data type', 'let', 'const']
        },
        {
            title: 'Операторы',
            link: 'operators.html',
            category: 'Основы JavaScript',
            preview: 'Арифметические, логические, сравнения и другие операторы',
            keywords: ['оператор', 'operator', 'арифметический', 'логический']
        },
        {
            title: 'Условные конструкции',
            link: 'conditionals.html',
            category: 'Основы JavaScript',
            preview: 'if/else, switch, тернарный оператор',
            keywords: ['условие', 'conditional', 'if', 'else', 'switch']
        },
        {
            title: 'Циклы',
            link: 'loops.html',
            category: 'Основы JavaScript',
            preview: 'for, while, do...while, for...of, for...in',
            keywords: ['цикл', 'loop', 'for', 'while', 'итерация']
        },
        {
            title: 'Объекты',
            link: 'objects.html',
            category: 'Объекты и структуры данных',
            preview: 'Создание объектов, методы, свойства, this',
            keywords: ['объект', 'object', 'свойство', 'method']
        },
        {
            title: 'Массивы',
            link: 'arrays.html',
            category: 'Объекты и структуры данных',
            preview: 'Методы массивов: map, filter, reduce, forEach',
            keywords: ['массив', 'array', 'map', 'filter', 'reduce']
        },
        {
            title: 'Классы',
            link: 'classes.html',
            category: 'Объекты и структуры данных',
            preview: 'Классы ES6, наследование, статические методы',
            keywords: ['класс', 'class', 'наследование', 'inheritance']
        },
        {
            title: 'DOM Manipulation',
            link: 'dom.html',
            category: 'Работа с DOM',
            preview: 'Работа с DOM, создание и изменение элементов',
            keywords: ['dom', 'элемент', 'element', 'манипуляция']
        },
        {
            title: 'События',
            link: 'events.html',
            category: 'Работа с DOM',
            preview: 'Обработка событий, event listeners',
            keywords: ['событие', 'event', 'click', 'listener']
        },
        {
            title: 'Формы',
            link: 'forms.html',
            category: 'Работа с DOM',
            preview: 'Работа с формами, валидация, отправка данных',
            keywords: ['форма', 'form', 'валидация', 'input']
        },
        {
            title: 'Асинхронность',
            link: 'async.html',
            category: 'Продвинутые темы',
            preview: 'Promise, async/await, обработка асинхронных операций',
            keywords: ['асинхронность', 'async', 'promise', 'await']
        },
        {
            title: 'ES6+ Фичи',
            link: 'es6.html',
            category: 'Продвинутые темы',
            preview: 'Современные возможности JavaScript ES6+',
            keywords: ['es6', 'современный', 'modern', 'фичи']
        },
        {
            title: 'Модули',
            link: 'modules.html',
            category: 'Продвинутые темы',
            preview: 'Импорт/экспорт модулей, ES6 modules',
            keywords: ['модуль', 'module', 'import', 'export']
        },
        {
            title: 'Обработка ошибок',
            link: 'error-handling.html',
            category: 'Продвинутые темы',
            preview: 'try/catch, throw, обработка исключений',
            keywords: ['ошибка', 'error', 'try', 'catch', 'exception']
        }
    ];

    // Функционал копирования кода
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block').querySelector('code');
            const textArea = document.createElement('textarea');
            textArea.value = codeBlock.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Визуальная обратная связь
            const originalText = this.textContent;
            this.textContent = 'Скопировано!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    });
    
    // Подсветка активного раздела в навигации
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.toc-link');
    
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // ИНИЦИАЛИЗАЦИЯ ПОИСКА С АВТОДОПОЛНЕНИЕМ
    initializeSearch();
    
    function initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchForm = document.getElementById('searchForm');
        
        if (!searchInput) return;
        
        // Создаем контейнер для подсказок
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 0 0 15px 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            margin-top: 5px;
        `;
        
        // Вставляем контейнер под полем поиска
        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(suggestionsContainer);
        
        // Обработчик ввода в поиск
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                hideSuggestions();
                return;
            }
            
            searchTimeout = setTimeout(() => {
                const results = searchItems(query);
                showSuggestions(results, query);
            }, 300);
        });
        
        // Обработчик фокуса
        searchInput.addEventListener('focus', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                const results = searchItems(query);
                showSuggestions(results, query);
            }
        });
        
        // Обработчик потери фокуса
        searchInput.addEventListener('blur', function() {
            // Небольшая задержка чтобы можно было кликнуть на подсказку
            setTimeout(hideSuggestions, 200);
        });
        
        // Обработчик клавиш
        searchInput.addEventListener('keydown', function(e) {
            const visibleSuggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
            
            if (e.key === 'ArrowDown' && visibleSuggestions.length > 0) {
                e.preventDefault();
                const firstSuggestion = visibleSuggestions[0];
                firstSuggestion.focus();
            }
            
            if (e.key === 'Escape') {
                hideSuggestions();
                this.blur();
            }
        });
        
        // Обработчик формы (для тех, кто предпочитает нажать Enter)
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const query = searchInput.value.trim();
                
                if (query !== '') {
                    const results = searchItems(query);
                    if (results.length > 0) {
                        // Перенаправляем на первую найденную страницу
                        window.location.href = results[0].link;
                    } else {
                        showNoResults(query);
                    }
                }
            });
        }
    }
    
    // Функция поиска по базе данных
    function searchItems(query) {
        const lowerQuery = query.toLowerCase();
        
        return searchDatabase.filter(item => {
            // Поиск по заголовку
            if (item.title.toLowerCase().includes(lowerQuery)) {
                return true;
            }
            
            // Поиск по описанию
            if (item.preview.toLowerCase().includes(lowerQuery)) {
                return true;
            }
            
            // Поиск по ключевым словам
            if (item.keywords.some(keyword => 
                keyword.toLowerCase().includes(lowerQuery) || 
                lowerQuery.includes(keyword.toLowerCase())
            )) {
                return true;
            }
            
            // Поиск по категории
            if (item.category.toLowerCase().includes(lowerQuery)) {
                return true;
            }
            
            return false;
        });
    }
    
    // Функция показа подсказок
    function showSuggestions(results, query) {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) return;
        
        if (results.length === 0) {
            suggestionsContainer.innerHTML = `
                <div class="suggestion-item no-results">
                    <div>Ничего не найдено для "${query}"</div>
                </div>
            `;
            suggestionsContainer.style.display = 'block';
            return;
        }
        
        let html = '';
        
        results.slice(0, 8).forEach((result, index) => {
            const highlightedTitle = highlightText(result.title, query);
            const highlightedPreview = highlightText(result.preview, query);
            
            html += `
                <a href="${result.link}" class="suggestion-item" ${index === 0 ? 'autofocus' : ''}>
                    <div class="suggestion-title">${highlightedTitle}</div>
                    <div class="suggestion-preview">${highlightedPreview}</div>
                    <div class="suggestion-category">${result.category}</div>
                </a>
            `;
        });
        
        suggestionsContainer.innerHTML = html;
        suggestionsContainer.style.display = 'block';
        
        // Добавляем обработчики для подсказок
        const suggestionItems = suggestionsContainer.querySelectorAll('.suggestion-item');
        suggestionItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = this.getAttribute('href');
            });
            
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    window.location.href = this.getAttribute('href');
                }
                
                const allItems = suggestionsContainer.querySelectorAll('.suggestion-item');
                const currentIndex = Array.from(allItems).indexOf(this);
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextItem = allItems[currentIndex + 1];
                    if (nextItem) nextItem.focus();
                }
                
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (currentIndex > 0) {
                        allItems[currentIndex - 1].focus();
                    } else {
                        document.getElementById('searchInput').focus();
                    }
                }
                
                if (e.key === 'Escape') {
                    hideSuggestions();
                    document.getElementById('searchInput').focus();
                }
            });
        });
    }
    
    // Функция скрытия подсказок
    function hideSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }
    
    // Функция подсветки текста
    function highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    // Экранирование спецсимволов для regex
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Показать сообщение "нет результатов"
    function showNoResults(query) {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = '';
        searchInput.placeholder = `Ничего не найдено для "${query}"`;
        setTimeout(() => {
            searchInput.placeholder = 'Поиск по справочнику...';
        }, 2000);
    }
    
    // Анимация прогресса на главной странице
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        setTimeout(function() {
            const progressPercent = document.getElementById('progressPercent');
            const targetPercent = 35; // Процент прогресса
            
            progressFill.style.width = targetPercent + '%';
            if (progressPercent) {
                progressPercent.textContent = targetPercent + '%';
            }
        }, 500);
    }
    
    // Анимация появления карточек при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками
    const animatedElements = document.querySelectorAll('.topic-card, .content-section');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
    
    // Подсветка активных ссылок в содержании
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Для якорных ссылок не предотвращаем переход
            if (!this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                tocLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                window.location.href = this.getAttribute('href');
            }
        });
    });
});