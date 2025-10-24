import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private platform: Platform,
    private router: Router) {
    this.platform.ready().then(res => {  
      this.initApp();
    });
  }

  async initApp() {
    if (this.platform.is('capacitor')) {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false }); // content not under status bar
        await StatusBar.setStyle({ style: Style.Light }); // or Style.Dark
        await StatusBar.setBackgroundColor({ color: '#ffffff' }); // set your app background color
      } catch (err) {
        console.log('StatusBar init error:', err);
      }
    }
    this.router.navigateByUrl('/login');
  }
}
