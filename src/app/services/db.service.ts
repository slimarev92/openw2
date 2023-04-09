import { Injectable } from "@angular/core";
import { IDBPDatabase, openDB } from "idb";
import { BehaviorSubject, filter, map, Observable, take } from "rxjs";

@Injectable({ providedIn: "root"})
export class DbService {
    private dbSubject = new BehaviorSubject<IDBPDatabase | null>(null);
    private upgradeDb = (db: IDBPDatabase) => {
        db.createObjectStore("items", { keyPath: "name" });
        db.createObjectStore("meals", { keyPath: "name" });
    };

    // todo sasha: figure out a better way than "as Observable<IDBPDatabase>"
    public db$: Observable<IDBPDatabase> = this.dbSubject.pipe(filter(v => !!v)) as Observable<IDBPDatabase>;

    constructor() {
        this.initDb();
    }

    private async initDb() {
        const db = await openDB("openw2", 1, { upgrade: this.upgradeDb });

        this.dbSubject.next(db);
    }
}

