import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private counter = 0;

  constructor() { }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const id = this.counter++;
    const notification: Notification = {
      message, type, id
    };
    const current = this.notifications.getValue();
    this.notifications.next([...current, notification]);

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  private remove(id: number): void {
    const current = this.notifications.getValue();
    this.notifications.next(current.filter(n => n.id !== id));
  }
}
