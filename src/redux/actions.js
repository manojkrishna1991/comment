import { ADD_COMMENT,POST_REPLY } from './actionTypes';

let nextTodoId = 0;

let nextTodoReplyId = 0;

export const addComment = comment => (
  {
  type: ADD_COMMENT,
  payload: {
    id: ++nextTodoId,
    comment
  }
});

export const addReply = (reply) =>(
{
  type: POST_REPLY,
  payload: {
    id:++nextTodoReplyId,
    reply
  }
}
);