///////////////////////////////////////////////////////////////////////////////////////////////
// Item Details component
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon';
// import { Link } from 'react-router-dom';
import { TextField } from '@material-ui/core'
import {CreateOrUpdateTypes} from '../MpgGraph'
import MpgGraph from '../MpgGraph'
import {withRouter} from 'react-router'
import {RouteComponentProps} from "react-router";
import {MpgItem} from '../MpgItem';
import * as MpgConstants from './MpgConstants'
import { MpgLogger } from 'src/MpgLogger';
// import { Card, CardContent} from '@material-ui/core'
import { MpgItemType } from 'src/ItemType';
///////////////////////////////////////////////////////////////////////////////////////////////
// Interfaces for porops and state
///////////////////////////////////////////////////////////////////////////////////////////////
interface IItemDetailsProps extends RouteComponentProps{ 
    mpgGraph: MpgGraph,
    selectedItemId: string,
    createOrUpdateState: CreateOrUpdateTypes,
    currentType: MpgItemType,
    userSignedIn: boolean,
    mpgLogger: MpgLogger,
}
interface IItemDetailsState {
    mpgGraph: MpgGraph,
    itemName: string,
    currentType: MpgItemType,
    itemImportance: number,
    selectedItemId: string,
    createOrUpdateState: CreateOrUpdateTypes,
    userSignedIn: boolean,  
    mpgLogger: MpgLogger,
    relatedItemsExpanded: boolean
}
///////////////////////////////////////////////////////////////////////////////////////////////
// class ItemDetails
///////////////////////////////////////////////////////////////////////////////////////////////
class ItemDetailsBase extends React.Component<IItemDetailsProps,IItemDetailsState> {
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    ///////////////////////////////////////////////////////////////////////////////////////////////
    constructor(props: IItemDetailsProps){
        super(props)
        let mpgGraph = props.mpgGraph
        this.state = {
            mpgGraph: mpgGraph,
            itemName: 'New item',
            itemImportance: 50,
            selectedItemId: mpgGraph.getSelectedItemId(),
            createOrUpdateState: CreateOrUpdateTypes.Create,
            userSignedIn: props.userSignedIn,
            currentType: props.currentType,
            mpgLogger: props.mpgLogger,
            relatedItemsExpanded: false
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // redner method    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    public render = () => {
        const primaryColor = MpgConstants.PRIMARY_COLOR
        return (
            <div>
                <AppBar position="fixed" style={{ backgroundColor: primaryColor }}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* <Link to='/ItemList' style={{ color: 'white' }}> */}
                            <Icon onClick={this.handleCancelClick}>
                                cancel
                    </Icon>
                        {/* </Link> */}
                    <Typography variant="title" color="inherit">
                        {(this.state.createOrUpdateState == CreateOrUpdateTypes.Create)?
                        'New '+this.state.mpgGraph.getCurrentTypeDisplaySingular(): 
                        'Update '+this.state.mpgGraph.getCurrentTypeDisplaySingular()}
                    </Typography>
                        <Icon onClick={this.handleSave}>
                            save
                        </Icon>
                    </Toolbar>
                </AppBar>
                <div style={{ paddingTop: 60 }}>
                </div>
                <div>
                    <TextField
                        id="itemName"
                        label="Name"
                        value={this.state.itemName}
                        margin="normal"
                        style={{ marginLeft: 10, marginRight: 10, width: "90%",}}
                        onChange={this.handleItemNameChange}
                    />
                    <TextField
                        id="itemImportance"
                        label="Importance"
                        value={this.state.itemImportance}
                        margin="normal"
                        style={{ marginLeft: 10, marginRight: 10, width: "5%",}}
                        onChange={this.handleItemImportanceChange}
                    />
                </div>
            </div>
        )
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // utility methods
    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // event handlers
    ///////////////////////////////////////////////////////////////////////////////////////////////
    componentWillMount = () => {
        if(!this.state.userSignedIn){
          this.props.history.push('/Landing')
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle expand related items
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleToggleRelatedItemExpanded = (event: React.MouseEvent)=>{
        if(this.state.relatedItemsExpanded){
            this.setState({relatedItemsExpanded: false})
        }else{
            this.setState({relatedItemsExpanded: true})
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle cancel select
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleCancelClick = (event: React.MouseEvent)=>{
        //i am just doing this to deal with itemlist not refereshing
        //there is something wrong with the propgation of props
        //under investigation
        this.state.mpgGraph.reloadItems()
        this.props.history.push('/ItemList')
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // initCreateUpdateFields   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    initCreateUpdateFields = ()=> {
        // we are retrieving the states from mpgGraph as an experiement because componentWillReceiveProps is not invoked for some reason
        if(this.state.mpgGraph.getCreateOrUpdateState() == CreateOrUpdateTypes.Update){
            let item = this.state.mpgGraph.getItemById(this.state.mpgGraph.getSelectedItemId())
            if(item !== undefined){
                const confirmedItem = item as MpgItem
                this.setState({itemName: confirmedItem.name, 
                    itemImportance: confirmedItem.importance})
            }else{
                // this.state.mpgLogger.debug("ItemDetails: initCreateUpdateFields: selected item not found. id:",
                this.state.mpgGraph.getSelectedItemId()
            }
        }else{
            this.setState({itemName: "New "+this.state.mpgGraph.getCurrentTypeDisplaySingular(), 
                itemImportance: 50})
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // component will receive props
    ///////////////////////////////////////////////////////////////////////////////////////////////
    componentWillReceiveProps = async (newProps: IItemDetailsProps) => {
        // this.state.mpgLogger.debug("ItemDetails: componentWillReceiveProps: newProps:",newProps);
        await this.setState({selectedItemId: newProps.selectedItemId, 
            createOrUpdateState: newProps.createOrUpdateState,
            userSignedIn: newProps.userSignedIn})
        this.initCreateUpdateFields()    
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle item name change
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleItemNameChange = (event: React.ChangeEvent ) =>{
        this.setState({itemName: (event.target as HTMLInputElement).value})
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle item importance change
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleItemImportanceChange = (event: React.ChangeEvent ) =>{
        const itemImportance = parseInt((event.target as HTMLInputElement).value)
        if((itemImportance != NaN) && itemImportance > 0){
             this.setState({itemImportance: itemImportance})
        }else{
            this.setState({itemImportance: 0})
            // todo: we should select the field to allow changing the zero
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // handle save
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleSave = () => {
        if(this.state.createOrUpdateState == CreateOrUpdateTypes.Create){
            this.state.mpgGraph.createItem(this.state.mpgGraph.getCurrentType(),this.state.itemName, this.state.itemImportance)
        }else{
            // this.state.mpgLogger.debug("ItemDetails: handleSave: item name:",this.state.itemName);
            this.state.mpgGraph.updateItem(this.state.itemName, this.state.itemImportance)
        }
        this.props.history.push('/ItemList')
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// wrap the component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const ItemDetails = withRouter(ItemDetailsBase)
export default ItemDetails