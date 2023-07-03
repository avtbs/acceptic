import { Injectable } from '@angular/core';

enum StorageKeys {
    Response = 'response',
}
type StorageGetters = {
    [Property in keyof typeof StorageKeys as `get${Capitalize<string & Property>}`]: () => any;
};

type StorageSetters = {
    [Property in keyof typeof StorageKeys as `set${Capitalize<string & Property>}`]: (value:any) => void;
};

type StorageRemovers = {
    [Property in keyof typeof StorageKeys as `remove${Capitalize<string & Property>}`]: (value:any) => void;
};

export interface IStorageService extends StorageGetters, StorageSetters, StorageRemovers {
    get:(key: string) => any;
    set:(key: string, value: any) => void;
    remove:(key: string) => void;
    // it's just a test
}

@Injectable({
    providedIn: 'root',
})
export class StorageService{
    private storage = sessionStorage;
    private constructor() {
        for (const enumMember in StorageKeys) {
            const key = enumMember as keyof typeof StorageKeys;
            (this as any)[`get${enumMember}`] = () => this.get(StorageKeys[key]);
            (this as any)[`set${enumMember}`] = (value: string) => { this.set(StorageKeys[key], value); };
            (this as any)[`remove${enumMember}`] = () => { this.remove(StorageKeys[key]); };
        }
    }

    public get(key: string): any{
        const val = this.storage.getItem(key) || this.storage[key];
        return val ? JSON.parse(val) : null;
    }

    public set(key: string, value: any): void{
        this.storage.setItem(key, JSON.stringify(value));
    }

    public remove(key: string): void{
        this.storage.removeItem(key);
    }
}
