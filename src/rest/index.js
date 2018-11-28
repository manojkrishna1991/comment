import axios from 'axios';
import { GET_EVENTS, POST_EVENT, POST_REPLY ,GUEST_USER } from '../config';

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

const createGuestUser = async(data) => {
    const response = await axios.post(GUEST_USER,data,{ headers: { "Access-Control-Allow-Origin": "*", }}
    )
    console.log('success');
    console.log(response);
    return response;
}

export default { getEvents, postEvent ,postReply ,createGuestUser }