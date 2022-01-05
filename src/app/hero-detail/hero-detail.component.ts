import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store-app';
import { addLogStart } from '../store-log';
import { fetchAllHeroesStart, selectHeroById, updateHeroStart } from '../store-hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero?: Hero;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchAllHeroesStart());
    this.getHero();
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.store.select(selectHeroById(id)).subscribe(hero => {
      this.hero = {...hero};
    })
    this.store.dispatch(addLogStart({text: `HeroDetailComponent.getHero ${id}`}));
  }

  goBack(): void {
    this.store.dispatch(addLogStart({text: `HeroDetailComponent.goBack`}));
    this.location.back();
  }

  save(): void {
    this.store.dispatch(addLogStart({text: `HeroDetailComponent.save`}));
    if (this.hero)
    this.store.dispatch(updateHeroStart({hero: this.hero}))
  }
}
