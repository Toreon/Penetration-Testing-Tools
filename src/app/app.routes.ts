import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.Home)
  },
  {
    path: 'tools',
    loadComponent: () => import('./components/tools-catalogue/tools-catalogue').then(m => m.ToolsCatalogue)
  },
  {
    path: 'tools/:id',
    loadComponent: () => import('./components/tool-detail/tool-detail').then(m => m.ToolDetail)
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about').then(m => m.About)
  },
  {
    path: 'contribute',
    loadComponent: () => import('./components/contribute/contribute').then(m => m.Contribute)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
