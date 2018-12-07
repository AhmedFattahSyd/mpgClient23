///////////////////////////////////////////////////////////////////////////////////////////////
// Signin module
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
import MpgGraph from '../MpgGraph';
import { MpgLogger } from 'src/MpgLogger';
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ISigninProps extends RouteComponentProps{ 
    mpgUser: MpgUser,
    setUserState: Function,
    mpgGraph: MpgGraph,
    mpgLogger: MpgLogger
}
interface ISigninState {
    mpgUser: MpgUser,
    userName: string,
    password: string,
    error: boolean,
    msg: string,
    setUserState: Function
    mpgGraph: MpgGraph,
    mpgLogger: MpgLogger
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Signin component class
///////////////////////////////////////////////////////////////////////////////////////////////
class SigninBase extends React.Component<ISigninProps, ISigninState> {
  constructor (props: ISigninProps){
    super(props)
    this.state = {
      mpgUser: props.mpgUser,
      userName: 'Signin user name',
      password: '',
      error: false,
      msg: 'Please enter username and password',
      setUserState: props.setUserState,
      mpgGraph: props.mpgGraph,
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
        Sign in 
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
          id="password"
          label="Password"
          value={this.state.password}
          margin="normal"
          type="password"
          style={{ marginLeft: 5, marginRight: 10, width: "70%",}}
          onChange={this.handlePasswordChange}
      />
      <Button variant="contained" onClick={this.handleSignin} style={{margin: '15px', backgroundColor: primaryColor, color:'white',
          textTransform: 'none'}}>
        Sign in
      </Button>
      <Button style={{margin: '15px', backgroundColor: 'white', color: primaryColor,
          textTransform: 'none', textDecoration:'none'}}>
        Reset password
      </Button>
      {/* <Link to='Signup'style={{ textDecoration: 'none'}}> */}
      <Button onClick={this.handleSignup} style={{margin: '15px', backgroundColor: 'white', color: primaryColor,
          textTransform: 'none'}}>
        Sign up
      </Button>
      <Button onClick={this.handleConfirmSignup} style={{margin: '15px', backgroundColor: 'white', color: primaryColor,
          textTransform: 'none'}}>
        Confirm signup email
      </Button>
      {/* </Link> */}
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
  // handle usaer name text change
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
  // handle sign in
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignin = async () => {
    try{
      // console.log("Signin: handleSignin")
      let result = await this.state.mpgUser.signin(this.state.userName, this.state.password)
      if(result.success){
        // console.log("Signin success. username:",this.state.mpgUser.getUserName());
        await this.setState({error: false, msg: 'Connecting to database in cloud. Please wait ...'})
        await this.state.setUserState(true,this.state.mpgUser.getUserName())
        // for some reason this does not wait till the table is created
        if(this.state.mpgGraph.doesUserDataTableExists()){
          // console.log("Signin: handleSignin: Directing to Home")
          this.props.history.push('/Home')
        }else{
          this.setState({error: true, msg: 'Something went wrong. Reason: user data table does not exist'})
        }
      }else{
        throw new Error('Unable to logon. Reason: '+result.message)
      }
    }catch (error){
      console.log("Signin: handleSignin: Error:",error)
      this.setState({error: true, msg: 'Unable to logon. Reason: '+ error})
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle signup click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignup = () => {
    this.props.history.push('/Signup')
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle confirm Signup click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleConfirmSignup = () => {
    this.props.history.push('/ConfirmSignup')
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const Signin = withRouter(SigninBase)
export default Signin