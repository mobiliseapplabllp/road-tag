import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ModalComponent } from './pages/modal/modal.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'road-tag',
    loadChildren: () => import('./pages/road-tag/road-tag.module').then( m => m.RoadTagPageModule)
  },
  {
    path: 'road-update',
    loadChildren: () => import('./pages/road-update/road-update.module').then( m => m.RoadUpdatePageModule)
  },
  {
    path: 'modal',
    component: ModalComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
