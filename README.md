# 🕵️ Карточный детектив — Telegram Mini App

## Структура файлов

```
detective-cards-tg/
├── index.html      ← главная страница игры
├── style.css       ← стили (мобильные + Telegram тема)
├── script.js       ← вся логика игры + TG WebApp SDK
├── images/         ← папка с твоими иконками (скопируй из оригинала)
│   ├── background.jpg
│   ├── map.png
│   ├── magnifying-glass.png
│   ├── human.png
│   ├── alibi.png
│   ├── vision.png
│   └── lie.png
└── README.md
```

---

## Шаг 1 — Залей на GitHub Pages (бесплатно)

1. Зайди на [github.com](https://github.com) → Create new repository
2. Назови репозиторий, например: `detective-cards`
3. Сделай его **Public**
4. Загрузи все файлы (`index.html`, `style.css`, `script.js`, папку `images/`)
5. Зайди в **Settings → Pages**
6. В Source выбери **Deploy from a branch → main → / (root)**
7. Через минуту игра будет доступна по адресу:
   ```
   https://ИМЯ_ПОЛЬЗОВАТЕЛЯ.github.io/detective-cards/
   ```
   Запомни этот URL — он понадобится на шаге 3.

> **Альтернативы GitHub Pages:** Netlify (netlify.com) или Vercel (vercel.com) — 
> просто перетащи папку, получишь HTTPS-ссылку за 30 секунд.

---

## Шаг 2 — Создай бота через @BotFather

1. Открой Telegram → найди **@BotFather**
2. Напиши `/newbot`
3. Придумай имя (например: `Карточный детектив`) и username (например: `detective_cards_bot`)
4. BotFather выдаст **токен** — сохрани его, но держи в секрете

---

## Шаг 3 — Привяжи Mini App к боту

В чате с @BotFather:

```
/newapp
```

BotFather спросит:
- Выбери бота → выбери своего
- Title → `Карточный детектив`
- Description → `Раскрой преступление за 30 ходов`
- Photo → загрузи любую картинку 640×360
- GIF → можно пропустить (`/empty`)
- Web App URL → вставь ссылку с GitHub Pages:
  `https://ИМЯ.github.io/detective-cards/`

После этого Mini App готов!

---

## Шаг 4 — Добавь кнопку меню в бота (опционально)

Чтобы в боте была кнопка для запуска игры:

```
/setmenubutton
```

- Выбери бота
- Введи URL игры
- Введи текст кнопки: `🕵️ Играть`

---

## Шаг 5 — Запусти и проверь

1. Найди своего бота в Telegram
2. Нажми кнопку меню или напиши `/start`
3. Нажми кнопку «🕵️ Играть»

Игра откроется прямо внутри Telegram!

---

## Что работает в Telegram

| Функция | Статус |
|---------|--------|
| Развёртывание на весь экран | ✅ |
| Telegram тема (тёмная/светлая) | ✅ |
| Кнопка «Предъявить обвинение» — нативная TG MainButton | ✅ |
| Haptic feedback (вибрация на iOS/Android) | ✅ |
| Подтверждение при случайном закрытии | ✅ |
| Safe area (выемка/домашний индикатор) | ✅ |
| Работает в браузере как обычный сайт | ✅ |

---

## Версии

| Версия | Изменения |
|--------|-----------|
| beta 1.0 | Свидетели, иностранные имена, события, карта |
| beta 2.0 | 6 подозреваемых, совпадающие инициалы, SVG-карта, расстояния |
| beta 3.0 | Сложность, лимит ходов, инвентарь, Telegram Mini App |


## Бот

Оригинальный бот: <img width="948" height="1110" alt="image" src="https://github.com/user-attachments/assets/6ba9bcc9-1e74-46eb-aca4-d9b11aebdbe5" />
