import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { GameHistoricalComponent } from './components/game-historical/game-historical.component';
import { GameComponent } from './components/game/game.component';
import { RepositoryComponent } from './components/repository/repository.component';

const routes: Routes = [
  { path: '', component: GameComponent, data: { title: 'Home' } },
  {
    path: 'historical',
    component: GameHistoricalComponent,
    data: { title: 'Historical' },
  },
  {
    path: 'repository',
    component: RepositoryComponent,
    data: { title: 'Repository' },
  },
  { path: 'about', component: AboutComponent, data: { title: 'About' } },
  { path: 'contact', component: ContactComponent, data: { title: 'Contact' } },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
