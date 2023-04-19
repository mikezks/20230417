import { createFeature, createReducer, on } from "@ngrx/store";
import { Flight } from "../entities/flight";
import { ticketsActions } from "./actions";

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
  )
});
