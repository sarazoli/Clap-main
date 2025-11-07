import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () => 
      import('./home/home.page').then((m) => m.HomePage),
  },
{
  path: 'detalhes/:id',
  loadComponent: () => import('./detalhes/detalhes.page').then(m => m.DetalhesPage)
},
  {
    path: '',
    redirectTo: 'login', // O app começa no login
    pathMatch: 'full',
  },
];
