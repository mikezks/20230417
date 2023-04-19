import { EnvironmentProviders } from "@angular/core";
import { provideEffects } from '@ngrx/effects';
import { provideState } from "@ngrx/store";
import { ticketsFeature } from "./reducer";

export function provideDomain(): EnvironmentProviders[] {
  return [
    provideState(ticketsFeature),
    provideEffects()
  ];
}