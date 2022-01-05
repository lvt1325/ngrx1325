import { Injectable } from "@angular/core";
import { act, Actions, createEffect, ofType } from "@ngrx/effects";
import { ActionReducerMap, createAction, createFeatureSelector, createReducer, createSelector, on, props, Store } from "@ngrx/store";
import { switchMap, mergeMap, of, catchError, withLatestFrom } from "rxjs";
import { Hero } from "./hero";
import { HeroService } from "./hero.service";
import { AppState } from "./store-app";

export const MyHeroStateKey = '_MyHeroStateKey';

export interface MyHeroState {
    heroes: Hero[];
    selectedHero?: Hero;
}

export const myHeroStateInition: MyHeroState = {
    heroes: [],
    selectedHero: undefined
}

//#region ACTION
export const fetchAllHeroesStart = createAction('fetchAllHeroesStart');
export const fetchAllHeroesSuccess = createAction('fetchAllHeroesSuccess', props<{ heroes: Hero[] }>());
export const fetchAllHeroesFail = createAction('fetchAllHeroesFail', props<{ error: string }>());

export const fetchOneHeroStart = createAction('fetchHeroStart', props<{ heroId: number }>());
export const fetchOneHeroSuccess = createAction('fetchHeroSuccess', props<{ hero: Hero }>());
export const fetchOneHeroFail = createAction('fetchHeroFail', props<{ error: string }>());

export const addHeroStart = createAction('addHeroStart', props<{ hero: Hero }>());
export const addHeroSuccess = createAction('addHeroSuccess', props<{ hero: Hero }>());
export const addHeroFail = createAction('addHeroFail', props<{ error: string }>());

export const updateHeroStart = createAction('updateHeroStart', props<{ hero: Hero }>());
export const updateHeroSuccess = createAction('updateHeroSuccess', props<{ hero: Hero }>());
export const updateHeroFail = createAction('updateHeroFail', props<{ error: string }>());
//#endregion

//#region REDUCER
export const MyHeroReducer = createReducer(myHeroStateInition,
    on(fetchAllHeroesSuccess, (state, action): MyHeroState => {
        const newState = { ...state, heroes: action.heroes }
        console.log(`Action: ${action.type}`, newState);
        return newState;
    }),
    on(fetchOneHeroSuccess, (state, action): MyHeroState => {
        const newState = { ...state, selectedHero: action.hero }
        console.log(`Action: ${action.type}`, newState);
        return newState;
    }),
    on(addHeroSuccess, (state, action): MyHeroState => {
        const clonedHeroes = state.heroes.slice();
        clonedHeroes.push(action.hero);
        const newState = { ...state, heroes: clonedHeroes }
        console.log(`Action: ${action.type}`, newState);
        return newState;
    }),
    on(updateHeroSuccess, (state, action): MyHeroState => {
        const updatedHeroIndex = state.heroes.findIndex(hero => hero.id === action.hero.id);
        const newState = {
            ...state,
            heroes: {
                ...state.heroes,
                [updatedHeroIndex]: {
                    ...state.heroes[updatedHeroIndex],
                    name: action.hero.name
                }
            }
        }
        console.log(`Action: ${action.type}`, newState);
        return newState;
    }),
)
//#endregion

//#region SELECTOR
const selectMyHeroStateStoreFeature = createFeatureSelector<MyHeroState>(MyHeroStateKey);
export const selectMyHeroState = () => createSelector(selectMyHeroStateStoreFeature, (state: MyHeroState): MyHeroState => {
    return state;
})
export const selectTopNHeroes = (topN: number) => createSelector(selectMyHeroStateStoreFeature, (state: MyHeroState): Hero[] => {
    return state.heroes.slice(state.heroes.length - topN, state.heroes.length);
})
export const selectAllHeroes = () => createSelector(selectMyHeroStateStoreFeature, (state: MyHeroState): Hero[] => {
    return state.heroes;
})
export const selectHeroesWithFilter = (filterText: string) => createSelector(selectMyHeroStateStoreFeature, (state: MyHeroState): Hero[] => {
    return state.heroes.filter(hero => hero.name.includes(filterText));
})
//#endregion

//#region EFFECT 
@Injectable()
export class MyHeroEffects {

    constructor(private actions$: Actions, private store: Store<AppState>, private heroService: HeroService) { }

    fetchAllHeroes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchAllHeroesStart),
            // if need to inspect the current state or a slice of state
            withLatestFrom(this.store.select(selectMyHeroState()), this.store.select(selectHeroesWithFilter('name'))),
            switchMap(([action, state, filteredHeroes]) => {
                // switchMap: just process for the latest event, all of previous one is canceled
                // mergeMap: use it if each event need to process independently
                console.log('state', state);
                console.log('filteredHeroes', filteredHeroes);
                return this.heroService.getHeroes()
                    .pipe(
                        // server return
                        mergeMap(returnedHeroes => {
                            return of(fetchAllHeroesSuccess({ heroes: returnedHeroes }));
                            // Return multiple actions in order:
                            // return of(fetchAllHeroesSuccess({heroes: returnedHeroes}), fetchAllHeroesSuccess({heroes: returnedHeroes}));
                        }),
                        // server error
                        catchError(err => {
                            return of(fetchAllHeroesFail({ error: err }));
                        })
                    );
            })
        )
    );

    fetchOneHero$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchOneHeroStart),
            switchMap(action => {
                return this.heroService.getHero(action.heroId)
                    .pipe(
                        // server return
                        mergeMap(returnedHero => {
                            return of(fetchOneHeroSuccess({ hero: returnedHero }));
                        }),
                        // server error
                        catchError(err => {
                            return of(fetchOneHeroFail({ error: err }));
                        })
                    );
            })
        )
    );

    addHero$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addHeroStart),
            switchMap(action => {
                return this.heroService.addHero(action.hero)
                    .pipe(
                        // server return
                        mergeMap(addedHero => {
                            return of(addHeroSuccess({ hero: addedHero }));
                        }),
                        // server error
                        catchError(err => {
                            return of(addHeroFail({ error: err }));
                        })
                    );
            })
        )
    );

    updateHero$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateHeroStart),
            switchMap(action => {
                return this.heroService.updateHero(action.hero)
                    .pipe(
                        // server return
                        mergeMap(updatedHero => {
                            return of(updateHeroSuccess({ hero: updatedHero }));
                        }),
                        // server error
                        catchError(err => {
                            return of(updateHeroFail({ error: err }));
                        })
                    );
            })
        )
    )
}
