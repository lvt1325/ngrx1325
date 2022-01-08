import { ActionReducerMap } from "@ngrx/store";
import { MyHeroEffects, MyHeroReducer, MyHeroState, MyHeroStateKey } from "./store-hero";
import { MyLogEffects, MyLogReducer, MyLogState, MyLogStateKey } from "./store-log";

//#region DECLARE store
// declare state
export interface AppState {
    [MyLogStateKey]: MyLogState;
    [MyHeroStateKey]: MyHeroState;
    // ... more slice of app state here ...
}
// declare reducer
export const appReducer: ActionReducerMap<AppState> = {
    [MyLogStateKey]: MyLogReducer,
    [MyHeroStateKey]: MyHeroReducer,
    // ... more reducer here ...
};
// declare effect
export const appEffect = [MyLogEffects, MyHeroEffects, /*... more effect here...*/]
//#endregion