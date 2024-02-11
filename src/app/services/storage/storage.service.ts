import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const SESSION_STATE = 'session-state'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public setSessionState(state: any): void {
    window.sessionStorage.removeItem(SESSION_STATE);
    window.sessionStorage.setItem(SESSION_STATE,state);
  }
  public isExpired(): boolean {
     if(window.sessionStorage.getItem(SESSION_STATE) == "expired"){
      return true;
     }
     return false;
  }


  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log("user fron storage",user);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}