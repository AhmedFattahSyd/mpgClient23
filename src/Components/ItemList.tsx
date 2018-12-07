///////////////////////////////////////////////////////////////////////////////////////////////
// Item List component
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import MpgGraph from '../MpgGraph'
import { Card, CardContent, CardActionArea } from '@material-ui/core'
// import {List, ListItem, ListItemText} from '@material-ui/core'
import {MpgItem} from '../MpgItem';
import { RouteComponentProps } from "react-router";
import { withRouter } from 'react-router'
import { MpgLogger } from 'src/MpgLogger';
// import {ListItemIcon} from '@material-ui/core'
import * as MpgConstants from './MpgConstants'
import { MpgItemType } from 'src/ItemType';
///////////////////////////////////////////////////////////////////////////////////////////////
// Interfaces for porops and state
///////////////////////////////////////////////////////////////////////////////////////////////
interface IItemListProps extends RouteComponentProps{ 
    mpgGraph: MpgGraph,
    items: MpgItem[],
    selectedItemId: string,
    currentType: MpgItemType,
    userSignedIn: boolean,
    mpgLogger: MpgLogger
}
interface IItemListState {
    mpgGraph: MpgGraph,
    items: MpgItem[],
    selectedItemId: string,
    currentType: MpgItemType,
    userSignedIn: boolean,
    mpgLogger: MpgLogger
}
///////////////////////////////////////////////////////////////////////////////////////////////
// class ItemList
///////////////////////////////////////////////////////////////////////////////////////////////
class ItemListBase extends React.Component<IItemListProps,IItemListState> {
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    ///////////////////////////////////////////////////////////////////////////////////////////////
    constructor (props: IItemListProps){
        super(props)
        const mpgGraph = props.mpgGraph
        this.state = {
            mpgGraph: mpgGraph,
            items: [],
            selectedItemId: mpgGraph.getSelectedItemId(),
            currentType: props.currentType,
            userSignedIn: props.userSignedIn,
            mpgLogger: props.mpgLogger
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // render method
    ///////////////////////////////////////////////////////////////////////////////////////////////
    public render = () => {
        const primaryColor = MpgConstants.PRIMARY_COLOR
        const cardWidth = '100%'
        return (
            <div>
                <AppBar position="fixed" style={{ backgroundColor: primaryColor }}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link to='/home' style={{ color: 'white' }}>
                            <Icon>
                                home
                    </Icon>
                        </Link>
                        <Typography variant="title" color="inherit">
                            My {this.state.mpgGraph.getCurrentTypeDisplayPlural()}
                </Typography>
                        <Link to='/ItemDetails' style={{ color: 'white' }}>
                            <Icon>
                                add_circle
                    </Icon>
                        </Link>
                    </Toolbar>
                </AppBar>
                <div style={{paddingTop:60}}></div>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '2px 5px 2px 5px', flexWrap: 'wrap' }}>
                {this.state.items.map((item) => (<Card key={item.id} elevation={1} 
                    style={{ maxWidth: cardWidth, minWidth: cardWidth,margin: "2px 5px 2px 5px" }}>
                    <CardActionArea onClick={event => this.handleSelectItem(event,item.id)}> 
                        <CardContent>
                        <Typography style={{fontSize:'14px', fontWeight: 'bold'}}>
                            {item.name}
                        </Typography>
                        <Typography style={{fontSize:'12px', color: primaryColor}}>
                        {"Importance: "+item.importance + ", "+
                            this.state.mpgGraph.getFormattedRelativeImportanceText(item.id)}
                        </Typography>
                        {(item.id == this.state.selectedItemId)? 
                            <div style={{display: 'flex', justifyContent:'space-between', paddingTop:'5px'}}>
                                <Icon  style={{fontSize: '20px', color: primaryColor}} 
                                onClick={event => this.handleIncreaseImportance(event,item.id)}>
                                    keyboard_arrow_up
                                </Icon>
                                <Icon  style={{fontSize: '20px',  color: primaryColor}}
                                    onClick={event => this.handleDecreaseImportance(event,item.id)}>
                                    keyboard_arrow_down
                                </Icon>
                                <Icon  style={{fontSize: '20px', color: primaryColor}}
                                    onClick={event => this.handleItemUpdate(event,item.id)}>
                                        edit
                                </Icon>
                                <Icon  style={{fontSize: '20px', color: primaryColor}}
                                    onClick={event => this.handleItemDelete(event,item.id)}>
                                        delete
                                </Icon>
                            </div> 
                            : 
                            <div>
                            </div> 
                        }
                        </CardContent>
                    </CardActionArea>
                    {/* </Link> */}
                </Card>))}
                </div>
            </div>
        )
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // utility functions
    ///////////////////////////////////////////////////////////////////////////////////////////////
    componentWillReceiveProps(newProps: IItemListProps){
        // this.state.mpgLogger.debug('ItemList: component will receive propos: newProps',newProps);
        this.setState({items: newProps.items,
            selectedItemId: newProps.selectedItemId,
            userSignedIn: newProps.userSignedIn,
            currentType: newProps.currentType})
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
    // event handlers
    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle select item
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleSelectItem = async (event: React.MouseEvent, id: string) => {
        await this.state.mpgGraph.setSelectedItemId(id)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle delete icon clicked
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleItemDelete = async (event: React.MouseEvent, id: string) => {
        try{
            await this.state.mpgGraph.deleteItem(id)
        }catch(err){
            this.state.mpgLogger.fatalError("ItemList: deleteItem: error:",err)
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle update icon clicked
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleItemUpdate = async (event: React.MouseEvent, id: string) => {
        try{
            await this.state.mpgGraph.setUpdateItemState(id)
            // this.state.mpgLogger.debug("ItemList: handleItemUpodate: id:",id)
            this.props.history.push('/ItemDetails')
            this.state.mpgGraph.setUpdateItemState(id)
        }catch(err){
            this.state.mpgLogger.debug("ItemList: deleteItem: error:",err)
        }
        
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle increase importance
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleIncreaseImportance = async (event: React.MouseEvent, id: string) => {
        this.state.mpgGraph.setSelectedItemId(id)
        const item = this.state.mpgGraph.getItemById(id)
        if(item !== undefined){
            const confirmedItem = item as MpgItem
            this.state.mpgGraph.updateItem(confirmedItem.name, confirmedItem.importance+1)
        }else{
            this.state.mpgLogger.debug("ItemList: handleIncreaseImportance: item not found: id:",id)
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle decrease importance
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleDecreaseImportance = async (event: React.MouseEvent, id: string) => {
        this.state.mpgGraph.setSelectedItemId(id)
        const item = this.state.mpgGraph.getItemById(id)
        if(item !== undefined){
            const confirmedItem = item as MpgItem
            this.state.mpgGraph.updateItem(confirmedItem.name, confirmedItem.importance-1)
        }else{
            this.state.mpgLogger.debug("ItemList: handleIncreaseImportance: item not found: id:",id)
        }
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// export component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const ItemList = withRouter(ItemListBase)
export default ItemList