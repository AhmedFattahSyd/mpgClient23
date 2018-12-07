///////////////////////////////////////////////////////////////////////////////////////////////
// MpgApp module
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from 'react'
import { MpgError, MpgLogger, MpgLoggingMode } from './MpgLogger'
import Landing from './Components/Landing'
import Home from './Components/Home'
import Signin from './Components/Signin'
import Menu from './Components/Menu'
import Signup from './Components/Signup'
import ItemList from './Components/ItemList'
import Search from './Components/Search'
import ItemDetails from './Components/ItemDetails'
import ConfirmSignup from './Components/ConfirmSignup'
import { BrowserRouter, Route, Redirect} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import { Paper } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import * as MpgConstants from './Components/MpgConstants'
import MpgGraph, { CreateOrUpdateTypes} from './MpgGraph';
import { MpgUser } from './MpgUser';
import { MpgItem} from './MpgItem';
import { MpgItemType } from './ItemType';

///////////////////////////////////////////////////////////////////////////////////////////////
// define props and state
///////////////////////////////////////////////////////////////////////////////////////////////
interface IMpgAppProps {
}
interface IMpgAppState {
  appErrorState: boolean
  appError: MpgError
  appErrorMsg: string
  mpgLogger: MpgLogger
  userSignedIn: boolean
  userName: string,
  mpgGraph: MpgGraph,
  mpgUser: MpgUser
  createOrUpdateState: CreateOrUpdateTypes,
  currentType: MpgItemType,
  filteredItems: MpgItem[]
  selectedItemId: string,
  allItems: MpgItem[],
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MpgApp class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgApp extends React.Component<IMpgAppProps, IMpgAppState> {
  constructor(props: IMpgAppProps) {
    super(props)
    const user =  new MpgUser()
    const logger = new MpgLogger(this.handleFatalAppError)
    const mpgGraph = new MpgGraph(logger, user,this.dataRefreshed)
    this.state = {
      appErrorState: false,
      appError: new MpgError("Unknown error"),
      mpgLogger: logger,
      userSignedIn: false,
      userName: "Unknown user",
      mpgGraph: mpgGraph,
      mpgUser: user,
      createOrUpdateState: CreateOrUpdateTypes.Create,
      currentType: mpgGraph.getCurrentType(),
      filteredItems: [],
      selectedItemId: '',
      appErrorMsg: ' ',
      allItems: [],
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render method
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render() {
    return (
      <div>
        {(this.state.appErrorState) ?
          this.renderErrorPage() :
          this.renderNormalApp()
        }
      </div>
    );
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render normal content
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderNormalApp = () => {
    return (
      <div>
        <BrowserRouter>
        <div>
          <Route path="/Landing" render={(props) => <Landing {...props}
          setUserState={this.setUserState}
          mpgLogger={this.state.mpgLogger}
          />}/>
           <Route path="/Home" render={(props) => <Home {...props}
            userSignedIn = {this.state.userSignedIn}
            userName={this.state.userName}
            mpgGraph={this.state.mpgGraph}
            mpgLooger={this.state.mpgLogger}
          />}/>
           <Route path="/ConfirmSignup" render={(props) => <ConfirmSignup  {...props} 
            userName={this.state.userName}
            mpgUser = {this.state.mpgUser}
            mpgLogger={this.state.mpgLogger}
            setUserState={this.setUserState}/>}/>
          <Route path="/Signup" render={(props) => <Signup {...props} 
            mpgUser = {this.state.mpgUser}
            mpgLogger={this.state.mpgLogger}
            setUserState={this.setUserState}/>}/>
          <Route path="/Signin" render={(props) => <Signin {...props} 
            mpgUser = {this.state.mpgUser}
            mpgLogger={this.state.mpgLogger}
            mpgGraph={this.state.mpgGraph}
            setUserState={this.setUserState}/>}/>
          <Route path="/ItemDetails" render={(props) => <ItemDetails {...props} 
            userSignedIn = {this.state.userSignedIn}
            selectedItemId={this.state.selectedItemId}
            currentType={this.state.currentType}
            createOrUpdateState={this.state.createOrUpdateState}
            mpgLogger={this.state.mpgLogger}
            mpgGraph={this.state.mpgGraph}
            />}/>
          <Route path="/ItemList" render={(props) => <ItemList {...props} 
            mpgGraph={this.state.mpgGraph}
            userSignedIn = {this.state.userSignedIn}
            currentType={this.state.currentType}
            selectedItemId={this.state.selectedItemId}
            mpgLogger={this.state.mpgLogger}
            items={this.state.filteredItems}/>}/>
          <Route path="/Search" render={(props) => <Search {...props} 
            mpgGraph={this.state.mpgGraph}
            userSignedIn = {this.state.userSignedIn}
            currentType={this.state.currentType}
            selectedItemId={this.state.selectedItemId}
            mpgLogger={this.state.mpgLogger}
            items={this.state.allItems}/>}/>
          <Route path="/Menu" render={(props) => <Menu {...props} 
            userSignedIn = {this.state.userSignedIn}
            mpgUser = {this.state.mpgUser}
            setUserState={this.setUserState}/>}/>
        <Route
          exact path="/"
            render={() =>
            this.state.userSignedIn ? (
              <Redirect to="/Home" />
              ) : (
              <Redirect to="/Landing" />
              )
            }
          />
           </div>
        </BrowserRouter>
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render error page
  ///////////////////////////////////////////////////////////////////////////////////////////////
  renderErrorPage = () => {
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
            Someting went wrong
        </Typography>
        <div style={{height: '50px'}}></div>
        <Typography variant='body1' style={{color: primaryColor}}>
          Error: 
           {this.state.appErrorMsg}
           <br/>
           {this.state.appError.message}
          </Typography>
          <div style={{height: '10px'}}></div>
        </div>
      </Paper>
    </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will be mounted
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillMount = () => {
    this.setState({ appErrorState: false, userSignedIn: false })
    this.state.mpgLogger.setLoggingMode(MpgLoggingMode.debug)
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component did catch
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentDidCatch = (err: Error, errInfo: React.ErrorInfo) => {
    this.setState({ appErrorState: true })
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Handle app error
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleFatalAppError = (msg: string, err: MpgError)=> {
    this.setState({ appErrorState: true, appError: err , appErrorMsg: msg+
      "\n Current user name:"+this.state.userName})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // setUserState
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setUserState = async (userSignedIn: boolean, userName: string)=>{
    try{
      await this.setState({userSignedIn: userSignedIn, userName: userName})
      await this.state.mpgGraph.checkUserTableAndCreate(this.state.userName)
      if(this.state.mpgGraph.doesUserDataTableExists){
        // this.state.mpgLogger.debug("MpgApp: user data table exists. So, let us load the data");
        await this.state.mpgGraph.reloadItems()
      }else{
        throw new MpgError("MpgApp: user data table does not exist and cannot be created")
      }
    }catch(err){
      // errors creating or find user data table
      this.state.mpgLogger.fatalError("MpgApp: setUserState: error finding or creating user data table:",err)
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Data has been refereshed
  ///////////////////////////////////////////////////////////////////////////////////////////////
  dataRefreshed = async (items: MpgItem[], selectedItemId: string, createOrUpdateState: CreateOrUpdateTypes,
    currentType: MpgItemType) => {
      // this.state.mpgLogger.debug("MpgApp: dataRefreshed: items",items," sleceted item id:",selectedItemId,
      // " create or update state: ",createOrUpdateState,", currentType: ",currentType, "searchState: ", SearchState)
      try{
        await this.setState({allItems: items, 
          selectedItemId: selectedItemId,
          createOrUpdateState: createOrUpdateState,
          currentType: currentType,
          })
        this.setFilteredItems()
      }catch(err){
        this.state.mpgLogger.fatalError("MpgApp: dataRefereshed: err:",err);
      }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set filtered items
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setFilteredItems = () => {
    let filteredItems: MpgItem[] = []
    if(this.state.filteredItems != undefined){
        // shouldn't we get them from state.allItems?
        filteredItems = this.state.mpgGraph.getItems().filter(item => item.type == this.state.mpgGraph.getCurrentType()).sort(
            (item1, item2)=> {return item2.importance  - item1.importance})
    }
    this.setState({filteredItems: filteredItems})
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// export class
///////////////////////////////////////////////////////////////////////////////////////////////
export default MpgApp;
