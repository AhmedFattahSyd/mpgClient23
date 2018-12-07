///////////////////////////////////////////////////////////////////////////////////////////////
// Menu component
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Lock } from '@material-ui/icons'
import { withRouter } from 'react-router'
import { RouteComponentProps } from "react-router";
import {MpgUser} from '../MpgUser'
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IMenuProps extends RouteComponentProps{ 
    mpgUser: MpgUser,
    setUserState: Function,
    userSignedIn: boolean,
}
interface IMenuState {
    mpgUser: MpgUser,
    userSignedIn: boolean,
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Menu component class
///////////////////////////////////////////////////////////////////////////////////////////////
class MenuBase extends React.Component<IMenuProps, IMenuState> {
    constructor(props: IMenuProps) {
        super(props)
        this.state = {
            mpgUser: props.mpgUser,
            userSignedIn: props.userSignedIn,
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // render 
    ///////////////////////////////////////////////////////////////////////////////////////////////
    public render = () => {
        const primaryColor = '#006064'
        interface ICard {
            key: number
            name: string
            icon: string
            link: string
        }
        const DriveCard: ICard = { key: 1, name: 'Drives', icon: 'navigation', link: 'DriveList' }
        const actionsCard: ICard = { key: 2, name: 'Actions', icon: 'my_location', link: 'ActionList' }
        const homeCards: ICard[] = []
        homeCards.push(DriveCard)
        homeCards.push(actionsCard)
        return (
            <div>
                <AppBar position="fixed" style={{ backgroundColor: primaryColor }}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Icon>
                            home
          </Icon>
                        <Typography variant="title" color="inherit">
                            My Personal Graph
          </Typography>
                        <Icon>
                            info
          </Icon>
                    </Toolbar>
                </AppBar>
                <div style={{ paddingTop: 59 }}>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <List component="nav">
                        <ListItem button onClick={this.handleSignout}>
                            <ListItemIcon style={{ color: primaryColor }}>
                                <Lock />
                            </ListItemIcon>
                            <ListItemText style={{ color: 'red'}} primary="Signout" />
                        </ListItem>
                    </List>
                </div>
            </div>
        )
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // event handlers
    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle Signout
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleSignout = async () => {
        try{
            // console.log("Menu: handleSignoff")
            let result = await this.state.mpgUser.signoff()
            if(result.success){
                // console.log("Signoff success.")
                // console.log("Directing to siginin")
                this.props.history.push('/Signin')
            }else{
                throw new Error('Unable to signoff. Reason:'+result.message)
            }
            }catch (error){
            console.log("Menu: handleSignoff: Error:",error)
        }
    }
    componentWillReceiveProps(newProps: IMenuProps){
        this.setState({userSignedIn: newProps.userSignedIn})
    }
    componentWillMount = () => {
        if(!this.state.userSignedIn){
          // console.log("Home: componentWillMount: navigating to Signin");
          this.props.history.push('/Signin')
        }
      }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// export component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const Menu = withRouter(MenuBase)
export default Menu
