import axios from 'axios';
import { GET_EVENTS, POST_EVENT, POST_REPLY ,GUEST_USER,ADD_LIKES,CREATE_AUTH } from '../config';

const getEvents = (eventId,token) => {
    const url = GET_EVENTS + eventId
    return axios.get(url,{
        params:{
            token
        }
    });
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
    return response;
}

const addLikes = async(data) => {
    const response = await axios.post(ADD_LIKES,data,{ headers: { "Access-Control-Allow-Origin": "*", }}
    )
    return response;
}

const getAuthToken = async(data) => {
    const response = await axios.get(CREATE_AUTH);
    return response;
}

export default { getEvents, postEvent ,postReply ,createGuestUser,addLikes,getAuthToken }