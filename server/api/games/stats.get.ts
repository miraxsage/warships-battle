import { db } from "~/server/db/database";

export default defineEventHandler(async (event) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        status,
        COUNT(*) as count
      FROM games 
      GROUP BY status
      
      UNION ALL
      
      SELECT 
        'total' as status,
        COUNT(*) as count
      FROM games
      
      UNION ALL
      
      SELECT 
        'completed_games' as status,
        COUNT(*) as count
      FROM games
      WHERE status = 'finished'
      `,
      [],
      (err, rows: any[]) => {
        if (err) {
          reject(
            createError({
              statusCode: 500,
              statusMessage: "Failed to get stats",
            })
          );
          return;
        }

        const stats = rows.reduce((acc, row) => {
          acc[row.status] = row.count;
          return acc;
        }, {} as Record<string, number>);

        resolve(stats);
      }
    );
  });
});
