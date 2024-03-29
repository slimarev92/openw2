import { Injectable } from "@angular/core";
import { IDBPDatabase, openDB } from "idb";
import { filter, BehaviorSubject, Observable } from "rxjs";

function upgradeDb(db: IDBPDatabase) {
    db.createObjectStore("items", { keyPath: "canonicalName" });
    db.createObjectStore("meals", { keyPath: "name" });
}

@Injectable({ providedIn: "root"})
export class DbService {
    private readonly dbSubject = new BehaviorSubject<IDBPDatabase | null>(null);
    public readonly dbPromise: Promise<IDBPDatabase>;

    // TODO SASHA: figure out a better way than "as Observable<IDBPDatabase>"
    public readonly db$ = this.dbSubject.pipe(filter(v => !!v)) as Observable<IDBPDatabase>;

    constructor() {
        this.dbPromise = this.initDb();
    }

    private async initDb() {
        const db = await openDB("openw2", 1, { upgrade: upgradeDb });

        this.dbSubject.next(db);

        return db;
    }
}

