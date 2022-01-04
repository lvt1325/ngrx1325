import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { AppState } from '../store-app';
import { addLogStart } from '../store-hero';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.store.dispatch(addLogStart({text: `DashboardComponent.getHeroes`}));
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }
}
