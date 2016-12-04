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
let v = 0;

export default class DBHelper {
  constructor(dbname, storename) {
    this.dbname = dbname;
    this.storename = storename;
    return new Promise((resolve, reject) => {
      if (dbname in DBPOOL) {
        this.db = DBPOOL[dbname];
        resolve(this);
      } else {
        let request = indexedDB.open(dbname, 2);
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

  requestConnection(dbname, storename) {
    this.dbname = dbname;
    this.storename = storename;

    return new Promise((resolve, reject) => {
      
    });
  }

  _getObjectStore() {
    if (!this.db) throw new Error("Database is not ready.");
    try {
      this.db.transaction([this.storename], 'readwrite')
            .objectStore(this.storename);
    } catch (e) {
      if (8 === e.code) {
        throw e;
      } else {
        throw e;
      }
    }
    return this.db.transaction([this.storename], 'readwrite')
                  .objectStore(this.storename);
  }

  static databaseExists(dbname) {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbname);

      // 如果 onsuccess 回调被调用，说明没有调用 onupgradeneeded（因为其会终止事务），
      // 说明数据库原先是存在的。
      request.onsuccess = function(e) {
        resolve(true);
      };

      // 如果 onupgradeneeded 回调被调用，则数据库不存在
      request.onupgradeneeded = function(e) {
        // 终止事务，避免创建数据库，避免调用后续的onsuccess回调。
        e.target.transaction.abort();
        resolve(false);
      };
      request.onerror = function(e) {
        reject('opening database error');
      };
    });
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

  deleteDatabase(dbname) {
    return new Promise((resolve, reject) => {
      let deleteRequest = indexedDB.deleteDatabase(dbname);

      deleteRequest.onsuccess = (event) => {
        resolve('database ' + dbname + " deleted");
      };
      deleteRequest.onerror = (event) => {
        reject('Failed to delete database: ' + dbname);
      }
    });

  }
}