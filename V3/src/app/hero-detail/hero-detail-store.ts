import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { BehaviorSubject, catchError, EMPTY, firstValueFrom, lastValueFrom, of, switchMap, tap } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { AppState } from "../store-app";
import { selectTopNLogs } from "../store-log";

export interface HeroDetailState {
    hero?: Hero,
    messages: string[],
}

@Injectable()// lazy inject service in component by `providers: [HeroDetailStore]`
export class HeroDetailStore extends ComponentStore<HeroDetailState> {
    /**
     * ComponentStore can be initialized in 2 ways:
        1. Eager initialization: through the constructor.
            + The state is ready before any manipulating.
            ! Could trigger meaningless event because the initial state usually empty/undefined.
        2. Lazy initialization: by calling setState and passing an object that matches the state interface.
            + Developer controls the timing to init the state.
            ! All manipulating MUST do after intiting the state.
     */

    // Eager initialization
    constructor(private store: Store<AppState>, private heroService: HeroService) {
        super({ hero: undefined, messages: ['hello'] });
    }

    //#region READ
    readonly hero$: Observable<Hero> = this.select((state: HeroDetailState) => {
        return (state.hero as Hero)
    });

    readonly topNMessage = (topN: number) => this.select(state =>
        state.messages.slice(state.messages.length - topN, state.messages.length));

    readonly samepleCombineSelectors$: Observable<{ hero: Hero, messages: string[], logs: string[] }> =
        this.select(this.hero$, this.topNMessage(3), this.store.select(selectTopNLogs(3)), (hero, messages, logs) => {
            return { hero: hero, messages: messages, logs: logs }
        })
    //#endregion

    //#region WRITE, usually it is CRUD methods
    readonly addMessage = this.updater((state, message: string) => {
        state.messages.push(message + ' ' + Date.now());
        return state;
    });
    readonly updateHero = this.updater((state, hero: Hero) => {
        state.hero = hero;
        return state;
    })
    readonly writeSomething = this.updater((state) => {
        alert('writeSomething');
        return state;
    })
    //#endregion

    //#region EFFECT
    readonly fetchHeroFail = new BehaviorSubject<any>(undefined);
    readonly fetchHero = this.effect((heroId$: Observable<number>) => {
        // Each new call of fetchHero(id) pushed that id into heroId$ stream.
        return heroId$.pipe(
            // Handle race condition with the proper choice of the flattening operator.
            switchMap((id) => this.heroService.getHero(id).pipe(
                // Act on the result within inner pipe.
                tapResponse((hero) => {
                    // fetch hero success, update the hero in state
                    this.updateHero(hero);
                }, (error) => {
                    // fetch hero fail
                    this.fetchHeroFail.next(error);
                }),
            )),
        );
    });

    readonly saveHeroFail = new BehaviorSubject<any>(undefined);
    readonly saveHero = this.effect((hero$: Observable<Hero>) => {
        return hero$.pipe(
            switchMap((tobeUpdatehero) => this.heroService.updateHero(tobeUpdatehero).pipe(
                tapResponse(async (updatedHeror) => {
                    // inspect the state
                    const state = this.get(); console.log(state);
                    // read a slice of state
                    let messages = await firstValueFrom(this.topNMessage(10)); console.log(messages);
                    // save hero success, update the hero in state
                    of(
                        // sample of chain updaters
                        this.updateHero(updatedHeror || tobeUpdatehero), // it should use the updated hero from BE if any
                        // this.writeSomething()
                    )
                }, (error) => {
                    // save hero fail
                    this.saveHeroFail.next(error);
                }),
            )),
        );
    });
    //#endregion
}