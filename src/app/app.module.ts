import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { BoardComponent } from './components/board/board.component';
import { CategoryHistoricalComponent } from './components/category-historical/category-historical.component';
import { CategoryComponent } from './components/category/category.component';
import { ContactComponent } from './components/contact/contact.component';
import { GameHistoricalComponent } from './components/game-historical/game-historical.component';
import { GameComponent } from './components/game/game.component';
import { HeaderComponent } from './components/header/header.component';
import { ImageComponent } from './components/image/image.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { StatsComponent } from './components/stats/stats.component';
import { CategoryService } from './services/category.service';
import { DictionaryService } from './services/dictionary.service';
import { GameService } from './services/game.service';
import { GameDBService } from './services/gamedb.service';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    BoardComponent,
    RepositoryComponent,
    CategoryComponent,
    CategoryHistoricalComponent,
    ContactComponent,
    GameComponent,
    HeaderComponent,
    GameHistoricalComponent,
    ImageComponent,
    NavigationComponent,
    StatsComponent,
  ],
  imports: [AppRoutingModule, BrowserModule, HttpClientModule, FormsModule],
  providers: [CategoryService, DictionaryService, GameService, GameDBService],
  bootstrap: [AppComponent],
})
export class AppModule {}
