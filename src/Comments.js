import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from "react-redux";
import { addComment } from "./redux/actions";
import moment from 'moment';
import { Form, TextArea, Button } from 'semantic-ui-react'
import rest from './rest';
class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { comments: '', restResponse: '', addCommentId: [], active: 'active', error: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showReply = this.showReply.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleShow = this.handleShow.bind(this);
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
    console.log(event.target.parentElement.nextSibling);
    replyDiv.innerHTML = "<div style='margin-top:10px'><form class='ui form'><textarea placeholder='Add a reply' rows='2' style='resize:none' ></textarea><button style='margin-top:10px'  class='ui icon primary left labeled button' role='button'>Add a Reply</button></form></div>";
  }

  handleSubmit(event) {
    const eventItem = this.state.restResponse;
    const comments = {
      eventId: eventItem.eventId,
      userId: eventItem.userId,
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
    console.log(this.props.addCommentId.id);
    if (this.props.addCommentId.id !== (prevProps.addCommentId.id)) {
      console.log('This is inside update');
      setTimeout(() => {
        rest.getEvents(this.props.eventId).then((data) => {
          console.log('After rest call');
          console.log(data.data);
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
    console.log(allComments);
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
          <div class="ui segment">
            {

              allComments && allComments.length > 0 && allComments.map((data) => {
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
                        <a className="reply" >Reply</a>
                      </div>
                      <div class="replyComment"></div>
                    </div>
                    {data.symposiumCommentsReplies && data.symposiumCommentsReplies.length > 0 &&
                      data.symposiumCommentsReplies.map((data) => {
                        return (<div className="comments" key={Math.random()}>
                          <div className="comment">
                            <div className="content">
                              <a className="author">{data.user.name}</a>
                              <div className="metadata">
                                <span className="date">{moment(data.postedDate).fromNow()}</span>
                              </div>
                              <div className="text">
                                {data.reply}
                              </div>
                              <div className="actions">
                                <a className="reply">Reply</a>
                              </div>
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
