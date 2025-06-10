import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private _count = signal(0);

  count = this._count.asReadonly();

  increment() {
    this._count.update((c) => c + 1);
  }

  decrement() {
    this._count.update((c) => Math.max(0, c - 1));
  }

}
