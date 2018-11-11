import axios from 'axios';
import { GET_EVENTS, POST_EVENT, POST_REPLY } from '../config';

const getEvents = (eventId) => {
    const url = GET_EVENTS + eventId
    return axios.get(url);
}

const postEvent = async (data) => {
   const response = await axios.post(
        POST_EVENT,
        data.comment,
        { headers: { "Access-Control-Allow-Origin": "*", } }
    );

}

const postReply = async (data) => {
    const response = await axios.post(
        POST_REPLY,
        data.reply,
        { headers: { "Access-Control-Allow-Origin": "*", } }
    )
}

export default { getEvents, postEvent ,postReply }