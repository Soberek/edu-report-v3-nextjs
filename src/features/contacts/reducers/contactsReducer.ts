/**
 * Contacts reducer
 * Pure reducer function for managing contacts state
 */

import { ContactsState, ContactsAction } from "../types";

export const initialState: ContactsState = {
  data: [],
  loading: true,
  error: null,
};

/**
 * Pure reducer function for contacts state management
 * Handles all state transitions through discriminated union actions
 *
 * @param state - Current contacts state
 * @param action - Action to dispatch
 * @returns New state
 */
export function contactsReducer(state: ContactsState, action: ContactsAction): ContactsState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_DATA":
      return { ...state, data: action.payload, loading: false, error: null };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "ADD_CONTACT":
      return { ...state, data: [action.payload, ...state.data] };

    case "UPDATE_CONTACT":
      return {
        ...state,
        data: state.data.map((contact) =>
          contact.id === action.payload.id ? action.payload : contact
        ),
      };

    case "DELETE_CONTACT":
      return {
        ...state,
        data: state.data.filter((contact) => contact.id !== action.payload),
      };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
}
