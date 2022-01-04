import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ActionReducerMap, createAction, createFeatureSelector, createReducer, createSelector, on, props, Store } from "@ngrx/store";
import { switchMap, mergeMap, of, catchError, withLatestFrom } from "rxjs";
import { AppState } from "./store-app";

export const MyHeroStateKey = '_MyHeroStateKey';

export interface MyHeroState {
    logs: string[];
}

export const myHeroStateInition: MyHeroState = {
    logs: []
}

//#region ACTION
export const addLogStart = createAction('add log start', props<{ text: string }>());
export const addLogSuccess = createAction('add log success', props<{ text: string }>());
export const addLogFail = createAction('add log fail', props<{ error: string }>());
export const clearLog = createAction('clear log');
//#endregion

//#region EFFECT 
@Injectable()
export class MyHeroEffects {
    constructor(private actions$: Actions, private store: Store<AppState>) { }

    addLog$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addLogStart),
            // if need to inspect the current state or a slice of state
            withLatestFrom(this.store.select(selectMyHeroState()), this.store.select(selectTopNLogs(1))),
            switchMap(([action, state, lastLog]) => {
            // switchMap: just process for the latest event, all of previous one is canceled
            // mergeMap: use it if each event need to process independently
                console.log('state', state);
                console.log('lastLog', lastLog);
                return of(action.text) // or call api to do something on server
                    .pipe(
                        // server done
                        mergeMap((returnedText) => {
                            return of(addLogSuccess({ text: returnedText }));
                            // Return multiple actions in order:
                            // return of(addLogSuccess({ text: returnedText }), addLogSuccess({ text: returnedText }));
                        }),
                        // server error
                        catchError(err => {
                            return of(addLogFail({ error: err }));
                        })
                    );
            })
        )
    )
}

//#region REDUCER
export const MyHeroReducer = createReducer(myHeroStateInition,
    on(addLogSuccess, (state, action): MyHeroState => {
        const clonedLogs = state.logs.slice();
        clonedLogs.push(action.text);
        const newState = { ...state, logs: clonedLogs }
        console.log(`Action: ${action.type}`, newState);
        return newState;
    }),
    on(clearLog, (state, action): MyHeroState => {
        const newState = { ...state, logs: [] };
        console.log(`Action: ${action.type}`, newState);
        return newState
    })
)
//#endregion

//#region SELECTOR
const selectMyHeroStateStoreFeature = createFeatureSelector<MyHeroState>(MyHeroStateKey);
export const selectMyHeroState = () => createSelector(selectMyHeroStateStoreFeature, (state: MyHeroState): MyHeroState => {
    return state;
})
export const selectTopNLogs = (topN: number) => createSelector(selectMyHeroStateStoreFeature, (state: MyHeroState): string[] => {
    return state.logs.slice(state.logs.length - topN, state.logs.length);
})
//#endregion