let dbPromise: Promise<IDBDatabase> | null = null;

const database = () => {
  const importArmorData = (db: IDBDatabase) => async () => {
    console.log("IMPORTING ARMOR DATA");
    try {
      // 1. Fetch the JSON file
      const response = await fetch("scripts/output/armor.json");
      const armorData = await response.json();

      const response2 = await fetch("scripts/output/skillTree.json");
      const skillData = await response2.json();

      console.log("Armor data fetched:", armorData);

      const transaction = db.transaction("armors", "readwrite");
      const store = transaction.objectStore("armors");

      const transaction2 = db.transaction("skills", "readwrite");
      const store2 = transaction2.objectStore("skills");

      for (const armor of armorData) {
        const addRequest = store.put(armor);

        addRequest.onerror = () => console.error(`Failed to add: ${armor}`);
      }

      for (const skill of skillData) {
        const addRequest = store2.put(skill);

        addRequest.onerror = () => console.error(`Failed to add: ${skill}`);
      }

      transaction.oncomplete = () => {
        console.log("All armor data successfully imported!");
      };

      transaction2.oncomplete = () => {
        console.log("All skill data successfully imported!");
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
      const store2 = db.createObjectStore("skills", { autoIncrement: true });

      store.createIndex("armorPiece", "armorPiece");
      store.createIndex("rarity", ["rarity", "defense.min"]);
      store.createIndex("slots", "slots");
      store.createIndex("type", "type");
      store.createIndex("skills", "skills.name", { multiEntry: true });
      store2.createIndex("skillTree", "skillTree");

      importArmorData(db)();
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
