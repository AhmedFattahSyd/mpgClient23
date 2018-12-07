///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Data Definition Module
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export enum MpgRecordType {
  MpgItem = "MPG_ITEM",
  MpgRel = "MPG_REL"
}
export interface MpgItemRecord {
  id: string;
  type: string;
  name: string;
  description: string;
  importance: number;
  createdAt: string;
  updatedAt: string;
}
export interface MpgRelRecord {
  id1: string;
  id2: string;
  weight: number;
  description: string;
}
export type MpgRecordBody = MpgItemRecord | MpgRelRecord;
export interface MpgRecord {
  recordType: MpgRecordType;
  body: MpgRecordBody;
}
export enum MpgDataActionTypes {
  CreateItem = "CREATE_ITEM",
  ListItems = "LIST_ITEMS",
  DeleteItem = "DELETE_ITEM",
  UpdateItem = "UPDATE_ITEM",
  CreateRel = "CREATE_REL",
  ListRels = "LIST_RELS",
  CreateTable = "CREATE_TABLE",
  DescribeTable = "DESCRIBE_TABLE"
}
export interface ICreateItemAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
  item: MpgItemRecord;
}
export interface IUpdateItemAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
  item: MpgItemRecord;
}
export interface IDeleteItemAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
  id: string;
}
export interface IListItemsAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
}
export interface ICreateIRelAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
  rel: MpgRelRecord;
}
export interface IListRelsAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
}
export interface ICreateTableAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
}
export interface IDescribeTableAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
}
export type MpgDataRequest =
  | ICreateItemAction
  | IListItemsAction
  | ICreateIRelAction
  | IListRelsAction
  | IDeleteItemAction
  | IUpdateItemAction
  | ICreateTableAction
  | IDescribeTableAction;
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgDataServerResponse
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IMpgDataServerResponse {
  returnCode: MpgDataServerReturnCode;
  data: string;
  msg: string;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgDataServerReturnCode
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export enum MpgDataServerReturnCode {
  Success = "SUCCESS",
  TableWasNotFound = "TABLE_WAS_NOT_FOUND",
  TableWasFound = "TABLE_WAS_FOUND",
  DdbError = "DYNAMO_DB_ERROR",
  UnknowError = "UNKNOWN_ERROR"
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// lamda function response
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface ILambdaResponse {
  StatusCode: string;
  Payload: string;
}
