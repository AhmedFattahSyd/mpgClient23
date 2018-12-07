//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Graph module
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import {MpgItem} from './MpgItem'
import { MpgLogger, MpgError } from './MpgLogger';
import { MpgUser } from './MpgUser';
import { MpgItemRecord } from './MpgDataDef';
import {MpgClientData} from './MpgClientData'
import { MpgItemType } from './ItemType';
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// enum for create/ update function 
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export enum CreateOrUpdateTypes {
    Create = 'CREATE',
    Update = 'UPDATE'
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// class MpgGraph
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default class MpgGraph {
    private currentType: MpgItemType
    private logger: MpgLogger
    private selectedItemId: string
    // private mpgUser: MpgUser
    private dataRefreshedFun: Function
    private items: MpgItem[]
    private createOrUpdateState: CreateOrUpdateTypes
    private mpgClientData: MpgClientData
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor (logger: MpgLogger,user: MpgUser, dataRefreshed: Function) {
        this.logger = logger
        this.items = []
        this.dataRefreshedFun = dataRefreshed
        this.createOrUpdateState = CreateOrUpdateTypes.Create
        this.mpgClientData = new MpgClientData(this.logger)
        this.initTypes()
        this.currentType = this.getAllTypes[0]
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getcreateOrUpdateState
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getCreateOrUpdateState = (): CreateOrUpdateTypes => {
        return this.createOrUpdateState
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getItems
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItems = (): MpgItem[] =>{
        return this.items
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set current type
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    setCurrentType = async (type: MpgItemType)=>{
        // this.logger.debug("MpgGraph: setCurrentType: type:",type)
        try{
            this.currentType = type
            await this.invokeDataRefreshed()
        }catch(error){
            this.logger.fatalError("MpgGraph: setCurrentType: ",error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // invoke data refreshed fun
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    invokeDataRefreshed = async ()=>{
        try{
            await this.dataRefreshedFun(this.items,this.selectedItemId, this.createOrUpdateState, this.currentType)
        }catch(error){
            this.logger.fatalError("MpgGraph: invokeDataRefreshedFun: ",error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set current type by Id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    setCurrentTypeById = async (id: number) =>{
        // this.logger.debug("MpgGraph: setCurrentTypeById: id:",id)
        try{
            let foundType: MpgItemType | undefined 
            for(let type of this.getAllTypes()){
                if(type.id == id){
                    foundType = type
                }
            }
            if(foundType == undefined){
                throw new MpgError("MpgGraph: type was not found. id:"+id)
            }else{
                await this.setCurrentType(foundType)
            }
        }catch(error){
            this.logger.debug("MpgGraph: setCurrentTypeById: ",error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set seletected item id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    setSelectedItemId = async (id: string) =>{
        try{
            this.selectedItemId = id
            await this.invokeDataRefreshed()
        }catch(error){
            this.logger.fatalError("MpgGraph: setSelectedItemId: ",error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get selected item id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getSelectedItemId = (): string => {
        return this.selectedItemId
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getCurrentTypeDisplayPlural()
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getCurrentTypeDisplayPlural = (): string => {
        let displayText = "No Current Type"
        if(this.currentType != undefined){
            displayText = this.currentType.displayNamePlural
        }
        return displayText
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getCurrentTypeDisplaySingular()
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getCurrentTypeDisplaySingular = (): string => {
        let displayText = "No Current Type"
        if(this.currentType != undefined){
            displayText = this.currentType.displayNameSingular
        }
        return displayText
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get current type
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getCurrentType = (): MpgItemType =>{
        return this.currentType
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get all Types
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getAllTypes = (): MpgItemType[] => {
        return MpgItemType.allTypes
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // does user data table exists?
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    doesUserDataTableExists = (): boolean => {
        return this.mpgClientData.doesUserDataTableExists()
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // initTypes
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    initTypes = () => {
        // create item types
        MpgItemType.createType('DRIVE', 'Drive', 'Drives','navigation')
        MpgItemType.createType('ACTION', 'Action', 'Actions','my_location')
        MpgItemType.createType('CONCERN', 'Concern', 'Concerns','broken_image')
        MpgItemType.createType('JOURNAL', 'Journal entry', 'Journal','library_books')
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get formatted importance text
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getFormattedRelativeImportanceText = (id: string): string =>{
        let text = ''
        try{
            text = Math.floor(this.getRelativeImportance(id) * 100).toString() + "%"
        }catch(error){
            this.logger.fatalError("MpgGraph:getFormattedRelativeImportanceText:", error)
        }
        return text
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get relative importance
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getRelativeImportance = (id: string): number => {
        let relativeImportance = 0
        try{
            const item = this.getItemById(id)
            if(item !== undefined){
            const sumOfImportance = this.getSumOfImportance(item.type)
            if(sumOfImportance !== 0){
                relativeImportance = (item as MpgItem).importance / sumOfImportance
            }else{
                throw new MpgError("MpgGraph: getRelativeImportance: item was not found. id:"+id)
            }
        }
        }catch(error){
            this.logger.fatalError("MpgGraph: getRelativeImportance", error)
        }
        return relativeImportance
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get total drive importance
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getSumOfImportance = (type: MpgItemType): number =>{
        let sum = 0
        for(let item of this.getItemsByType(type)){
            sum += item.importance
        }
        return sum
    }
     //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get items by type
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemsByType = (type: MpgItemType): MpgItem[] => {
        return this.items.filter(item => item.type === type)
    }
     //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item by id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemById = (id: string): MpgItem | undefined => {
        let foundItem: MpgItem | undefined = undefined
        try{
            for(let item of this.items){
                if(item.id == id){
                    foundItem = item
                }
            }
            if(foundItem == undefined){
                throw new MpgError("MpgGraph: getItemById: no item was found with id:"+id);
            }
        }catch(error){
            this.logger.fatalError("MpgGraph: getItemById: ",error)
        }
        return foundItem
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create new item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    createItem = async (type: MpgItemType, name: string, importance: number)=> {
        try{
            let itemRecord: MpgItemRecord = {
                id: '',
                type: type.typeName,
                name: name,
                description: 'NO DESCRIPTION',
                importance: importance,
                createdAt: "NA",
                updatedAt: "NA"
            }
            await this.mpgClientData.createItemRecord(itemRecord)
            await this.reloadItems()
        }catch (err) {
            this.logger.fatalError("MpgGraph: createItem: error creating item of server",err)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // checkUserTableAndCreate
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    checkUserTableAndCreate = async (userName: string) => {
        try{
            await this.mpgClientData.checkUserTableAndCreate(userName)
        }catch (error) {
            this.logger.fatalError('MpgGraph: checkUserTableAndCreate: Error:  ',error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // load records into items
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    loadRecordsIntoItems = () => {
        this.items = []
        let item: MpgItem
        let itemType: MpgItemType | undefined
        try{
            for(let itemRecord of this.mpgClientData.getItemRecords()){
                itemType = this.getItemTypeByName(itemRecord.type)
                if(itemType != undefined){
                    item = new MpgItem(itemRecord.id,itemType,itemRecord.name, itemRecord.importance)
                    this.items.push(item)
                }else{
                    throw new MpgError("MpgGraph: loadRecordsIntoItems: itemType was not found. name:"+itemRecord.type)
                }
            }
        }catch(error){
            this.logger.fatalError("MpgGraph: lodaRecordsIntoItems: error:",error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item type by name
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemTypeByName = (name: string): MpgItemType | undefined => {
        let foundType: MpgItemType | undefined = undefined
        for(let type of this.getAllTypes()){
            if(type.typeName == name){
                foundType = type
            }
        }
        return foundType
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // reload item list
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    reloadItems = async () => {
        try{
            // todo: we need to optimise this if data has not changed
            await this.mpgClientData.loadData()
            this.loadRecordsIntoItems()
            // this.logger.debug("MpgGraph: reloadItems: items:",this.items)
            await this.invokeDataRefreshed()
        }catch(error){
            this.logger.fatalError("MpgGraph: reloadItems: error:",error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delete item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    deleteItem = async (id: string)=> {
        try{
            await this.mpgClientData.deleteItemRecord(id)
            await this.reloadItems()
        }catch(err){
            this.logger.fatalError("MpgGraph: deleteItem: error:",err)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set update state
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    setUpdateItemState = async (id: string) =>{
        // this.logger.debug("MpgGraph: setUpdateItemState: id",id)
        this.selectedItemId = id
        this.createOrUpdateState = CreateOrUpdateTypes.Update
        await this.invokeDataRefreshed()
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update item 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateItem = async (name: string, importance: number) => {
        try{
            const item = this.getItemById(this.selectedItemId)
            if(item !== undefined){
                const confirmedItem = item as MpgItem
                //set new name and importance
                confirmedItem.name = name
                confirmedItem.importance = importance
                await this.mpgClientData.updateItemRecord(confirmedItem.id, confirmedItem.name, confirmedItem.importance)
                await this.reloadItems()
            }else{
                throw new Error("MpgGraph: updateItem: selectedItem is undefined. id:"+this.selectedItemId)
            }
        }catch(error){
            this.logger.fatalError("MpgGraph: updateItem: error:",error)
        }
    }
}