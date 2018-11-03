import axios from 'axios';
import { GET_EVENTS, POST_EVENT } from '../config';

const getEvents = (eventId) => {
    console.log('This is get event');
    const url = GET_EVENTS + eventId
    return axios.get(url);
}

const postEvent = async (data) => {
    console.log('post is called');
   const response = await axios.post(
        POST_EVENT,
        data.comment,
        { headers: { "Access-Control-Allow-Origin": "*", } }
    );
    console.log('post is finished');
    console.log(response);

}

export default { getEvents, postEvent }