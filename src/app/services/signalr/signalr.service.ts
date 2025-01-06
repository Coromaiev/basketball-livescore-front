import { Injectable } from '@angular/core';
import * as signalr from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection! : signalr.HubConnection;

  startConnection(hubUrl: string): void {
    this.hubConnection = new signalr.HubConnectionBuilder()
      .withUrl(hubUrl, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .then(() => console.log("SignalR connection established"))
      .catch((error) => console.error("Error connecting to signalR hub:", error))
  }

  listenToUpdates(methodName: string, callback: (...args: any[]) => void): void {
    this.hubConnection.on(methodName, callback);
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR connection stopped.'))
        .catch((err) => console.error('Error stopping SignalR connection: ', err));
    }
  }
}
