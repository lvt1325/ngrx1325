import { ActionReducerMap } from "@ngrx/store";
import { MyHeroEffects, MyHeroReducer, MyHeroState, MyHeroStateKey } from "./store-hero";

//#region DECLARE store
// declare state
export interface AppState {
    [MyHeroStateKey]: MyHeroState;
    // ... more slice of app state here ...
    // [SettingKey]: SettingState
}
// declare reducer
export const appReducer: ActionReducerMap<AppState> = {
    [MyHeroStateKey]: MyHeroReducer,
    // ... more reducer here ...
    // [SettingKey]: SettingReducer
};
// declare effect
export const appEffect = [MyHeroEffects, /*SettingEffect ... more effect here ...*/]
//#endregion