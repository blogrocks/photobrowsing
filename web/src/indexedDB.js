/**
 * Created by vimer on 03/12/2016.
 */
//prefixes of implementation that we want to test
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const DBPOOL = {};

export default class DBHelper {
  constructor(dbname, storename) {
    this.storename = storename;
    return new Promise((resolve, reject) => {
      if (dbname in DBPOOL) {
        this.db = DBPOOL[dbname];
        resolve(this);
      } else {
        let request = indexedDB.open(dbname, 1);
        request.onsuccess = (event) => {
          let db = event.target.result;

          if (!(dbname in DBPOOL)) {
            DBPOOL[dbname] = db;
          }
          this.db = DBPOOL[dbname];
          resolve(this);
        };
        request.onerror = (event) => {
          reject('opening database error');
        };
        request.onupgradeneeded = (event) => {
          this.db = event.target.result;
          DBPOOL[dbname] = this.db;

          this.db.createObjectStore(storename, {keyPath: 'id'});
        };
      }
    });
  }

  _getObjectStore() {
    if (!this.db) throw new Error("Database is not ready.");
    return this.db.transaction([this.storename], 'readwrite')
                  .objectStore(this.storename);
  }

  getObjectCount() {
    return new Promise((resolve, reject) => {
      let objectStore = this._getObjectStore();

      let countRequest = objectStore.count();
      countRequest.onsuccess = function() {
        resolve(countRequest.result);
      };
      countRequest.onerror = function() {
        reject('querying object count error');
      };
    });
  }

}