//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Client data module   
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import {MpgLogger, MpgError} from './MpgLogger'
import * as MpgData from './MpgDataDef'
import {Auth} from 'aws-amplify'
import {Lambda} from 'aws-sdk'
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Client data class
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export class MpgClientData {
    logger: MpgLogger
    private userDataTableName = ''
    private userDataTableExists = false
    readonly lambdaFuntionName = 'mpg-data-server-03'
    private readonly tablePrefix = "MpgDataTable"
    private itemRecords: MpgData.MpgItemRecord[] = []
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor (logger: MpgLogger){
        this.logger = logger
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // does user table exists
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    doesUserDataTableExist = () : boolean => {
        return this.userDataTableExists
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemRecords = (): MpgData.MpgItemRecord[] => {
        return this.itemRecords
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // does user data table exist?
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    doesUserDataTableExists = (): boolean => {
        return this.userDataTableExists
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create item record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    createItemRecord = async (itemRecord: MpgData.MpgItemRecord)=>{
        try{
            let cred = await Auth.currentCredentials()
            let lambda = new Lambda({region: 'ap-southeast-2', apiVersion: '2015-03-31',
                credentials: Auth.essentialCredentials(cred)});
            let JSONData: MpgData.ICreateItemAction = {
                tableName: this.userDataTableName,
                actiontype: MpgData.MpgDataActionTypes.CreateItem,
                item: itemRecord
                }
            let stringData = JSON.stringify(JSONData)
            var pullParams = {
                FunctionName : this.lambdaFuntionName,
                InvocationType : 'RequestResponse',
                Payload: stringData,
                LogType : 'None'
            };
            const response = await lambda.invoke(pullParams).promise()
            // check status code
            const statusCode = response.StatusCode
            if(statusCode == 200){
                // success from lambda
                // check dynamodb errors
                const mpgDataResponse = JSON.parse(response.Payload as string) as MpgData.IMpgDataServerResponse
                if (mpgDataResponse.returnCode == MpgData.MpgDataServerReturnCode.Success) {
                    // success from mpg data server\
                    // do nothing
                }else{
                    // error from dynamoDB
                    // this.logger.debug("MpgClientData: createItemrecord: eroror from DynamoDB:",mpgDataResponse.msg)
                    throw new MpgError("MpgClientData: createItemrecord: eroror from DynamoDB:"+ mpgDataResponse.msg)
                }
            }else{
                // error from lambda
                throw new MpgError("MpgClientData: createItemrecord: error from lambda function:"+response.toString())
            }
        }catch (error) {
            throw new MpgError("MpgClientData: createItemrecord: error invoking lambda function:"+error.toString())
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // checkUserTableAndCreate
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    checkUserTableAndCreate = async (userName: string) => {
        // this.logger.debug("MpgClientData: chceckuserTableAndCreate")
        this.userDataTableExists = false
        try{
            let cred = await Auth.currentCredentials()
            let lambda = new Lambda({region: 'ap-southeast-2', apiVersion: '2015-03-31',
            credentials: Auth.essentialCredentials(cred)});
            this.userDataTableName = this.createTableName(userName)
            let JSONData: MpgData.IDescribeTableAction = {
                actiontype: MpgData.MpgDataActionTypes.DescribeTable,
                tableName: this.userDataTableName
            }
            let stringData = JSON.stringify(JSONData)
            var pullParams = {
                FunctionName : this.lambdaFuntionName,
                InvocationType : 'RequestResponse',
                Payload: stringData,
                LogType : 'None'
            };
            const lambdaesponse = await lambda.invoke(pullParams).promise()
            // this.logger.debug("MpgClientData: chceckuserTableAndCreate: lambda response",lambdaesponse)
            const statusCode = lambdaesponse.StatusCode
            if(statusCode == 200){
                // success from lambda
                // check ddb response
                const mpgDataResponse = JSON.parse(lambdaesponse.Payload as string) as MpgData.IMpgDataServerResponse
                // this.logger.debug("MpgClientData: chceckuserTableAndCreate: mpg dataresponse",mpgDataResponse)
                if(mpgDataResponse.returnCode == MpgData.MpgDataServerReturnCode.TableWasNotFound){
                    // this.logger.debug("MpgClientData: chceckuserTableAndCreate: table does not exist")
                    await this.createTable(userName)
                }else{
                    // table exists
                    this.userDataTableExists = true
                }
            }else{
                // error from lambda
                throw new MpgError("MpgClientData: chceckuserTableAndCreate: error from lambda function:"+lambdaesponse.toString())
            }
        }catch (error) {
            this.logger.fatalError('MpgClientData: chceckuserTableAndCreate:: Error:  ',error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create table name
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    createTableName = (userName: string): string => {
        return this.tablePrefix+userName
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // load data from the server
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    loadData = async() => {
        try{
            let cred = await Auth.currentCredentials()
            let lambda = new Lambda({region: 'ap-southeast-2', apiVersion: '2015-03-31',
                credentials: Auth.essentialCredentials(cred)});
            let JSONData: MpgData.IListItemsAction = {
                tableName: this.userDataTableName,
                actiontype: MpgData.MpgDataActionTypes.ListItems
                }
            let stringData = JSON.stringify(JSONData)
            // this.logger.debug("MpgClientData: loadData, request data: ",stringData);
            var pullParams = {
                FunctionName : this.lambdaFuntionName,
                InvocationType : 'RequestResponse',
                Payload: stringData,
                LogType : 'None'
            };
            let lambdaesponse = await lambda.invoke(pullParams).promise()
            // check lambda status code
            const statusCode = lambdaesponse.StatusCode
            if(statusCode == 200){
                // success from lambda
                // check ddb response
                const mpgDataResponse = JSON.parse(lambdaesponse.Payload as string) as MpgData.IMpgDataServerResponse
                if (mpgDataResponse.returnCode == MpgData.MpgDataServerReturnCode.Success) {
                    // success from mpg data server
                    // parse items
                    const itemData = mpgDataResponse.data
                    // this.logger.debug('Success. data :',itemData)
                    this.itemRecords = JSON.parse(itemData as string) as MpgData.MpgItemRecord[]
                    // this.logger.debug('MpgClientData: loadData: items',this.itemRecords)
                }else{
                    // error from dynamoDB
                    // this.logger.debug("MpgClientData: loadData: eroror from DynamoDB:",mpgDataResponse.msg)
                    throw new MpgError("MpgClientData: loadData: eroror from DynamoDB:"+ mpgDataResponse.msg)
                }
            }else{
                // error from lambda
                throw new MpgError("MpgClientData: loadData: error from lambda function:"+lambdaesponse.toString())
            }
        }catch (error) {
            this.logger.fatalError('MpgClientData: loadData: Error:  ',error);
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create table for new user
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    createTable = async (userName: string) => {
        // this.logger.debug("MpgClientData: createTable")
        try{
            let cred = await Auth.currentCredentials()
            let lambda = new Lambda({region: 'ap-southeast-2', apiVersion: '2015-03-31',
                credentials: Auth.essentialCredentials(cred)});
            let JSONData: MpgData.ICreateTableAction = {
                actiontype: MpgData.MpgDataActionTypes.CreateTable,
                tableName: this.userDataTableName
                }
            let stringData = JSON.stringify(JSONData)
            var pullParams = {
                FunctionName : this.lambdaFuntionName,
                InvocationType : 'RequestResponse',
                Payload: stringData,
                LogType : 'None'
            };
            const response = await lambda.invoke(pullParams).promise()
            // this.logger.debug("MpgClientData: createTable: lambda response", response)
            const statusCode = response.StatusCode
            if(statusCode == 200){
                // success from lambda
                // check dynamodb errors
                const mpgDataResponse = JSON.parse(response.Payload as string) as MpgData.IMpgDataServerResponse
                if (mpgDataResponse.returnCode == MpgData.MpgDataServerReturnCode.Success) {
                    // this.logger.debug("MpgClientData: createTable: table was created")
                    // success from mpg data server
                    // it seems that when we try to access the table straightway, dynamoDB says resource does not exist
                    // what should we do?
                    // include an artificial wait?
                    // not the best thing but let's try it
                    // this.wait()
                    await this.waitForTableToBeCreated()
                    if(!this.userDataTableExists){
                        throw new MpgError("user table was not created")
                    }
                }else{
                    // error from dynamoDB
                    // this.logger.debug("MpgClientData: createItemrecord: eroror from DynamoDB:",mpgDataResponse.msg)
                    throw new MpgError("MpgClientData: createItemrecord: eroror from DynamoDB:"+ mpgDataResponse.msg)
                }
            }else{
                // error from lambda
                throw new MpgError("MpgClientData: createItemrecord: error from lambda function:"+response.toString())
            }
        }catch (error) {
            this.logger.fatalError('MpgClientData: createTable: Error:  ',error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // confirm table exist
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    waitForTableToBeCreated = async () => {
        // this.logger.debug("MpgClientData: waitForTableToBeCreated ")
        try{
            for(let i=0; i<5; i++){
                // this.logger.debug("MpgClientData: waitForTableToBeCreated. Waiting ... i:"+i)
                await this.checkUserDataTableExits()
                if(this.userDataTableExists) break
                await this.wait(1000)
            }
            if(!this.userDataTableExists){
                throw new MpgError("user table was not created")
            }
        }catch(err){
            this.logger.fatalError("MpgClientData: waitForTableToBeCreated. error:",err)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // checkUserDataTableExists
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    checkUserDataTableExits = async () => {
        // this.logger.debug("MpgClientData: checkUserDataTableExits")
        try{
            let cred = await Auth.currentCredentials()
            let lambda = new Lambda({region: 'ap-southeast-2', apiVersion: '2015-03-31',
                credentials: Auth.essentialCredentials(cred)});
            let JSONData: MpgData.IListItemsAction = {
                tableName: this.userDataTableName,
                actiontype: MpgData.MpgDataActionTypes.ListItems
                }
            let stringData = JSON.stringify(JSONData)
            // this.logger.debug("MpgClientData: loadData, request data: ",stringData);
            var pullParams = {
                FunctionName : this.lambdaFuntionName,
                InvocationType : 'RequestResponse',
                Payload: stringData,
                LogType : 'None'
            };
            let lambdaesponse = await lambda.invoke(pullParams).promise()
            // check lambda status code
            const statusCode = lambdaesponse.StatusCode
            if(statusCode == 200){
                // success from lambda
                // check ddb response
                const mpgDataResponse = JSON.parse(lambdaesponse.Payload as string) as MpgData.IMpgDataServerResponse
                if (mpgDataResponse.returnCode == MpgData.MpgDataServerReturnCode.Success) {
                    // this.logger.debug("MpgClientData: checkUserDataTableExits: table exists and accessible")
                    this.userDataTableExists = true
                }else{
                    // do nothing we will try aiagn
                }
            }else{
                // error from lambda
                throw new MpgError("MpgClientData: checkUserDataTableExits: error from lambda function:"+lambdaesponse.toString())
            }
        }catch (error) {
            this.logger.fatalError('MpgClientData: checkUserDataTableExits: Error:  ',error);
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // wait
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    wait = (delay: number) => {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delete item record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    deleteItemRecord = async (id: string) => {
        try{
            let cred = await Auth.currentCredentials()
            let lambda = new Lambda({region: 'ap-southeast-2', apiVersion: '2015-03-31',
                credentials: Auth.essentialCredentials(cred)});
            let JSONData: MpgData.IDeleteItemAction = {
                tableName: this.userDataTableName,
                actiontype: MpgData.MpgDataActionTypes.DeleteItem,
                id: id
            }
            let stringData = JSON.stringify(JSONData)
            var pullParams = {
                FunctionName : this.lambdaFuntionName,
                InvocationType : 'RequestResponse',
                Payload: stringData,
                LogType : 'None'
            };
            const response = await lambda.invoke(pullParams).promise()
            const statusCode = response.StatusCode
            if(statusCode == 200){
                // success from lambda
                // check dynamodb errors
                const mpgDataResponse = JSON.parse(response.Payload as string) as MpgData.IMpgDataServerResponse
                if (mpgDataResponse.returnCode == MpgData.MpgDataServerReturnCode.Success) {
                    // success from mpg data server\
                    // do nothing
                }else{
                    // error from dynamoDB
                    this.logger.debug("MpgClientData: deleteItemrecord: eroror from DynamoDB:",mpgDataResponse.msg)
                    throw new MpgError("MpgClientData: deleteItemrecord: eroror from DynamoDB:"+ mpgDataResponse.msg)
                }
            }else{
                // error from lambda
                throw new MpgError("MpgClientData: deleteItemrecord: error from lambda function:"+response.toString())
            }
        }catch (error) {
            this.logger.fatalError('MpgGraph: deleteItemRecortd: Error:  ',error);
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item record by id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemRecordById = (id: string): MpgData.MpgItemRecord | undefined => {
        let foundItemrecord: MpgData.MpgItemRecord | undefined
        for(let itemRecord of this.itemRecords){
            if(id == itemRecord.id){
                foundItemrecord = itemRecord
            }
        }
        return foundItemrecord
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update item record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateItemRecord = async (id: string, name: string, importance: number) => {
        try{
            const itemRecord = this.getItemRecordById(id)
            if(itemRecord !== undefined){
                const confirmedItemRecord = itemRecord as MpgData.MpgItemRecord
                //set new name and importance
                confirmedItemRecord.name = name
                confirmedItemRecord.importance = importance
                let cred = await Auth.currentCredentials()
                let lambda = new Lambda({region: 'ap-southeast-2', apiVersion: '2015-03-31',
                    credentials: Auth.essentialCredentials(cred)});
                let JSONData: MpgData.IUpdateItemAction = {
                    tableName: this.userDataTableName,
                    actiontype: MpgData.MpgDataActionTypes.UpdateItem,
                    item: confirmedItemRecord
                    }
                let stringData = JSON.stringify(JSONData)
                var pullParams = {
                    FunctionName : this.lambdaFuntionName,
                    InvocationType : 'RequestResponse',
                    Payload: stringData,
                    LogType : 'None'
                };
                const response = await lambda.invoke(pullParams).promise()
                const statusCode = response.StatusCode
                if(statusCode == 200){
                    // success from lambda
                    // check dynamodb errors
                    const mpgDataResponse = JSON.parse(response.Payload as string) as MpgData.IMpgDataServerResponse
                    if (mpgDataResponse.returnCode == MpgData.MpgDataServerReturnCode.Success) {
                        // success from mpg data server\
                        // do nothing
                    }else{
                        // error from dynamoDB
                        this.logger.debug("MpgClientData: updateItemrecord: eroror from DynamoDB:",mpgDataResponse.msg)
                        throw new MpgError("MpgClientData: updateItemrecord: eroror from DynamoDB:"+ mpgDataResponse.msg)
                    }
                }else{
                    // error from lambda
                    throw new MpgError("MpgClientData: dupdateItemrecord: error from lambda function:"+response.toString())
                }
            }else{
                throw new Error("MpgClientData: updateItem: itemRecortd was not found. id:"+id)
            }
        }catch(error){
            this.logger.fatalError("MpgClientData: updateItem: error:",error);
        }
    }
}