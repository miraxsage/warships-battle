import { initDatabase } from "../db/database";

let dbInitialized = false;

export default defineEventHandler(async () => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
      console.log("База данных успешно инициализирована");
    } catch (error) {
      console.error("Ошибка инициализации базы данных:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Ошибка базы данных",
      });
    }
  }
});
