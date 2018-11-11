import React, { Component } from 'react';
import { Form, TextArea, Button } from 'semantic-ui-react'
import { addReply } from "./redux/actions";
import { connect } from "react-redux";
import rest from "./rest"

class Reply extends React.Component {

    constructor(props){
        super(props);
        this.state = { error: [] ,replyError: [] ,reply:'',restResponse:'',addReplyId:[]};
        this.handleSubmitReply = this.handleSubmitReply.bind(this);
        this.handleReplyChange = this.handleReplyChange.bind(this);
    }
    componentDidUpdate(prevProps, prevState) {
        // Typical usage (don't forget to compare props):
        if (this.props.addReplyId.id !== (prevProps.addReplyId.id)) {
          setTimeout(() => {
            this.props.handleUpdateResponse();
          }, 1000);
        }
      }
    handleSubmitReply(event){
        const response = {
            userId:this.props.subId,
            commentId:this.props.commentId,
            reply:this.state.reply
        };
        if (this.state.reply && this.state.reply != '') {
            this.props.addReply(response);
            this.props.handleShow();
        }
        else {
            const error = ["Reply cannot be empty"];
            this.setState({ error });
          }
        event.preventDefault();
      }
      handleReplyChange(event) {
        this.setState({ reply: event.target.value });
      }

    render(){
        const error = this.state.error;

       return( 
        <div style={{marginTop:'10px'}}>
       <Form className='ui form' onSubmit={this.handleSubmitReply}>
       <TextArea className={this.state.replyError} value={this.state.reply} onChange={this.handleReplyChange} autoHeight placeholder='Add a reply' rows='2' style={{resize:'none'}} ></TextArea>
       <Button style={{marginTop:'10px'}}  className='ui icon primary left labeled button' role='button'>Add a Reply</Button>
       </Form>
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