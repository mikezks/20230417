import { createSelector } from "@ngrx/store";
import { ticketsFeature } from "./reducer";

export const selectActiveUserFlights = createSelector(
  // Selectors
  ticketsFeature.selectUser,
  ticketsFeature.selectFlights,
  ticketsFeature.selectTickets,
  // Projector
  (user, flights, tickets) => {
    const activeUserPassengerId = user.passengerId;
    const activeUserFlightIds = Object.values(tickets)
      .filter(ticket => ticket.passengerId === activeUserPassengerId)
      .map(ticket => ticket.flightId);

    return flights
      .filter(flight => activeUserFlightIds.includes(flight.id));
  }
);
