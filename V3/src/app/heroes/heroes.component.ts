import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
// V2 Component as Presentation Component
export class HeroesComponent implements OnInit {
  @Input() heroes: Hero[] = [];
  @Output() onClickButtonAddHero = new EventEmitter<{heroName: string}>()

  constructor() { }

  ngOnInit(): void {
  }

  add(name: string): void {
    if (name) {
      this.onClickButtonAddHero.emit({heroName: name})
    } else {
      alert('Please provide hero name');
    }
  }
}
