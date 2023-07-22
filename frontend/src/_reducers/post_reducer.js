import { SELECT_POST } from "../_actions/types";


export default function post_reducer (state ={}, action) {
    switch (action.type) {
      case SELECT_POST:
        return {
          ...state,
          selectedPost: action.payload,
        };
      default:
        return state;
    }
  };
  