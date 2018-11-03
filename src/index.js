import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Comments from './Comments';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./redux/reducers";


ReactDOM.render(
<Provider store={createStore(rootReducer)}>
<Comments   eventId = {3} />
</Provider>
, document.getElementById('commentContainer'));
registerServiceWorker();
