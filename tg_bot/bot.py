import asyncio
import logging
import sys
import os
import html

from aiogram import Bot, Dispatcher, Router, F
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties

# Конфигурация
BOT_TOKEN = BOT_TOKEN = "8586793029:AAG5YSZUf2Z-yvo-QugNzMwRopicgo3uLRg"
GROUP_ID = -1003753398326

# Роутер
router = Router()

# FSM
class Form(StatesGroup):
    name = State()
    phone = State()
    experience = State()

@router.message(CommandStart())
async def command_start_handler(message: Message, state: FSMContext) -> None:
    """Обработчик /start"""
    await state.clear()
    await message.answer("Привет! Давай подберем идеальную процедуру. Как тебя зовут?")
    await state.set_state(Form.name)

@router.message(Form.name)
async def process_name(message: Message, state: FSMContext) -> None:
    """Обработчик ввода имени"""
    await state.update_data(name=message.text)
    
    # Клавиатура для запроса контакта
    keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="Отправить контакт", request_contact=True)]],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    
    await message.answer("Отлично! Твой номер телефона для связи?", reply_markup=keyboard)
    await state.set_state(Form.phone)

@router.message(Form.phone)
async def process_phone(message: Message, state: FSMContext) -> None:
    """Обработчик получения контакта (или текста)"""
    if message.contact:
        phone = message.contact.phone_number
    else:
        phone = message.text
        
    await state.update_data(phone=phone)
    
    # Клавиатура для вопроса об опыте
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="Да", callback_data="exp_yes"),
                InlineKeyboardButton(text="Нет", callback_data="exp_no")
            ]
        ]
    )
    
    await message.answer("Был ли опыт перманентного макияжа ранее?", reply_markup=keyboard)
    await state.set_state(Form.experience)

@router.callback_query(Form.experience, F.data.in_(["exp_yes", "exp_no"]))
async def process_experience(callback: CallbackQuery, state: FSMContext, bot: Bot) -> None:
    """Обработчик callback_query (Опыт)"""
    experience = "Да" if callback.data == "exp_yes" else "Нет"
    
    await callback.message.answer("Спасибо! Анна свяжется с тобой в ближайшее время.")
    
    # Получаем все данные и экранируем HTML-символы для безопасности
    user_data = await state.get_data()
    name = html.escape(user_data.get("name", "Не указано"))
    phone = html.escape(user_data.get("phone", "Не указано"))
    experience = html.escape(experience)
    
    # Формируем username
    if callback.from_user.username:
        username_info = f"@{html.escape(callback.from_user.username)}"
    else:
        username_info = f"<a href='tg://user?id={callback.from_user.id}'>{name}</a>"
    
    # Формируем сообщение в группу
    admin_message = (
        f"📥 <b>НОВАЯ ЗАЯВКА!</b>\n"
        f"👤 <b>Имя:</b> {name}\n"
        f"📱 <b>Телефон:</b> {phone}\n"
        f"❓ <b>Опыт:</b> {experience}\n"
        f"🔗 <b>Профиль:</b> {username_info}"
    )
    
    # Отправляем в группу
    try:
        await bot.send_message(chat_id=GROUP_ID, text=admin_message)
    except Exception as e:
        logging.error(f"Не удалось отправить сообщение в группу: {e}")
    
    # Сбрасываем состояние
    await state.clear()
    await callback.answer()

async def main() -> None:
    # Инициализация бота
    bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher()
    
    # Регистрация роутера
    dp.include_router(router)
    
    # Запуск поллинга
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.info("Bot stopped!")
