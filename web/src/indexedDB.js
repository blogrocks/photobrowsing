/**
 * Created by vimer on 03/12/2016.
 */
//prefixes of implementation that we want to test
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

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

  updateOneObject(o) {
    if (!('id' in o)) throw new Error('The object to add must have an id property.');
    let objectStore = this._getObjectStore();

    return new Promise((resolve, reject) => {
      let objectUpdate = objectStore.get(o.id);

      objectUpdate.onsuccess = () => {
        let data = objectUpdate.result;

        if (data) {
          let updateDataRequest = objectStore.put(o);

          updateDataRequest.onsuccess = () => {
            resolve('Object with id ' + data.id + ' updated successfully.');
          };
          updateDataRequest.onerror = () => {
            reject('Object with id ' + data.id + ' failed to update.');
          };
          updateDataRequest.onblocked = () => {
            console.warn('Object with id ' + data.id + ' update blocked.');
          };
        } else {
          console.warn('No object with id ' + o.id + ' in object store.');
          reject('No object with id ' + o.id + ' in object store.')
        }
      };

      objectUpdate.onerror = () => {
        reject('Error retrieving object with id ' + o.id);
      };

      objectUpdate.onblocked = () => {
        console.warn('Object with id ' + o.id + ' retrieving blocked.');
      };
    });
  }

  updateObjects(arr) {
    if (arr.length == null) throw new Error("The argument must be an array.");
    return new Promise((resolve, reject) => {
      arr.forEach((o, i) => {
        this.updateOneObject(o).then(
          (result) => {},
          (error) => {
            reject(error);
          }
        );
      });
      resolve('All objects are updated successfully.');
    });
  }

  addObjects(arr) {
    if (arr.length == null) throw new Error("The argument must be an array.");
    return new Promise((resolve, reject) => {
      arr.forEach((o, i) => {
        this.addOneObject(o).then(
          (result) => {},
          (error) => {
            reject(error);
          }
        );
      });
      resolve('All objects are added successfully.');
    });
  }

  addOneObject(o) {
    if (!('id' in o)) throw new Error('The object to add must have an id property.');
    let objectStore = this._getObjectStore();

    return new Promise((resolve, reject) => {
      let request = objectStore.add(o);
      request.onsuccess = (e) => {
        resolve('Object with id ' + o.id + ' added successfully');
      };
      request.onerror = (e) => {
        console.error("Error adding object with id " + o.id);
        reject("Error adding object with id " + o.id);
      };
      request.onblock = (e) => {
        console.warn('Object with id ' + o.id + ' adding blocked');
      };
    });
  }

  deleteOneObject(id) {
    let objectStore = this._getObjectStore();

    return new Promise((resolve, reject) => {
      let deleteRequest = objectStore.delete(id);

      deleteRequest.onsuccess = (e) => {
        resolve('Object with id ' + id + ' deleted successfully.');
      };
      deleteRequest.onerror = (e) => {
        console.error('Error deleting object with id ' + id);
        reject('Error deleting object with id ' + id);
      };
      deleteRequest.onblocked = (e) => {
        console.warn('Deleting object with id ' + id + ' blocked.');
      };
    });
  }

  deleteObjects(arrOfIds) {
    if (arrOfIds.length == null) throw new Error("The argument must be an array.");
    return new Promise((resolve, reject) => {
      arrOfIds.forEach((id, i) => {
        this.deleteOneObject(id).then(
          (result) => {},
          (error) => {
            reject(error);
          }
        );
      });
      resolve('All objects are deleted successfully');
    });
  }

  getOneObject(id) {
    let objectStore = this._getObjectStore();

    return new Promise((resolve, reject) => {
      let queryRequest = objectStore.get(id);

      queryRequest.onsuccess = (e) => {
        if (e.target.result) {
          resolve(e.target.result);
        } else {
          console.error("Couldn't find object with id " + id + " in the object store");
          resolve(null);
        }
      };

      queryRequest.onerror = (e) => {
        console.error('Error retrieving object with id ' + id);
        reject('Error retrieving object with id ' + id);
      };

      queryRequest.onblocked = (e) => {
        console.warn('Retrieving object with id ' + id + ' blocked.');
      };
    });
  }

  getObjects(arrOfIds) {
    let resArr = [];

    if (arrOfIds && arrOfIds.length == null) throw new Error("The argument must be an array.");
    if (!arrOfIds) {
      return new Promise((resolve, reject) => {
        let objectStore = this._getObjectStore();

        let openCursor = objectStore.openCursor();

        openCursor.onsuccess = (e) => {
          let cursor = e.target.result;

          if (cursor) {
            resArr.push(cursor.value);
            cursor.continue();
          } else {
            resolve(resArr);
          }
        };

        openCursor.onerror = (e) => {
          console.error('Error opening cursor');
          reject('Error opening cursor');
        };

        openCursor.onblocked = (e) => {
          console.warn('Opening cursor blocked');
        };
      });
    }
    return new Promise((resolve, reject) => {
      arrOfIds.forEach((id, i) => {
        this.getOneObject(id).then(
            (result) => {
              if (result) resArr.push(result);
            },
            (error) => {
              reject(error);
            }
        );
      });
      resolve(resArr);
    });
  }

  clearObjectStore() {
    let objectStore = this._getObjectStore();

    return new Promise((resolve, reject) => {
      let request = objectStore.clear();
      request.onsuccess = (e) => {
        resolve('Object store ' + this.storename + ' cleared.');
      };
      request.onerror = (e) => {
        reject("Error clearing object store " + this.storename);
      };
      request.onblock = (e) => {
        console.warn('Clearing object store ' + this.storename + ' blocked');
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