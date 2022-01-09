import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store-app';
import { addLogStart } from '../store-log';
import { fetchAllHeroesStart, selectHeroById, updateHeroStart } from '../store-hero';
import { ComponentStore } from '@ngrx/component-store';
import { HeroDetailState, HeroDetailStore } from './hero-detail-store';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
  providers: [HeroDetailStore] // lazy inject service
})
export class HeroDetailComponent implements OnInit {
  hero?: Hero;
  topMessages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>,
    private readonly componentStore: HeroDetailStore
  ) { }

  ngOnInit(): void {
    // listening state action error
    this.componentStore.saveHeroFail.subscribe(error => {
      if (error) { alert('saveHeroFail'); }
    });
    this.componentStore.fetchHeroFail.subscribe(error => {
      if (error) { alert('fetchHeroFail'); }
    })
    // Lazy initialization state
    // this.componentStore.setState({hero: {...hero}, messages: ['init component state']})
    this.getHero();
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.componentStore.fetchHero(id);
    this.componentStore.hero$.subscribe(hero => {
      this.hero = hero;
    })
    this.componentStore.topNMessage(3).subscribe(messages => {
      this.topMessages = messages;
    })
    this.store.dispatch(addLogStart({ text: `HeroDetailComponent.getHero ${id}` }));
  }

  goBack(): void {
    this.store.dispatch(addLogStart({ text: `HeroDetailComponent.goBack` }));
    this.location.back();
  }

  save(): void {
    this.store.dispatch(addLogStart({ text: `HeroDetailComponent.save` }));
    this.componentStore.addMessage('HeroDetailComponent.save');
    if (this.hero) {
      this.componentStore.saveHero(this.hero);
    }
  }
}
