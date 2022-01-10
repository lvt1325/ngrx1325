import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { AppState } from '../store-app';
import { selectHeroesWithFilter } from '../store-hero';
import { addLogStart } from '../store-log';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new BehaviorSubject<string>('');
  @Input() searchTerm: string = '';
  @Input() filteredHeroes?: Hero[] = undefined;
  @Output() doFilterHero = new EventEmitter<string>();

  constructor(private store: Store<AppState>) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.store.dispatch(addLogStart({ text: `HeroSearchComponent.search ${term}` }));
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => {
        return of(this.doFilterHero.emit(term));
      })
    ).subscribe();
    this.search(this.searchTerm);
  }
}
