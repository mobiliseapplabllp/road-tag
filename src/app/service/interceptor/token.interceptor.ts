import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { inject } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { catchError, from, throwError, switchMap, of } from 'rxjs';

let isLoggingOut = false; 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const alertCtrl = inject(AlertController);
  const modalCtrl = inject(ModalController);
  const router = inject(Router);    
  
  const userToken = localStorage.getItem('token1');
  const currentLan = localStorage.getItem('currentLan') || 'en';
  const setHeaders: Record<string, string> = {};  
  if (userToken) {
    setHeaders['Authorization'] = `Bearer ${userToken}`;
    setHeaders['Accept'] = 'application/json';        
  }
  setHeaders['Referer1'] = environment.referUrl;
  const cloned = req.clone({ setHeaders });

  return next(cloned).pipe(
    catchError((error) => {
      if (error.status === 401) {
        if (isLoggingOut) {
          isLoggingOut = false;
          return throwError(() => error);
        }
        isLoggingOut = true;
        return from(dismissAllModals(modalCtrl)).pipe(
          catchError(() => of(null)),
          switchMap(() =>
            from(
              alertCtrl.create({
                header: 'Session Expired',
                message: 'Your session has expired Please log in again',
                buttons: ['OK']
              })
            )
          ),
          switchMap((alert) =>
            from(alert.present()).pipe(
              switchMap(() => {
                router.navigateByUrl('/login', { replaceUrl: true });
                return throwError(() => error);
              })
            )
          )
        );
      }
      return throwError(() => error);
    })
  );
};

function dismissAllModals(modalCtrl: ModalController): Promise<void> {  
  return modalCtrl.getTop().then((topModal) => {
    if (topModal) {
      return modalCtrl.dismiss().then(() => dismissAllModals(modalCtrl));
    }
    return;
  });
}
