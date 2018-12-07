///////////////////////////////////////////////////////////////////////////////////////////////
// Signup module
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'
import { Paper } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import { TextField } from '@material-ui/core'
import { withRouter } from 'react-router'
import { RouteComponentProps } from "react-router";
// import { Link } from 'react-router-dom'
// import CognitoUser  from 'aws-amplify'
import { MpgUser } from '../MpgUser'
import { MpgLogger } from 'src/MpgLogger';
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ISignupProps extends RouteComponentProps {
  mpgUser: MpgUser,
  setUserState: Function,
  mpgLogger: MpgLogger
}
interface ISignupState {
  mpgUser: MpgUser,
  userName: string,
  password: string,
  error: boolean,
  msg: string,
  setUserState: Function,
  email: string,
  mpgLogger: MpgLogger
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Signin component class
///////////////////////////////////////////////////////////////////////////////////////////////
class SignupBase extends React.Component<ISignupProps, ISignupState> {
  constructor(props: ISignupProps) {
    super(props)
    this.state = {
      mpgUser: props.mpgUser,
      userName: 'Signup user name',
      password: '',
      error: false,
      msg: 'Please enter username and password',
      setUserState: props.setUserState,
      email: 'email@mail.com',
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
    if (this.state.error) {
      stateMessageColor = errorColor
    } else {
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
        <div style={{ paddingTop: 59 }} />
        <Paper elevation={9} style={{ padding: '10px', margin: '10px' }} >
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" style={{ textAlign: 'center', color: primaryColor }}>
              Sign up
      </Typography>
            <TextField
              id="userName"
              label="Name"
              value={this.state.userName}
              margin="normal"
              style={{ marginLeft: 5, marginRight: 10, width: "70%", }}
              onChange={this.handleUserNameChange}
            />
            <TextField
              id="password"
              label="Password"
              value={this.state.password}
              margin="normal"
              type="password"
              style={{ marginLeft: 5, marginRight: 10, width: "70%", }}
              onChange={this.handlePasswordChange}
            />
            <TextField
              id="email"
              label="email"
              value={this.state.email}
              margin="normal"
              style={{ marginLeft: 5, marginRight: 10, width: "70%", }}
              onChange={this.handleEmailChange}
            />
            <Button variant="contained" onClick={this.handleSignup} style={{
              margin: '15px', backgroundColor: primaryColor, color: 'white',
              textTransform: 'none'
            }}>
              Sign up
      </Button>
            <Button onClick={this.handleSignin} style={{
              margin: '15px', backgroundColor: 'white', color: primaryColor,
              textTransform: 'none'
            }}>
              Signin
      </Button>
            <Button onClick={this.handleConfirmSignup} style={{
              margin: '15px', backgroundColor: 'white', color: primaryColor,
              textTransform: 'none'
            }}>
              Confirm signup email
      </Button>
            <Button style={{
              margin: '15px', backgroundColor: 'white', color: primaryColor,
              textTransform: 'none'
            }}>
              Reset password
      </Button>
            <Typography variant="body1" style={{ textAlign: 'center', color: stateMessageColor }}>
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
  handleUserNameChange = (event: React.ChangeEvent) => {
    this.setState({ userName: (event.target as HTMLInputElement).value })
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle password change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handlePasswordChange = (event: React.ChangeEvent) => {
    this.setState({ password: (event.target as HTMLInputElement).value })
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle email change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleEmailChange = (event: React.ChangeEvent) => {
    this.setState({ email: (event.target as HTMLInputElement).value })
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle sign in
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignup = async () => {
    try {
      let result = await this.state.mpgUser.signup(this.state.userName, this.state.password,
        this.state.email)
      if (result.success) {
        this.props.history.push('/ConfirmSignup')
      } else {
        throw new Error('Unable to logon. Reason:' + result.message)
      }
    } catch (error) {
      this.setState({ error: true, msg: 'Unable to logon. Reason: ' + error })
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle signin click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignin = () => {
    this.props.history.push('/Signin')
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle signin click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleConfirmSignup = () => {
    this.props.history.push('/ConfirmSignup')
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const Signup = withRouter(SignupBase)
export default Signup