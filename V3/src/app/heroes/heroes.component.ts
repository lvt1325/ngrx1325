import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { AppState } from '../store-app';
import { addHeroStart, selectAllHeroes } from '../store-hero';
import { addLogStart } from '../store-log';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.store.dispatch(addLogStart({ text: 'HeroesComponent.getHeroes' }));
    this.store.select(selectAllHeroes()).subscribe(heroes => {
      this.heroes = heroes;
    })
  }

  add(name: string): void {
    this.store.dispatch(addLogStart({ text: `HeroesComponent.add ${name}` }));
    name = name.trim();
    if (name) {
      this.store.dispatch(addHeroStart({hero: {name: name}}));
    } else {
      alert('Please provide hero name');
    }
  }
}
