import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from "react-redux";
import { addComment } from "./redux/actions";
import moment from 'moment';
import { Form, TextArea, Button } from 'semantic-ui-react'
import rest from './rest';
import Reply from './Reply'
import ReactDOM from 'react-dom';
import { createStore } from "redux";
import rootReducer from "./redux/reducers";

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { comments: '', restResponse: '', addCommentId: [], active: 'active', error: [] ,replyError: [] ,reply:''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showReply = this.showReply.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleUpdateResponse = this.handleUpdateResponse.bind(this);
    console.log('The event Id'+this.props.eventId);
    console.log('This sub id is '+this.props.subId);
  }
  handleChange(event) {
    this.setState({ comments: event.target.value });
  }
  handleShow() {
    this.setState({ active: 'active' });
  }
  handleHide() {
    this.setState({ active: '' });
  }
  componentDidMount() {
    rest.getEvents(this.props.eventId).then((data) => {
      this.setState({ restResponse: data.data });
    })
    setTimeout(() => { this.handleHide() }, 1000);
  }

  showReply(event) {

    const replyDiv = event.target.parentElement.nextSibling;
    const commentId = event.target.dataset.comid;
    ReactDOM.render(<Reply subId ={this.props.subId} handleShow={this.handleShow} handleUpdateResponse={this.handleUpdateResponse} eventId={this.props.eventId} commentId={commentId}  store={createStore(rootReducer)}/>,replyDiv);
  }
  handleUpdateResponse(e){
    this.handleShow();
    rest.getEvents(this.props.eventId).then((data) => {
      this.setState({ restResponse: data.data });
    })
    setTimeout(() => { this.handleHide() }, 1000);
  }

  handleSubmit(event) {
    const eventItem = this.state.restResponse;
    const comments = {
      eventId: eventItem.eventId,
      userId: this.props.subId,
      comment: this.state.comments
    }
    if (this.state.comments && this.state.comments != '') {
      this.setState({ comments: '' });
      this.props.addComment(comments);
      this.handleShow();
    }
    else {
      const error = ["Comment cannot be empty"];
      this.setState({ error });
    }

    event.preventDefault();
  }

  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    if (this.props.addCommentId.id !== (prevProps.addCommentId.id)) {
      setTimeout(() => {
        rest.getEvents(this.props.eventId).then((data) => {
          this.setState({ restResponse: data.data });
          this.handleHide();
          const error = [];
          this.setState({ error });
        })
      }, 1000);
    }
  }


  render() {

    let allComments = this.state.restResponse.getSymposiumComment;
    const error = this.state.error;

    return (

      <div>
        <div className='ui comments'>
          <h3 className='ui dividing header'>Comments</h3>
          <Form onSubmit={this.handleSubmit}>
            <TextArea className={this.state.error} value={this.state.comments} onChange={this.handleChange} autoHeight placeholder='Add a comment' />
            <Button primary style={{ marginTop: 10 }} type='submit'>Add Comment</Button>
          </Form>
          {
            error && error.length > 0 && error.map((data) => {
              return (
                <div className='ui error message'>
                <p>Comments cannot be empty </p>
              </div>
              );
            })
          }
          {allComments && allComments.length > 0 &&
                <div class="ui segment">
                {
                   allComments.map((data) => {
                    return (
                      <div className="comment" key={Math.random()}>
                        <div className="content">
                          <a className="author">{data.user.name}</a>
                          <div className="metadata">
                            <span className="date">{moment(data.postedDate).fromNow()}</span>
                          </div>
                          <div className="text">
                            <p>{data.comment}</p>
                          </div>
                          <div className="actions" onClick={this.showReply}>
                            <a className="reply" data-comid={data.id} >Reply</a>
                          </div>
                          <div class="replyComment"></div>
                        </div>
                        {data.symposiumCommentsReplies && data.symposiumCommentsReplies.length > 0 &&
                          data.symposiumCommentsReplies.map((data1) => {
                            return (<div className="comments" key={Math.random()}>
                              <div className="comment">
                                <div className="content">
                                  <a className="author">{data1.user.name}</a>
                                  <div className="metadata">
                                    <span className="date">{moment(data1.postedDate).fromNow()}</span>
                                  </div>
                                  <div className="text">
                                    {data1.reply}
                                  </div>
                                  <div className="actions" onClick={this.showReply}>
                                    <a className="reply" data-comid={data.id}>Reply</a>
                                  </div>
                                  <div class="replyComment"></div>
                                </div>
                              </div>
                            </div>
                            );
                          })
                        }
                      </div>
                    );
                  })
                }
                <div className={this.state.active + " ui  inverted dimmer"}>
                  <div className="ui medium text loader">Loading</div>
                </div>
                <p></p>
                <p></p>
              </div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { addCommentId: (state[state.length - 1] != undefined) ? state[state.length - 1] : { id: '0' } };
}

export default connect(
  mapStateToProps,
  { addComment }
)(Comments);
