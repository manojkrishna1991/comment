import React, { Component } from 'react';
import { Form, TextArea, Button, Modal } from 'semantic-ui-react'
import { addReply } from "./redux/actions";
import { connect } from "react-redux";
import rest from "./rest"
/**
 * reply component
 */
class Reply extends React.Component {

  constructor(props) {
    super(props);
    this.state = { error: [], replyError: [], reply: '', restResponse: '', addReplyId: [], open: false, firstName: '', email: '', active: 'active' };
    this.handleSubmitReply = this.handleSubmitReply.bind(this);
    this.handleReplyChange = this.handleReplyChange.bind(this);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.handleGuestSubmit = this.handleGuestSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }
  /**
   * Update the response
   * @param  prevProps 
   * @param  prevState 
   */
  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    if (this.props.addReplyId.id !== (prevProps.addReplyId.id)) {
      setTimeout(() => {
        this.props.handleUpdateResponse();
      }, 1000);
    }
  }
  show() {
    this.setState({ size: 'small', open: true });
  }
  close() {
    this.setState({ open: false });
  }
  /**
   * handle guest submit
   * @param  event 
   */
  handleGuestSubmit(event) {
    const eventItem = this.state.restResponse;
    const reply = this.state.reply;
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
    this.props.handleShow();

    rest.createGuestUser(user).then((output) => {
      const response = {
        userId: output.data.userId,
        commentId: this.props.commentId,
        reply: this.state.reply
      };
      if ((this.state.reply && this.state.reply != '') && (output.data.userId && output.data.userId !== '')) {
        this.props.addReply(response);
        this.close();
      }
    });
    event.preventDefault();
  }
  /**
   *  handle reply for submit
   * @param  event 
   */
  handleSubmitReply(event) {
    const reply = this.state.reply;
    const response = {
      userId: this.props.subId,
      commentId: this.props.commentId,
      reply: this.state.reply
    };
    if ((this.state.reply && this.state.reply != '') && (this.props.subId || this.props.subId !== '')) {
      this.props.addReply(response);
      this.props.handleShow();
    }
    else {
      const error = ["Reply cannot be empty"];
      this.setState({ error });
    }
    if ((reply && reply !== '') && (!this.props.subId || this.props.subId === '')) {
      this.setState({ open: true, error: [] });
      return;
    }
    event.preventDefault();
  }
  handleReplyChange(event) {
    this.setState({ reply: event.target.value });
  }

  handleName(event) {
    this.setState({ firstName: event.target.value });
  }
  handleEmail(event) {
    this.setState({ email: event.target.value });
  }
  handleShow() {
    this.setState({ active: 'active' });
  }
  handleHide() {
    this.setState({ active: '' });
  }
  /**
   * render the reply div 
   */
  render() {
    const error = this.state.error;

    return (
      <div style={{ marginTop: '10px' }}>
        <Form className='ui form' onSubmit={this.handleSubmitReply}>
          <TextArea className={this.state.replyError} value={this.state.reply} onChange={this.handleReplyChange} autoHeight placeholder='Add a reply' rows='2' style={{ resize: 'none' }} ></TextArea>
          <Button style={{ marginTop: '10px' }} className='ui icon primary left labeled button' role='button'>Add a Reply</Button>
        </Form>
        <div>
          <Modal size={'small'} open={this.state.open} onClose={this.close}>
            <Modal.Header>
              <div class="ui visible message">
                <a href={this.state.currentUrl} class='ui primary button' style={{ marginTop: 10 }} type='submit'>LOGIN</a>
              </div>
            </Modal.Header>
          </Modal>
        </div>
        {
          error && error.length > 0 && error.map((data) => {
            return (
              <div className='ui error message'>
                <p>Reply cannot be empty </p>
              </div>
            );
          })
        }
      </div>

    );
  }
}

function mapStateToProps(state) {
  return { addReplyId: (state[state.length - 1] != undefined) ? state[state.length - 1] : { id: '0' } };
}

export default connect(
  mapStateToProps,
  { addReply }
)(Reply);