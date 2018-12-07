///////////////////////////////////////////////////////////////////////////////////////////////
// Search component
///////////////////////////////////////////////////////////////////////////////////////////////
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon';
// import { Link } from 'react-router-dom';
import MpgGraph from '../MpgGraph'
import { Card, CardContent, CardActionArea} from '@material-ui/core'
// import {List, ListItem, ListItemText} from '@material-ui/core'
import {MpgItem} from '../MpgItem';
import { RouteComponentProps } from "react-router";
import { withRouter } from 'react-router'
import { MpgLogger } from '../MpgLogger';
// import {ListItemIcon} from '@material-ui/core'
import * as MpgConstants from './MpgConstants'
import { TextField } from '@material-ui/core'
import { MpgItemType } from 'src/ItemType';
///////////////////////////////////////////////////////////////////////////////////////////////
// Interfaces for porops and state
///////////////////////////////////////////////////////////////////////////////////////////////
interface ISearchProps extends RouteComponentProps{ 
    mpgGraph: MpgGraph,
    items: MpgItem[],
    selectedItemId: string,
    currentType: MpgItemType,
    userSignedIn: boolean,
    mpgLogger: MpgLogger,
}
interface ISearchState {
    mpgGraph: MpgGraph,
    items: MpgItem[],
    selectedItemId: string,
    currentType: MpgItemType,
    userSignedIn: boolean,
    mpgLogger: MpgLogger,
    searchText: string,
}
///////////////////////////////////////////////////////////////////////////////////////////////
// class ItemList
///////////////////////////////////////////////////////////////////////////////////////////////
class ItemListBase extends React.Component<ISearchProps,ISearchState> {
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    ///////////////////////////////////////////////////////////////////////////////////////////////
    constructor (props: ISearchProps){
        super(props)
        const mpgGraph = props.mpgGraph
        this.state = {
            mpgGraph: mpgGraph,
            items: [],
            selectedItemId: mpgGraph.getSelectedItemId(),
            currentType: props.currentType,
            userSignedIn: props.userSignedIn,
            mpgLogger: props.mpgLogger,
            searchText: '',
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // render method
    ///////////////////////////////////////////////////////////////////////////////////////////////
    public render = () => {
        const primaryColor = MpgConstants.PRIMARY_COLOR
        const cardWidth = '100%'
        // we should cancel from this back to whereve we came from
        return (
            <div>
                <AppBar position="fixed" style={{ backgroundColor: primaryColor }}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Icon onClick={this.handleGoBackClick}>
                    reply
                    </Icon>
                    <Typography variant="title" color="inherit">
                        Search
                    </Typography>
                    <Icon>
                        home
                    </Icon>
                </Toolbar>
                <div style={{backgroundColor:'white'}}>
                <TextField
                    id="searchText"
                    label="Search text"
                    value={this.state.searchText}
                    margin="normal"
                    style={{ marginLeft: 10, marginRight: 10, width: "96%", color: primaryColor,}}
                    color='grey'
                    onChange={this.handleSearchTextChange}
                />
                </div>
                </AppBar>
                <div style={{paddingTop:140}}></div>
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
    componentWillReceiveProps(newProps: ISearchProps){
        // this.state.mpgLogger.debug('Search: component will receive propos: newProps',newProps);
        this.setState({items: newProps.items,
            selectedItemId: newProps.selectedItemId,
            userSignedIn: newProps.userSignedIn,
            currentType: newProps.currentType,
           })
        this.setFilteredItems()
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get fildtered items
    ///////////////////////////////////////////////////////////////////////////////////////////////
    setFilteredItems = () => {
        let filteredItems: MpgItem[] = []
        // this.state.mpgLogger.debug("Search: setFilteredItems: search text:",this.state.searchText,
        //     " length:", this.state.searchText.trim().length)
        if(this.state.searchText.length != 0){
            for(let item of this.state.mpgGraph.getItems()){
                if(item.name.includes(this.state.searchText.trim())){
                    filteredItems.push(item)
                }
            }
        }
        // this.state.mpgLogger.debug("Search: setFilteredItems: filtered items:",filteredItems)
        this.setState({items: filteredItems}) 
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
    // handle go back
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleGoBackClick = (event: React.MouseEvent)=>{
        this.props.history.goBack()
    }
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
    // handle search text change
    ///////////////////////////////////////////////////////////////////////////////////////////////
    handleSearchTextChange = async (event: React.ChangeEvent ) =>{
        await this.setState({searchText: (event.target as HTMLInputElement).value})
        // this.state.mpgLogger.debug("Search: handleSearchTextChange: filtered items:",this.state.searchText)
        this.setFilteredItems()
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
}
///////////////////////////////////////////////////////////////////////////////////////////////
// export component withRouter
///////////////////////////////////////////////////////////////////////////////////////////////
const ItemList = withRouter(ItemListBase)
export default ItemList