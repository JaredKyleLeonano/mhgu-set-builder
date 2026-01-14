let dbPromise: Promise<IDBDatabase> | null = null;

const database = () => {
  const importArmorData = (db: IDBDatabase) => async () => {
    console.log("IMPORTING ARMOR DATA");
    try {
      // 1. Fetch the JSON file
      const response = await fetch("scripts/output/armor.json");
      const armorData = await response.json();

      console.log("Armor data fetched:", armorData);

      const transaction = db.transaction("armors", "readwrite");
      const store = transaction.objectStore("armors");

      for (const armor of armorData) {
        const addRequest = store.put(armor);

        addRequest.onerror = () => console.error(`Failed to add: ${armor}`);
      }

      transaction.oncomplete = () => {
        console.log("All armor data successfully imported!");
      };
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  console.log("DATABASE CALLED", dbPromise);

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const indexedDB = window.indexedDB;
    // indexedDB.deleteDatabase("armor-db");

    if (!indexedDB) {
      reject("IndexedDB not supported");
      return;
    }

    const request = indexedDB.open("armor-db", 1);

    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
      return;
    };

    console.log("no error yay");

    request.onupgradeneeded = function () {
      //1
      const db = request.result;

      //2
      const store = db.createObjectStore("armors", { keyPath: "id" });

      store.createIndex("armorPiece", "armorPiece");
      store.createIndex("rarity", ["rarity", "defense.min"]);
      store.createIndex("slots", "slots");
      store.createIndex("type", "type");
      store.createIndex("skills", "skills.name", { multiEntry: true });

      // importArmorData(db)();
      console.log("DB UPGRADED");
    };

    request.onsuccess = () => {
      // importArmorData(request.result)();
      resolve(request.result);
    };
  });

  return dbPromise;
};

export default database;
