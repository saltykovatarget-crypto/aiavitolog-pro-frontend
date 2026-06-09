#!/usr/bin/env python3
"""Пример Telegram-бота для обмена auth_key на login_token.

Зависимости: python-telegram-bot>=21.0, requests.

Запуск:
    export TELEGRAM_BOT_TOKEN="<bot token>"
    export BOT_EXCHANGE_SECRET="<секрет>"
    export BOT_EXCHANGE_URL="http://localhost:8000/api/auth/telegram/bot_exchange"
    export TELEGRAM_FRONTEND_ORIGIN="http://localhost:5173"
    python tools/tg-bot-example.py

Бот ожидает команду /start <auth_key>, которую получает сайт.
После успешного обмена отправляет пользователю ссылку на
/auth/callback?login_token=....
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

import requests
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import Application, CommandHandler, ContextTypes


@dataclass
class Settings:
    bot_token: str
    exchange_secret: str
    exchange_url: str
    frontend_origin: str

    @classmethod
    def from_env(cls) -> "Settings":
        bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
        exchange_secret = os.environ.get("BOT_EXCHANGE_SECRET")
        exchange_url = os.environ.get(
            "BOT_EXCHANGE_URL", "http://localhost:8000/api/auth/telegram/bot_exchange"
        )
        frontend_origin = os.environ.get("TELEGRAM_FRONTEND_ORIGIN", "http://localhost:5173")

        if not bot_token or not exchange_secret:
            raise RuntimeError("TELEGRAM_BOT_TOKEN и BOT_EXCHANGE_SECRET обязательны")

        return cls(
            bot_token=bot_token,
            exchange_secret=exchange_secret,
            exchange_url=exchange_url,
            frontend_origin=frontend_origin,
        )


async def handle_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    settings = context.application.bot_data["settings"]
    if not update.effective_user:
        return

    if not context.args:
        await update.message.reply_text("Передайте стартовый ключ из веб-приложения.")
        return

    auth_key = context.args[0]
    user = update.effective_user
    payload: dict[str, Any] = {
        "auth_key": auth_key,
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "photo_url": user.photo_url,
    }

    try:
        response = requests.post(
            settings.exchange_url,
            json=payload,
            headers={"X-Bot-Token": settings.exchange_secret},
            timeout=10,
        )
    except requests.RequestException as exc:  # pragma: no cover - helper script
        await update.message.reply_text(f"Не удалось связаться с API: {exc}")
        return

    if response.status_code != 200:
        await update.message.reply_text(
            f"Ошибка обмена ключа ({response.status_code}): {response.text}"
        )
        return

    login_token = response.json()["login_token"]
    callback_url = f"{settings.frontend_origin.rstrip('/')}/auth/callback?login_token={login_token}"

    keyboard = InlineKeyboardMarkup(
        [[InlineKeyboardButton(text="Открыть AI-Avitолог", url=callback_url)]]
    )
    await update.message.reply_text(
        "Авторизация подтверждена. Нажмите кнопку, чтобы вернуться на сайт.",
        reply_markup=keyboard,
    )


def main() -> None:
    settings = Settings.from_env()
    application = Application.builder().token(settings.bot_token).build()
    application.bot_data["settings"] = settings

    application.add_handler(CommandHandler("start", handle_start))

    print("Bot started. Press Ctrl+C to stop.")
    application.run_polling(close_loop=False)


if __name__ == "__main__":  # pragma: no cover - manual script
    main()
