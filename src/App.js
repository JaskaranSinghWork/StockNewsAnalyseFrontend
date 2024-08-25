@import url('https://fonts.googleapis.com/css2?family=Itim&display=swap');

/* Modern color palette */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #34495e;
    --accent-color: #3498db;
    --text-color: #333;
    --bg-color: #f8f9fa;
    --card-bg: #ffffff;
    --highlight-color: #ffd7b5;
}

/* Global styles */
*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Itim', cursive;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--bg-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Header styles */
header {
    background-color: var(--primary-color);
    color: #ffffff;
    padding: 1.5rem 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
}

nav ul {
    list-style-type: none;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

nav ul li {
    margin-right: 25px;
}

nav ul li a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

nav ul li a:hover {
    color: var(--accent-color);
    text-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
}

/* Main content */
main {
    padding: 3rem 0;
}

/* Card styles */
.card {
    background-color: var(--card-bg);
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    padding: 30px;
    margin-bottom: 30px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.card h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
}

.card p {
    margin-bottom: 1.5rem;
    color: #555;
}

/* Button styles */
.btn {
    display: inline-block;
    background-color: var(--accent-color);
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn:hover {
    background-color: #2980b9;
    box-shadow: 0 4px 8px rgba(41, 128, 185, 0.3);
}

/* Footer styles */
footer {
    background-color: var(--secondary-color);
    color: #ffffff;
    text-align: center;
    padding: 2rem 0;
    margin-top: 3rem;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
    header h1 {
        font-size: 2rem;
    }

    nav ul {
        flex-direction: column;
        align-items: center;
    }

    nav ul li {
        margin: 0.5rem 0;
    }

    .card {
        width: 100%;
        margin-bottom: 2rem;
    }

    .btn {
        width: 100%;
        text-align: center;
    }
}

@media screen and (max-width: 480px) {
    header h1 {
        font-size: 1.5rem;
    }

    .card h2 {
        font-size: 1.5rem;
    }
}

/* Additional styles for app-specific elements */
.App {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
}

.App-header {
    text-align: center;
    margin-bottom: 2rem;
}

.App-main {
    display: flex;
    gap: 2rem;
}

.search-section {
    flex: 1;
    order: 2;
}

.results-section {
    flex: 2;
    order: 1;
}

.search-form {
    background-color: var(--highlight-color);
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
}

input[type="text"],
input[type="number"],
input[type="date"],
input[type="range"] {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--primary-color);
    background-color: #fff6ed;
    color: var(--text-color);
    border-radius: 10px;
    box-sizing: border-box;
}

input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background: var(--highlight-color);
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
}

button {
    width: 100%;
    padding: 10px;
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #d88d6a;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.loading, .error, .success, .status {
    padding: 10px;
    margin-bottom: 1rem;
    border-radius: 10px;
    text-align: center;
}

.loading {
    background-color: var(--highlight-color);
}

.error {
    background-color: #ffb3ba;
}

.success {
    background-color: #baffc9;
}

.status {
    background-color: #bae1ff;
}

.final-analysis, .article {
    background-color: #fff6ed;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.article-meta {
    color: var(--primary-color);
    font-size: 0.9rem;
}

.read-more {
    display: inline-block;
    margin: 1rem 0;
    color: var(--text-color);
    text-decoration: none;
}

.article-analysis {
    background-color: var(--highlight-color);
    padding: 15px;
    border-radius: 10px;
    margin-top: 1rem;
}

.suggestions {
    list-style-type: none;
    padding: 0;
    margin: 0;
    background-color: #fff6ed;
    border: 2px solid var(--primary-color);
    border-top: none;
    border-radius: 0 0 10px 10px;
}

.suggestions li {
    padding: 10px;
    cursor: pointer;
}

.suggestions li:hover {
    background-color: var(--highlight-color);
}

.App-footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--primary-color);
    color: var(--text-color);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.article {
    animation: fadeIn 0.5s ease-in-out;
}

/* Responsive design improvements */
@media screen and (max-width: 768px) {
    .App-main {
        flex-direction: column;
    }

    .search-section, .results-section {
        width: 100%;
        order: unset;
    }
}

@media screen and (max-width: 480px) {
    .search-form {
        padding: 15px;
    }
}
