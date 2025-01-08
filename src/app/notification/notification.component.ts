import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../services/notifications/notifications.service';
import { Notification } from '../models/notification.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  notifications$: Observable<Notification[]>;

  constructor(private notificationService: NotificationsService) {
    this.notifications$ = this.notificationService.getNotifications();
  }

  ngOnInit(): void { }
}
