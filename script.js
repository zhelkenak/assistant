const API_KEY = "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";

const KNOWLEDGE_BASE = {
  "Общие Уставы": `
    Устав внутренней службы Вооружённых Сил — основной документ,
    регулирующий повседневную жизнь воинских частей.
    Статья 1. Военная служба — особый вид федеральной государственной службы.
    Статья 2. Военнослужащий обязан: соблюдать воинскую дисциплину,
    беречь военное имущество, выполнять приказы командиров.
    Строевой устав регламентирует строевые приёмы и движение.
    Дисциплинарный устав определяет сущность воинской дисциплины.
  `,
  "Огневая подготовка": `
    АК-74: калибр 5,45×39 мм, масса без магазина 3,3 кг,
    длина 940 мм, прицельная дальность 1000 м,
    темп стрельбы 600 выстр/мин, ёмкость магазина 30 патронов.
    АКС-74: складной приклад, масса 3,2 кг.
    ПМ (пистолет Макарова): калибр 9×18 мм, масса 730 г,
    прицельная дальность 50 м, ёмкость магазина 8 патронов.
    Правила обращения с оружием: всегда считай оружие заряженным,
    не направляй в людей без приказа, держи палец вне скобы.
  `,
  "Тактическая медицина": `
    Алгоритм MARCH: M-Massive bleeding (остановка кровотечения),
    A-Airway (проходимость дыхательных путей), R-Respiration (дыхание),
    C-Circulation (кровообращение), H-Hypothermia (предотвращение переохлаждения).
    Жгут: накладывается выше раны на 5-7 см при артериальном кровотечении.
    Максимальное время наложения жгута — 2 часа зимой, 1 час летом.
    Обязательно указывать время наложения жгута.
    Давящая повязка — при венозном кровотечении.
  `,
  "Топография": `
    Масштаб карты: 1:50000 означает 1 см = 500 м на местности.
    Азимут — угол между направлением на север и направлением на объект,
    измеряется по часовой стрелке от 0° до 360°.
    Ориентирование по компасу: стрелка компаса указывает на магнитный север.
    Горизонтали — линии, соединяющие точки с одинаковой высотой.
    Чем гуще горизонтали — тем круче склон.
    Условные знаки: синий цвет — вода, зелёный — растительность,
    коричневый — рельеф, чёрный — искусственные объекты.
  `,
  "РХБЗ": `
    РХБЗ — Радиационная, Химическая и Биологическая Защита.
    Средства индивидуальной защиты: противогаз, ОЗК (общевойсковой защитный комплект).
    Степени химической тревоги: "Химическая тревога" — надеть противогаз.
    Зоны заражения: зона смертельного поражения, зона средних потерь,
    зона слабых потерь, зона дискомфорта.
    Дезактивация — удаление радиоактивных веществ.
    Дегазация — обезвреживание отравляющих веществ.
    Дезинфекция — уничтожение болезнетворных микроорганизмов.
  `
};

const TOPIC_KEYS = Object.keys(KNOWLEDGE_BASE);
let activeTopic = TOPIC_KEYS[0];
let messageHistory = [];

document.addEventListener("DOMContentLoaded", () => {
  const topicBtns = document.querySelectorAll(".topic-btn");
  topicBtns.forEach((btn, i) => {
    if (TOPIC_KEYS[i]) {
      btn.addEventListener("click", () => {
        topicBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeTopic = TOPIC_KEYS[i];
        messageHistory = [];
        showSystemMessage(`Тема изменена: ${activeTopic}`);
      });
    }
  });

  document.querySelector(".send-btn").addEventListener("click", sendMessage);

  document.getElementById("userInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const typingId = addTyping();

  messageHistory.push({ role: "user", content: text });
  if (messageHistory.length > 10) {
    messageHistory = messageHistory.slice(-10);
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Ты — цифровой военный помощник-ассистент курса НВТП (Начальная военная и технологическая подготовка).
Отвечай строго на основе базы знаний ниже.
Если вопрос выходит за рамки базы знаний — честно сообщи об этом.
Отвечай на русском языке. Будь чётким, конкретным и кратким.
Используй военный стиль речи, но понятный для курсантов.

ТЕКУЩАЯ ТЕМА: ${activeTopic}
БАЗА ЗНАНИЙ:
${KNOWLEDGE_BASE[activeTopic]}`
          },
          ...messageHistory
        ],
        max_tokens: 1024
      })
    });

    const data = await response.json();
    removeTyping(typingId);

    if (data.error) {
      addMessage(`Ошибка API: ${data.error.message}`, "ai");
      return;
    }

    const reply = data.choices?.[0]?.message?.content;
    if (reply) {
      messageHistory.push({ role: "assistant", content: reply });
      addMessage(reply, "ai");
    } else {
      addMessage("Не удалось получить ответ. Попробуйте ещё раз.", "ai");
    }

  } catch (err) {
    removeTyping(typingId);
    addMessage("Ошибка соединения. Проверьте интернет или API ключ.", "ai");
    console.error("Ошибка:", err);
  }
}

function addMessage(text, type) {
  const box = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = `message ${type === "ai" ? "ai-message" : "user-message"}`;

  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

  div.innerHTML = `
    <div class="avatar">
      <i class="fas fa-${type === "ai" ? "robot" : "user"}"></i>
    </div>
    <div class="text">${formatted}</div>
  `;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function showSystemMessage(text) {
  const box = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.style.cssText = "text-align:center; color:#666; font-size:0.75rem; padding:8px 0;";
  div.textContent = `— ${text} —`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function addTyping() {
  const id = "typing-" + Date.now();
  const box = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = "message ai-message";
  div.id = id;
  div.innerHTML = `
    <div class="avatar"><i class="fas fa-robot"></i></div>
    <div class="text" style="display:flex; gap:4px; align-items:center;">
      <span style="width:7px;height:7px;background:var(--accent-bright);border-radius:50%;display:inline-block;animation:blink 1s infinite"></span>
      <span style="width:7px;height:7px;background:var(--accent-bright);border-radius:50%;display:inline-block;animation:blink 1s infinite 0.2s"></span>
      <span style="width:7px;height:7px;background:var(--accent-bright);border-radius:50%;display:inline-block;animation:blink 1s infinite 0.4s"></span>
    </div>
  `;

  if (!document.getElementById("blink-style")) {
    const style = document.createElement("style");
    style.id = "blink-style";
    style.textContent = `@keyframes blink { 0%,100%{opacity:0.2} 50%{opacity:1} }`;
    document.head.appendChild(style);
  }

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}
