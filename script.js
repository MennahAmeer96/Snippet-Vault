const snippetForm = document.getElementById('snippet-form');
const languageInput = document.getElementById('language-input');
const languageDropdown = document.getElementById('language-dropdown');
const codeInput = document.getElementById('code-input');
const searchInput = document.getElementById('search-input');
const snippetsGrid = document.getElementById('snippets-grid');
const saveBtn = document.getElementById('save-btn');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');
const noSnippetsElement = document.getElementById('no-snippets');
const snippetCountElement = document.getElementById('snippet-count');

let currentSnippets = [];
let searchTimeout = null;
let dropdownVisible = false;
let selectedLanguageIndex = -1;

const STORAGE_KEY = 'snippetVault_snippets';

const PROGRAMMING_LANGUAGES = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'C', 'TypeScript', 'PHP', 'Ruby', 'Go',
    'Rust', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS', 'SCSS',
    'Less', 'Vue', 'React', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'Laravel', 'Ruby on Rails', 'ASP.NET', 'jQuery', 'Bootstrap', 'Tailwind CSS',
    'Shell', 'Bash', 'PowerShell', 'Perl', 'Lua', 'Dart', 'Objective-C', 'Assembly',
    'COBOL', 'Fortran', 'Haskell', 'Clojure', 'Erlang', 'Elixir', 'F#', 'VB.NET',
    'Delphi', 'Pascal', 'Ada', 'Scheme', 'Lisp', 'Prolog', 'JSON', 'XML', 'YAML',
    'Markdown', 'LaTeX', 'GraphQL', 'Solidity', 'VHDL', 'Verilog', 'Docker', 'Kubernetes'
].sort();

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading() {
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    noSnippetsElement.style.display = 'none';
    snippetsGrid.style.display = 'none';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    hideLoading();
}

function hideError() {
    errorElement.style.display = 'none';
}

function updateSnippetCount(count) {
    const text = count === 1 ? '1 snippet' : `${count} snippets`;
    snippetCountElement.textContent = text;
}

function saveSnippetsToSession(snippets) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
}

function loadSnippetsFromSession() {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function addSnippetToSession(snippet) {
    const snippets = loadSnippetsFromSession();
    const newSnippet = {
        id: Date.now(),
        language: snippet.language,
        code: snippet.code,
        created_at: new Date().toISOString()
    };
    snippets.unshift(newSnippet);
    saveSnippetsToSession(snippets);
    return newSnippet;
}

function deleteSnippetFromSession(id) {
    const snippets = loadSnippetsFromSession();
    const filteredSnippets = snippets.filter(snippet => snippet.id !== id);
    saveSnippetsToSession(filteredSnippets);
    return filteredSnippets;
}

function searchSnippetsInSession(searchTerm) {
    const snippets = loadSnippetsFromSession();
    if (!searchTerm.trim()) {
        return snippets;
    }
    
    return snippets.filter(snippet => 
        snippet.language.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

function renderSnippets(snippets) {
    hideLoading();
    hideError();
    
    currentSnippets = snippets;
    updateSnippetCount(snippets.length);
    
    snippetsGrid.innerHTML = '';
    
    if (snippets.length === 0) {
        snippetsGrid.style.display = 'none';
        noSnippetsElement.style.display = 'block';
        return;
    }
    
    noSnippetsElement.style.display = 'none';
    snippetsGrid.style.display = 'grid';
    
    snippets.forEach((snippet, index) => {
        const card = createSnippetCard(snippet);
        
        setTimeout(() => {
            snippetsGrid.appendChild(card);
        }, index * 50);
    });
}

function createSnippetCard(snippet) {
    const card = document.createElement('div');
    card.className = 'snippet-card new';
    
    const header = document.createElement('div');
    header.className = 'snippet-header';
    
    const info = document.createElement('div');
    info.className = 'snippet-info';
    
    const language = document.createElement('span');
    language.className = 'snippet-language';
    language.textContent = snippet.language;
    
    const date = document.createElement('span');
    date.className = 'snippet-date';
    date.textContent = formatDate(snippet.created_at);
    
    info.appendChild(language);
    info.appendChild(date);
    
    const actions = document.createElement('div');
    actions.className = 'snippet-actions';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = 'Delete snippet';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteSnippet(snippet.id);
    };
    
    actions.appendChild(deleteBtn);
    
    header.appendChild(info);
    header.appendChild(actions);
    
    const codeContainer = document.createElement('div');
    codeContainer.className = 'snippet-code-container';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = 'Copy code';
    copyBtn.onclick = (e) => {
        e.stopPropagation();
        copyToClipboard(snippet.code, copyBtn);
    };
    
    const codeElement = document.createElement('pre');
    codeElement.className = 'snippet-code';
    codeElement.textContent = snippet.code;
    
    codeContainer.appendChild(copyBtn);
    codeContainer.appendChild(codeElement);
    
    card.appendChild(header);
    card.appendChild(codeContainer);
    
    setTimeout(() => {
        card.classList.remove('new');
    }, 300);
    
    return card;
}

function fetchSnippets() {
    try {
        showLoading();
        
        const snippets = loadSnippetsFromSession();
        
        setTimeout(() => {
            renderSnippets(snippets);
        }, 100);
        
    } catch (error) {
        console.error('Error loading snippets:', error);
        showError('Failed to load snippets from session storage.');
    }
}

function searchSnippets(searchTerm) {
    if (!searchTerm.trim()) {
        fetchSnippets();
        return;
    }
    
    try {
        showLoading();
        
        const snippets = searchSnippetsInSession(searchTerm);
        
        setTimeout(() => {
            renderSnippets(snippets);
        }, 100);
        
    } catch (error) {
        console.error('Error searching snippets:', error);
        showError('Search failed. Please try again.');
    }
}

function saveSnippet(language, code) {
    try {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        
        const newSnippet = addSnippetToSession({
            language: language.trim(),
            code: code.trim()
        });
        
        console.log('Snippet saved:', newSnippet);
        
        languageInput.value = '';
        codeInput.value = '';
        
        codeInput.style.height = 'auto';
        codeInput.style.height = '120px';
        
        fetchSnippets();
        
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
            saveBtn.textContent = 'Save Snippet';
        }, 1500);
        
    } catch (error) {
        console.error('Error saving snippet:', error);
        showError(`Failed to save snippet: ${error.message}`);
        saveBtn.textContent = 'Save Snippet';
    } finally {
        setTimeout(() => {
            saveBtn.disabled = false;
        }, 200);
    }
}

snippetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const language = languageInput.value.trim();
    const code = codeInput.value.trim();
    
    if (!language || !code) {
        showError('Please fill in both language and code fields.');
        return;
    }
    
    hideError();
    saveSnippet(language, code);
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(() => {
        searchSnippets(searchTerm);
    }, 300);
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        searchInput.focus();
    }
    
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        fetchSnippets();
    }
});

codeInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.max(120, this.scrollHeight) + 'px';
});

function validateForm() {
    const language = languageInput.value.trim();
    const code = codeInput.value.trim();
    
    saveBtn.disabled = !language || !code;
}

languageInput.addEventListener('input', validateForm);
codeInput.addEventListener('input', validateForm);

languageInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    if (searchTerm.length > 0) {
        const filteredLanguages = filterLanguages(searchTerm);
        showLanguageDropdown(filteredLanguages);
    } else {
        showLanguageDropdown(PROGRAMMING_LANGUAGES);
    }
    validateForm();
});

languageInput.addEventListener('focus', () => {
    const searchTerm = languageInput.value;
    if (searchTerm.length > 0) {
        const filteredLanguages = filterLanguages(searchTerm);
        showLanguageDropdown(filteredLanguages);
    } else {
        showLanguageDropdown(PROGRAMMING_LANGUAGES);
    }
});

languageInput.addEventListener('keydown', (e) => {
    if (!dropdownVisible) return;
    
    const options = languageDropdown.querySelectorAll('.language-option');
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            selectedLanguageIndex = Math.min(selectedLanguageIndex + 1, options.length - 1);
            highlightLanguageOption(selectedLanguageIndex);
            break;
        case 'ArrowUp':
            e.preventDefault();
            selectedLanguageIndex = Math.max(selectedLanguageIndex - 1, -1);
            highlightLanguageOption(selectedLanguageIndex);
            break;
        case 'Enter':
            e.preventDefault();
            if (selectedLanguageIndex >= 0 && options[selectedLanguageIndex]) {
                selectLanguage(options[selectedLanguageIndex].textContent);
            }
            break;
        case 'Escape':
            hideLanguageDropdown();
            break;
    }
});

document.addEventListener('click', (e) => {
    if (!languageInput.contains(e.target) && !languageDropdown.contains(e.target)) {
        hideLanguageDropdown();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('SnippetVault initialized');
    fetchSnippets();
    validateForm();
    initializeTypingAnimation();
    initializeThemeToggle();
});

function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    const text = 'SnippetVault';
    let i = 0;
    
    typingElement.textContent = '';
    typingElement.style.borderRight = '2px solid var(--accent-primary)';
    typingElement.style.animation = 'blink-caret 1s step-end infinite';
    
    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        } else {
            setTimeout(() => {
                typingElement.style.borderRight = 'none';
                typingElement.style.animation = 'none';
            }, 2000);
        }
    }
    
    setTimeout(typeWriter, 500);
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function setTheme(theme) {
        if (theme === 'light') {
            body.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-sun';
        } else {
            body.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
        }
    }
}

function filterLanguages(searchTerm) {
    return PROGRAMMING_LANGUAGES.filter(lang => 
        lang.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

function showLanguageDropdown(languages) {
    languageDropdown.innerHTML = '';
    
    languages.forEach((lang, index) => {
        const option = document.createElement('div');
        option.className = 'language-option';
        option.textContent = lang;
        option.onclick = () => selectLanguage(lang);
        languageDropdown.appendChild(option);
    });
    
    languageDropdown.style.display = 'block';
    dropdownVisible = true;
    selectedLanguageIndex = -1;
}

function hideLanguageDropdown() {
    languageDropdown.style.display = 'none';
    dropdownVisible = false;
    selectedLanguageIndex = -1;
}

function selectLanguage(language) {
    languageInput.value = language;
    hideLanguageDropdown();
    validateForm();
}

function highlightLanguageOption(index) {
    const options = languageDropdown.querySelectorAll('.language-option');
    options.forEach((option, i) => {
        option.classList.toggle('highlighted', i === index);
    });
}

async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = 'var(--success-color)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = '';
        }, 2000);
        
        console.log('Code copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = 'var(--success-color)';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.color = '';
        }, 2000);
    }
}

function deleteSnippet(id) {
    if (confirm('Are you sure you want to delete this snippet?')) {
        deleteSnippetFromSession(id);
        fetchSnippets();
        console.log('Snippet deleted');
    }
}

function updateSessionInfo() {
    const snippetCount = loadSnippetsFromSession().length;
    console.log(`Session storage: ${snippetCount} snippets loaded`);
}