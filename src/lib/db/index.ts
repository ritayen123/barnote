import Dexie, { type EntityTable } from "dexie";
import type { Cocktail, User, DrinkRecord, Bar } from "../types";

const db = new Dexie("SipNoteDB") as Dexie & {
  cocktails: EntityTable<Cocktail, "id">;
  users: EntityTable<User, "id">;
  records: EntityTable<DrinkRecord, "id">;
  bars: EntityTable<Bar, "id">;
};

// v1: initial schema
db.version(1).stores({
  cocktails: "id, nameEn, nameZh, category, baseSpirit",
  users: "id, username",
  records: "id, userId, cocktailId, barId, recordedAt",
  bars: "id, name, city, googlePlaceId",
});

// v2: add compound indexes for performance
db.version(2).stores({
  cocktails: "id, nameEn, nameZh, category, baseSpirit, [category+baseSpirit]",
  users: "id, username",
  records: "id, userId, [userId+recordedAt], cocktailId, barId, recordedAt",
  bars: "id, name, city, googlePlaceId",
});

// v3: add firebaseUid index for auth
db.version(3).stores({
  cocktails: "id, nameEn, nameZh, category, baseSpirit, [category+baseSpirit]",
  users: "id, username, firebaseUid",
  records: "id, userId, [userId+recordedAt], cocktailId, barId, recordedAt",
  bars: "id, name, city, googlePlaceId",
});

export { db };
