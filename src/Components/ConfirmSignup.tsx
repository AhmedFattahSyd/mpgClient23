///////////////////////////////////////////////////////////////////////////////////////////////
// Confirm signup module
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'
import {Paper} from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import { TextField } from '@material-ui/core'
import {withRouter} from 'react-router'
import {RouteComponentProps} from "react-router";
// import { Link } from 'react-router-dom'
// import CognitoUser  from 'aws-amplify'
import {MpgUser} from '../MpgUser'
import { MpgLogger } from 'src/MpgLogger';
// import MpgGraph from '../MpgGraph'
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IConfirmSignupProps extends RouteComponentProps{ 
    mpgUser: MpgUser,
    setUserState: Function,
    userName: string,
    mpgLogger: MpgLogger
}
interface IConfirmSignupState {
    mpgUser: MpgUser,
    userName: string,
    password: string,
    error: boolean,
    msg: string,
    setUserState: Function,
    email: string,
    code: string,
    mpgLogger: MpgLogger
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Signin component class
///////////////////////////////////////////////////////////////////////////////////////////////
class ConfirmSignupBase extends React.Component<IConfirmSignupProps, IConfirmSignupState> {
  constructor (props: IConfirmSignupProps){
    super(props)
    this.state = {
      mpgUser: props.mpgUser,
      userName: props.userName,
      password: '',
      error: false,
      msg: 'Please enter username and password',
      setUserState: props.setUserState,
      email: 'email@mail.com',
      code: '',
      mpgLogger: props.mpgLogger
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render 
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    const primaryColor = '#006064'
    const errorColor = 'red'
    let stateMessageColor = 'black'
    if(this.state.error){
      stateMessageColor = errorColor
    }else{
      stateMessageColor = 'black'
    }
    return (
      <div>
        <AppBar position="fixed" style={{ backgroundColor: primaryColor }}>
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Icon>
              cancel
          </Icon>
            <Typography variant="title" color="inherit">
              My Personal Graph
          </Typography>
            <Icon>
              info
          </Icon>
          </Toolbar>
        </AppBar>
        <div style={{ paddingTop: 59 }}/>
        <Paper elevation={9} style={{padding: '10px', margin:'10px'}} >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin:'10px',
        flexDirection: 'column' }}>
      <Typography variant="h6" style={{textAlign: 'center', color: primaryColor}}>
        Confirm signup email
      </Typography>
      <TextField
          id="userName"
          label="Name"
          value={this.state.userName}
          margin="normal"
          style={{ marginLeft: 5, marginRight: 10, width: "70%",}}
          onChange={this.handleUserNameChange}
      />
      <TextField
          id="code"
          label="Confirmation code"
          value={this.state.code}
          margin="normal"
          style={{ marginLeft: 5, marginRight: 10, width: "70%",}}
          onChange={this.handleCodeChange}
      />
      <Button variant="contained" onClick={this.handleConfirm} style={{margin: '15px', backgroundColor: primaryColor, color:'white',
          textTransform: 'none'}}>
        Confirm signup email
      </Button>
      <Button onClick={this.handleSignin} style={{margin: '15px', backgroundColor: 'white', color: primaryColor,
          textTransform: 'none'}}>
        Signin
      </Button>
      <Button onClick={this.handleSignup} style={{margin: '15px', backgroundColor: 'white', color: primaryColor,
          textTransform: 'none'}}>
        Signup
      </Button>
      <Typography variant="body1" style={{textAlign: 'center', color: stateMessageColor}}>
        {this.state.msg}
      </Typography>    
      </div>
      </Paper>
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // event handlers
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle usaer anem text change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleUserNameChange = (event: React.ChangeEvent ) =>{
    this.setState({userName: (event.target as HTMLInputElement).value})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle password change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handlePasswordChange = (event: React.ChangeEvent ) =>{
    this.setState({password: (event.target as HTMLInputElement).value})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle code change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleCodeChange = (event: React.ChangeEvent ) =>{
    this.setState({code: (event.target as HTMLInputElement).value})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle email change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleEmailChange = (event: React.ChangeEvent ) =>{
    this.setState({email: (event.target as HTMLInputElement).value})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle confirm
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleConfirm = async () => {
    try{
      // this.state.mpgLogger.debug("ConfirmSignup: handleConfirm")
      let result = await this.state.mpgUser.confirmSignup(this.state.userName, this.state.code)
      if(result.success){
        // this.state.mpgLogger.debug("ConfirmSignup: handleConfirm")
        this.props.history.push('/Signin')
      }else{
        throw new Error('Unable to confirm signup. Reason:'+result.message)
      }
    }catch (error){
      this.setState({error: true, msg: 'Unable to confirm signup. Reason: '+ error})
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle confirm Signin click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignin= () => {
    this.props.history.push('/Signin')
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle confirm Signup click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignup = () => {
    this.props.history.push('/Signup')
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const ConfirmSignup = withRouter(ConfirmSignupBase)
export default ConfirmSignup