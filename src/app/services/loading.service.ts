import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading = this.loadingSubject.asObservable();

  mostrar() {
    this.loadingSubject.next(true);
  }

  ocultar() {
    this.loadingSubject.next(false);
  }
}
