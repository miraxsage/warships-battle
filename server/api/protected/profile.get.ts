export default defineEventHandler(async (event) => {
  const user = event.context.user;

  return {
    success: true,
    message: "Доступ к защищенному ресурсу разрешен",
    user,
    timestamp: new Date().toISOString(),
  };
});
