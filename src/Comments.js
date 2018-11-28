import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from "react-redux";
import { addComment } from "./redux/actions";
import moment from 'moment';
import { Form, TextArea, Button, Modal } from 'semantic-ui-react'
import rest from './rest';
import Reply from './Reply'
import ReactDOM from 'react-dom';
import { createStore } from "redux";
import rootReducer from "./redux/reducers";

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { comments: '', restResponse: '', addCommentId: [], active: 'active', error: [], replyError: [], reply: '', status: false, open: false, firstName: '', email: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showReply = this.showReply.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleUpdateResponse = this.handleUpdateResponse.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleGuestSubmit = this.handleGuestSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    console.log('The event Id' + this.props.eventId);
    console.log('This sub id is ' + this.props.subId);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
  }
  handleShow() {
    this.setState({ active: 'active' });
  }
  handleHide() {
    this.setState({ active: '' });
  }
  handleChange(event) {
    this.setState({ comments: event.target.value });
  }
  handleName(event) {
    this.setState({ firstName: event.target.value });
  }
  handleEmail(event) {
    this.setState({ email: event.target.value });
  }
  handleGuestSubmit(event) {
    const eventItem = this.state.restResponse;
    const comment = this.state.comments;
    console.log(this.state.firstName);
    if (this.state.firstName === undefined || this.state.firstName === '') {
      const error = ["Name cannot be empty"];
      this.setState({ error });
      return;
    }
    if (this.state.email === undefined || this.state.email === '') {
      const error = ["Email cannot be empty"];
      this.setState({ error });
      return;
    }
    const user = {
      firstName: this.state.firstName,
      email: this.state.email
    }
    rest.createGuestUser(user).then((output) =>{
      const comments = {
        eventId: eventItem.eventId,
        userId: output.data.userId,
        comment,
      }
      console.log(comments);
      if (comment && comment !== '' && !output.userId && output.userId !== '') {
        this.setState({ comments: '' });
        this.props.addComment(comments);
        this.close();
      }
    });
    event.preventDefault();
  }
  show() {
    this.setState({ size: 'small', open: true });
    console.log('its called');
  }
  close() {
    console.log('close is called');
    this.setState({ open: false });
  }
  handleRedirect(event) {
    const url = event.target.dataset.url;
    window.location.href = url;
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
    ReactDOM.render(<Reply subId={this.props.subId} handleShow={this.handleShow} handleUpdateResponse={this.handleUpdateResponse} eventId={this.props.eventId} commentId={commentId} store={createStore(rootReducer)} />, replyDiv);
  }
  handleUpdateResponse(e) {
    this.handleShow();
    rest.getEvents(this.props.eventId).then((data) => {
      this.setState({ restResponse: data.data });
    })
    setTimeout(() => { this.handleHide() }, 1000);
  }

  handleSubmit(event) {
    const eventItem = this.state.restResponse;
    const comment = this.state.comments;
    const comments = {
      eventId: eventItem.eventId,
      userId: this.props.subId,
      comment,
    }
    if (comment && comment !== '' && !this.props.subId && this.props.subId !== '') {
      this.setState({ comments: '' });
      this.props.addComment(comments);
      this.handleShow();
    }
    else {
      const error = ["Comment cannot be empty"];
      this.setState({ error });
    }
    console.log((comment));
    if ((comment && comment !== '') && (!this.props.subId || this.props.subId !== '')) {
      this.setState({ open: true,error:[] });
      return;
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

    console.log(this.state.status);

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
          <div>
            <Modal size={'small'} open={this.state.open} onClose={this.close}>
              <Modal.Header>
                <div class="ui visible message">
                  Post as Guest !!
                </div>
              </Modal.Header>
              <Modal.Content>
                {
                  error && error.length > 0 && error.map((data) => {
                    return (
                      <div key={Math.random()} className='ui error message'>
                        <p>{data} </p>
                      </div>
                    );
                  })
                }
                <Form onSubmit={this.handleGuestSubmit}>
                  <div class="field">
                    <label>Name</label>
                    <input type="text" name="name" onChange={this.handleName} value={this.state.firstName} placeholder="Name"></input>
                  </div>
                  <div class="field">
                    <label>Email</label>
                    <input type="email" name="email" onChange={this.handleEmail} value={this.state.email} placeholder="required, but never Shown"></input>
                  </div>
                  <Button primary style={{ marginTop: 10 }} type='submit'>Submit</Button>
                </Form>
                <div class="ui divider"></div>
                <div class="ui visible message">
                  SignUp or Login to Post !!
                </div>
                <div style={{ marginTop: '30px' }} >
                  <Button negative><a style={{ color: '#ffff' }} data-url="/signup" href="/signup" onClick={this.handleRedirect}>SignUp<i class="angle right icon"></i></a></Button>
                  <Button positive icon='checkmark' labelPosition='right' content='Yes' ><a style={{ color: '#ffff' }} data-url="/login" onClick={this.handleRedirect} href="/login">Login<i class="angle right icon"></i></a></Button>
                </div>
              </Modal.Content>
            </Modal>
          </div>
          {
            error && error.length > 0 && error.map((data) => {
              return (
                <div key={Math.random()} className='ui error message'>
                  <p>{data} </p>
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
  return { addCommentId: (state[state.length - 1] !== undefined) ? state[state.length - 1] : { id: '0' } };
}

export default connect(
  mapStateToProps,
  { addComment }
)(Comments);
