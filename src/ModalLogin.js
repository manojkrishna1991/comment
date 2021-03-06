import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
/**
 * Login Popup for guest users
 */
class ModalLogin extends Component {
  

  constructor(props){
    super(props);
    this.state = { open: true };
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
  }
  show () {
    this.setState({ size:'small', open: true });
  } 
  close (){
    this.setState({ open: false });
  } 
  componentDidMount() {
    this.setState({open:this.props.status});
  }
  render() {
    if(!this.props.status || !this.state.open){
      return null;
    }
    const { open, size } = this.state
    return (

      <div>
        <Modal size={'small'} open={this.props.status} onClose={this.close}>
          <Modal.Header>Delete Your Account</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to delete your account</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative>No</Button>
            <Button positive icon='checkmark' labelPosition='right' content='Yes' />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default ModalLogin;