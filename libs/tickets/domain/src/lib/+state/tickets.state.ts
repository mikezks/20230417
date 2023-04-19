import { Store, createActionGroup, createFeature, createReducer, createSelector, emptyProps, on, props, provideState } from "@ngrx/store";
import { Flight } from "../entities/flight";
import { EnvironmentProviders, inject } from "@angular/core";
import { Actions, createEffect, ofType, provideEffects } from "@ngrx/effects";
import { switchMap, map } from "rxjs";
import { FlightService } from "../infrastructure/flight.service";

/**
 * Actions
 */

export const ticketsActions = createActionGroup({
  source: 'tickets',
  events: {
    'flights load': props<{ from: string, to: string }>(),
    'flights loaded': props<{ flights: Flight[] }>(),
    'flight update': props<{ flight: Flight }>(),
    'flight clear': emptyProps(),
  }
});

/**
 * Model
 */

export interface TicketsState {
  flights: Flight[];
  basket: unknown;
  user: { passengerId: number; username: string };
  tickets: Record<number, { passengerId: number; flightId: number }>;
  ticketIds: number[];
}

export const initialState: TicketsState = {
  flights: [],
  basket: {},
  user: { passengerId: 1, username: 'jane.doe' },
  tickets: {
    1: { passengerId: 1, flightId: 163 },
    2: { passengerId: 1, flightId: 165 }
  },
  ticketIds: [2, 1]
};

/**
 * Feature
 *  - Reducer
 *  - Selectors
 */

export const ticketsFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialState,

    on(ticketsActions.flightsLoaded, (state, action) => {
      return {
        ...state,
        flights: action.flights
      };
    })
  ),
  extraSelectors: ({
    selectUser,
    selectFlights,
    selectTickets
  }) => ({
    selectActiveUserFlights: createSelector(
      // Selectors
      selectUser,
      selectFlights,
      selectTickets,
      // Projector
      (user, flights, tickets) => {
        const activeUserPassengerId = user.passengerId;
        const activeUserFlightIds = Object.values(tickets)
          .filter(ticket => ticket.passengerId === activeUserPassengerId)
          .map(ticket => ticket.flightId);

        return flights
          .filter(flight => activeUserFlightIds.includes(flight.id));
      }
    )
  })
});

/**
 * Effects
 */

export const loadFlights$ = createEffect((
  actions = inject(Actions),
  flightService = inject(FlightService)
) => actions.pipe(
  ofType(ticketsActions.flightsLoad),
  switchMap(action => flightService.find(action.from, action.to)),
  map(flights => ticketsActions.flightsLoaded({ flights }))
), { functional: true });

/**
 * Provider
 */

export function provideDomain(): EnvironmentProviders[] {
  return [
    provideState(ticketsFeature),
    provideEffects({ loadFlights$ })
  ];
}

/**
 * Facade
 */

export function injectTicketsFeature() {
  const store = inject(Store);

  return {
    flights$: store.select(ticketsFeature.selectFlights),
    search: (from: string, to: string) => store.dispatch(
      ticketsActions.flightsLoad({ from, to })
    )
  };
}
