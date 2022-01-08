import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { AppState } from '../store-app';
import { fetchAllHeroesStart, selectAllHeroes, selectTopNHeroes } from '../store-hero';
import { addLogStart } from '../store-log';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(addLogStart({text: `DashboardComponent.ngOnInit`}));
    this.store.dispatch(fetchAllHeroesStart());
    this.store.select(selectTopNHeroes(3)).subscribe((heroes) =>{
      this.heroes = heroes;
    })
  }
}
