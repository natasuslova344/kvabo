# KVABO — одностраничный сайт

## Структура проекта

```
index.html   — вёрстка
style.css    — стили
script.js    — вся интерактивность + отправка заявок в Telegram
```

## Настройка формы обратной связи (Telegram)

Форма отправляет заявки прямо в Telegram-аккаунт через Telegram Bot API.

### Шаг 1 — Создайте бота

1. Напишите [@BotFather](https://t.me/BotFather) в Telegram.
2. Отправьте `/newbot` и следуйте инструкциям.
3. Скопируйте **BOT_TOKEN** (выглядит как `7123456789:AAFxxx...`).

### Шаг 2 — Узнайте свой Chat ID

1. Напишите вашему новому боту `/start`.
2. Откройте в браузере:
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
3. В ответе найдите `"chat":{"id": 123456789}` — это ваш **CHAT_ID**.

### Шаг 3 — Вставьте данные в script.js

В начале файла `script.js` найдите блок `TELEGRAM_CONFIG` и замените заглушки:

```js
const TELEGRAM_CONFIG = {
  botToken: "7123456789:AAFxxx...",  // ← ваш токен
  chatId:   "123456789"              // ← ваш chat id
};
```

После этого форма будет отправлять сообщения в Telegram при каждой заявке.
