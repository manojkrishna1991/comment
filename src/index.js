import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Comments from './Comments';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./redux/reducers";
/**
 * required to pass the eventId and userId since this is integrated front end jsp
 * 
 *  
 */
const eventId = document.getElementById("eventId").innerHTML;
const userId = document.getElementById("subId").innerHTML;
ReactDOM.render(
<Provider store={createStore(rootReducer)}>
<Comments   eventId = {eventId} subId = {userId} />
</Provider>
, document.getElementById('commentContainer'));
registerServiceWorker();
