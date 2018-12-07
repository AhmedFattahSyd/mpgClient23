///////////////////////////////////////////////////////////////////////////////////////////////
// Home component
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon';
import { Card, CardContent, CardActionArea } from '@material-ui/core'
import { Link } from 'react-router-dom'
import {RouteComponentProps} from "react-router";
import {withRouter} from 'react-router'
import * as MpgConstants from './MpgConstants'
import {  MpgLogger } from 'src/MpgLogger';
import MpgGraph from 'src/MpgGraph';
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IHomeProps extends RouteComponentProps{ 
    userName: string,
    userSignedIn: boolean,
    mpgLooger: MpgLogger,
    mpgGraph: MpgGraph
}
interface IHomeState {
    userName: string,
    userSignedIn: boolean,
    mpgLogger: MpgLogger,
    mpgGraph: MpgGraph
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Home component class
///////////////////////////////////////////////////////////////////////////////////////////////
class HomeBase extends React.Component<IHomeProps, IHomeState> {
  constructor (props: IHomeProps){
    super(props)
    this.state = {
        userName: props.userName,
        userSignedIn: props.userSignedIn,
        mpgLogger: props.mpgLooger,
        mpgGraph: props.mpgGraph
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render 
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render = () => {
    // throw new MpgError("Home: render: strange error")
    const primaryColor = MpgConstants.PRIMARY_COLOR
    const cardWidth = '90%'
    return (
      <div>
        <AppBar position="fixed" style={{ backgroundColor: primaryColor }}>
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to='/Menu' style={{ color: 'white' }}>
            <Icon>menu</Icon>
          </Link>
            <Typography variant="title" color="inherit">
             My Personal Graph
          </Typography>
            <Icon onClick={this.handleSearchClicked}>
              search
          </Icon>
          </Toolbar>
        </AppBar>
        <div style={{ paddingTop: 59 }}> </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin:'5px',
              flexDirection: 'column' }}>
            <Typography variant="h6" style={{textAlign: 'center', color: primaryColor}}>
              Welcome {this.state.userName}
            </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: 5, flexWrap: 'wrap' }}>
          {this.state.mpgGraph.getAllTypes().map((type) => (<Card key={type.id} elevation={9} 
          style={{ maxWidth: cardWidth, minWidth: cardWidth, margin: 5 }}>
              <CardActionArea onClick={event => this.handleCardClicked(event,type.id)}>
                <CardContent>
                    <div style={{display:'flex'}}>
                  <Icon style={{ color: primaryColor }}>
                    {type.icon}
                  </Icon>
                  <div style={{width: '20px'}}></div>
                  <Typography variant="h6" style={{ color: primaryColor }}>
                    {type.displayNamePlural}
                  </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
          </Card>))}
        </div>
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // event handlers
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillReceiveProps(newProps: IHomeProps){
    // console.log("Home: componentWillReceiveProps.")
    this.setState({userSignedIn: newProps.userSignedIn,
      userName: newProps.userName})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will mount
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillMount = () => {
    if(!this.state.userSignedIn){
      this.props.history.push('/Landing')
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handler card click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleCardClicked =  async (event: React.MouseEvent, id: number) => {
    // this.state.mpgLogger.debug("Home: handleCardClicked: id:",id)
    await this.state.mpgGraph.setCurrentTypeById(id)
    this.props.history.push('/ItemList')
    this.state.mpgGraph.setCurrentTypeById(id)
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle search click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSearchClicked =  async (event: React.MouseEvent) => {
    this.props.history.push('/Search')
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const Home = withRouter(HomeBase)
export default Home
