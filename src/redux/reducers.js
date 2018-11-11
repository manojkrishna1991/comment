import { ADD_COMMENT, POST_REPLY } from "./actionTypes";
import rest from '../rest'
const initialState = {
  comments: [],
  reply: []
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
    case POST_REPLY: {
      const { id, comment } = action.payload;
      rest.postReply(action.payload);
      const response = {
        id,
        reply:action.payload
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
