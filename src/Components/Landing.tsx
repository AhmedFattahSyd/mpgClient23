///////////////////////////////////////////////////////////////////////////////////////////////
// Landing page module
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'
import { Paper } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import { withRouter } from 'react-router'
import { RouteComponentProps } from "react-router";
// import { Link } from 'react-router-dom'
// import CognitoUser  from 'aws-amplify'
// import { MpgUser } from '../MpgUser'
import * as MpgConstants from './MpgConstants'
import Divider from '@material-ui/core/Divider';
import { MpgLogger } from 'src/MpgLogger';
// import { MpgError } from '../MpgLogger'
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface ILandingProps extends RouteComponentProps {
  mpgLogger: MpgLogger
  setUserState: Function,
}
interface ILandingState {
  mpgLooger: MpgLogger
  setUserState: Function,
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Home component class
///////////////////////////////////////////////////////////////////////////////////////////////
class HomeBase extends React.Component<ILandingProps, ILandingState> {
  constructor(props: ILandingProps) {
    super(props)
    this.state = {
      mpgLooger: props.mpgLogger,
      setUserState: props.setUserState,
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render 
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    // throw new MpgError("Home: render: strange error")
    const primaryColor = MpgConstants.PRIMARY_COLOR
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
              Landing page
          </Typography>
          <div style={{height: '80px'}}></div>
          <Typography variant='body1'>
            Wellcome to My Personal Graph
            </Typography>
            <div style={{height: '10px'}}></div>
            <Typography variant='body1'>
            Please signin or signup
            </Typography>
            <div style={{height: '10px'}}></div>
            <Divider style={{color: 'red'}} />
            <div style={{height: '80px'}}></div>
            <Button variant="contained" onClick={this.handleSignin} style={{
              margin: '15px', backgroundColor: 'white', color: primaryColor,
              textTransform: 'none'
            }}>
              Signin
            </Button>
            <Button variant="contained" onClick={this.handleSignup} style={{
              margin: '15px', backgroundColor: 'white', color: primaryColor,
              textTransform: 'none'
            }}>
              Sign up
          </Button>
            <Typography variant="body1" style={{ textAlign: 'center', color: primaryColor }}>
            </Typography>
          </div>
        </Paper>
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // event handlers
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps(newProps: ILandingProps) {
  }
  componentWillMount = () => {
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle signin click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignin = () => {
      this.props.history.push('/Signin')
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle signup click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSignup = () => {
    this.props.history.push('/Signup')
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const Home = withRouter(HomeBase)
export default Home