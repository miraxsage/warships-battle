import { getGameStatus } from "~/server/utils/games";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const gameId = query.gameId as string;

  if (!gameId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Game ID is required",
    });
  }

  try {
    const gameStatus = await getGameStatus(gameId);

    if (!gameStatus) {
      throw createError({
        statusCode: 404,
        statusMessage: "Game not found",
      });
    }

    return gameStatus;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    console.error("Error checking game status:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to check game status",
    });
  }
});
