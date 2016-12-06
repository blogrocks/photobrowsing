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

export default class DBHelper {
  constructor(dbname, storename) {
    this.dbname = dbname;
    this.storename = storename;
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbname);

      request.onsuccess = (e) => {
        this._db = e.target.result;
        if (this.storename &&
            !this._db.objectStoreNames.contains(storename)) {
          this._db.close();
          let currentVersion = this._db.version;
          let newRequest = indexedDB.open(dbname, currentVersion + 1);
          newRequest.onsuccess = (e) => {
            this._db = e.target.result;
            resolve(this);
          };
          newRequest.onupgradeneeded = (e) => {
            this._onupgradeneeded(e);
          };
          newRequest.onerror = (e) => {
            reject("Error opening database when constructing DBHelper");
          };
          newRequest.onblocked = (e) => {
            console.warn('Opening database blocked when constructing DBHelper');
          }
        } else {
          resolve(this);
        }
      };

      request.onupgradeneeded = (e) => {
        this._onupgradeneeded(e);
      };
      request.onerror = (e) => {
        reject("Error opening database when constructing DBHelper");
      };
    });
  }

  _onupgradeneeded = (e) => {
    this._db = e.target.result;
    if (!this.storename) return;
    this._db.createObjectStore(this.storename, {keyPath: 'id'});
  };


  _getObjectStore() {
    if (!this._db) throw new Error("Database connection is not ready or has been closed.");
    try {
      return this._db.transaction([this.storename], 'readwrite')
            .objectStore(this.storename);
    } catch (e) {
      throw e;
    }
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
        reject('Error opening database when checking database existence');
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
        reject('Error querying object count');
      };
    });
  }

  closeConnection() {
    this._db.close();
  }
  deleteDatabase() {
    return new Promise((resolve, reject) => {
      // 关闭当前数据库连接。
      this._db.close();
      let deleteRequest = indexedDB.deleteDatabase(this.dbname);

      deleteRequest.onsuccess = (event) => {
        resolve('database ' + this.dbname + " deleted");
      };
      deleteRequest.onerror = (event) => {
        reject('Failed to delete database: ' + this.dbname);
      };
      deleteRequest.onblocked = (e) => {
        console.warn('database deletion blocked');
      }
    });
  }
}