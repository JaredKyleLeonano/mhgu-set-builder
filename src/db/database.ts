let dbPromise: Promise<IDBDatabase> | null = null;

const isStoreEmpty = (db: IDBDatabase, storeName: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.count();

    req.onsuccess = () => resolve(req.result === 0);
    req.onerror = () => reject(req.error);
  });
};

const database = () => {
  const importArmorData = async (db: IDBDatabase) => {
    try {
      const [armorsEmpty, skillsEmpty] = await Promise.all([
        isStoreEmpty(db, "armors"),
        isStoreEmpty(db, "skills"),
      ]);

      if (!armorsEmpty && !skillsEmpty) {
        return;
      }

      const response = await fetch("/assets/data/armor.json");
      const armorData = await response.json();

      const response2 = await fetch("/assets/data/skillTree.json");
      const skillData = await response2.json();

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

      transaction.oncomplete = () => {};

      transaction2.oncomplete = () => {};
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

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

    request.onupgradeneeded = async function () {
      const db = request.result;

      const store = db.createObjectStore("armors", { keyPath: "id" });
      const store2 = db.createObjectStore("skills", { autoIncrement: true });

      store.createIndex("armorPiece", "armorPiece");
      store.createIndex("rarity", ["rarity", "defense.min"]);
      store.createIndex("slots", "slots");
      store.createIndex("type", "type");
      store.createIndex("skills", "skills.name", { multiEntry: true });
      store2.createIndex("skillTree", "skillTree");
    };

    request.onsuccess = async () => {
      await importArmorData(request.result);
      resolve(request.result);
    };
  });

  return dbPromise;
};

export default database;
