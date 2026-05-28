<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>НВТП | ИИ-Ассистент</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>

    <div class="app-container">
        <aside class="sidebar">
            <div class="logo">
                <i class="fas fa-shield-halved"></i>
                <span>НВТП АССИСТЕНТ</span>
            </div>
            <nav class="topics">
                <p class="nav-label">База знаний</p>
                <button class="topic-btn active"><i class="fas fa-book"></i> Общие Уставы</button>
                <button class="topic-btn"><i class="fas fa-gun"></i> Огневая подготовка</button>
                <button class="topic-btn"><i class="fas fa-Stethoscope"></i> Тактическая медицина</button>
                <button class="topic-btn"><i class="fas fa-map-marked-alt"></i> Топография</button>
                <button class="topic-btn"><i class="fas fa-biohazard"></i> РХБЗ</button>
            </nav>
            <div class="sidebar-footer">
                <span class="status-online"></span> Система активна
            </div>
        </aside>

        <main class="chat-area">
            <header class="chat-header">
                <h2>Консультация по подготовке</h2>
                <span class="model-badge">GPT-4o + RAG (Уставы 2026)</span>
            </header>

            <div class="messages-container" id="chatBox">
                <div class="message ai-message">
                    <div class="avatar"><i class="fas fa-robot"></i></div>
                    <div class="text">
                        Здравия желаю! Я ваш цифровой помощник по курсу НВТП. 
                        Готов ответить на вопросы по уставам, ТТХ оружия или тактической медицине. С чего начнем?
                    </div>
                </div>
            </div>

            <div class="input-area">
                <div class="input-wrapper">
                    <input type="text" placeholder="Введите ваш вопрос (например: ТТХ АК-74)..." id="userInput">
                    <button class="send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
                <p class="disclaimer">Информация носит справочный характер. Руководствуйтесь официальными уставами.</p>
            </div>
        </main>
    </div>
<script src="script.js"></script>
</body>
</html>
