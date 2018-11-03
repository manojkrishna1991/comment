import { ADD_COMMENT } from "./actionTypes";
import rest from '../rest'
const initialState = {
  comments: [],
};


export default  function(state = initialState, action) {
  switch (action.type) {
    case ADD_COMMENT: {
      const { id, comment } = action.payload;
      rest.postEvent(action.payload);
      const response = {
        id,
        comment:action.payload
      }
      return [
        ...state,
        response
      ]
    }
    default:
      return state;
  }
}
