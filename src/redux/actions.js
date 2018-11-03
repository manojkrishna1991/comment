import { ADD_COMMENT } from './actionTypes';
import { postEvent } from '../rest'

let nextTodoId = 0;

export const addComment = comment => (
  {
  type: ADD_COMMENT,
  payload: {
    id: ++nextTodoId,
    comment
  }
});