import { Injectable } from "@angular/core";
import { IDBPDatabase, openDB } from "idb";
import { filter, Subject } from "rxjs";

@Injectable({ providedIn: "root"})
export class DbService {
    private readonly dbSubject = new Subject<IDBPDatabase>();
    private readonly upgradeDb = (db: IDBPDatabase) => {
        db.createObjectStore("items", { keyPath: "name" });
        db.createObjectStore("meals", { keyPath: "name" });
    };

    public db$ = this.dbSubject.pipe(filter(v => !!v));

    constructor() {
        this.initDb();
    }

    private async initDb() {
        const db = await openDB("openw2", 1, { upgrade: this.upgradeDb });

        this.dbSubject.next(db);
    }
}

