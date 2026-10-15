import { requireDb } from "../services/db.js";

/**
 * GET /api/history
 * Returns the last N distinct city searches, most recent first.
 */
export async function getHistory(req, res, next) {
  try {
    const sql = requireDb();
    const limit = Math.min(Number(req.query.limit) || 8, 20);

    // DISTINCT ON (city) keeps the most recent row per city
    const rows = await sql`
      SELECT DISTINCT ON (LOWER(city)) id, city, searched_at
      FROM search_history
      ORDER BY LOWER(city), searched_at DESC
    `;

    // Now sort those distinct rows by searched_at DESC, limit
    const sorted = rows
      .sort((a, b) => new Date(b.searched_at) - new Date(a.searched_at))
      .slice(0, limit);

    res.json({ history: sorted });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/history
 * Body: { city: "Mumbai" }
 * Inserts a new search entry and prunes older duplicates.
 */
export async function addHistory(req, res, next) {
  try {
    const sql = requireDb();
    const { city } = req.body;

    if (!city || typeof city !== "string") {
      throw Object.assign(new Error("city is required"), { status: 400 });
    }

    const trimmed = city.trim().slice(0, 100);

    // 1. Delete older entries for the same city (case-insensitive)
    await sql`
      DELETE FROM search_history
      WHERE LOWER(city) = LOWER(${trimmed})
    `;

    // 2. Insert the fresh entry
    const [row] = await sql`
      INSERT INTO search_history (city)
      VALUES (${trimmed})
      RETURNING id, city, searched_at
    `;

    // 3. Keep only the 20 most recent rows total (housekeeping)
    await sql`
      DELETE FROM search_history
      WHERE id NOT IN (
        SELECT id FROM search_history
        ORDER BY searched_at DESC
        LIMIT 20
      )
    `;

    res.status(201).json({ entry: row });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/history
 * Wipes the entire history.
 */
export async function clearHistory(req, res, next) {
  try {
    const sql = requireDb();
    await sql`DELETE FROM search_history`;
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
