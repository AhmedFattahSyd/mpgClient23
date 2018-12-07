//////////////////////////////////////////////////////////////////////////////////////////////////////////
// My Personal Graph (MPG) User modeule
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import Amplify, {Auth} from 'aws-amplify';
import {CognitoUser, ISignUpResult} from 'amazon-cognito-identity-js'
// import { SignUpParams } from '/Users/ahmedfattah/devprojects/mpgclient16/node_modules/@aws-amplify/auth/lib/types';
import { SignUpParams } from '@aws-amplify/auth/lib/types';
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// AWS Amplify configuration
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Amplify.configure(awsAmplifyConfig);
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);
interface ISigninError {
    code: string,
    name: string,
    message: string
}
///////////////////////////////////////////////////////////////////////////////////////////////
// define interface for sigining result
///////////////////////////////////////////////////////////////////////////////////////////////
export interface ISigningResult {
    success: boolean,
    message: string
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg User class
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export class MpgUser {
    private userAuthenticated: boolean
    private userName: string
    private jwtToken: string
    // private cognitoUser: CognitoUser | undefined
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor () {
        this.userAuthenticated = false
        this.userName = 'User'
    }
    getJwtToken = () : string => {
        return this.jwtToken
    }
    checkUserAuthenticationState = async ()=>{
        try{
            const currentAuthenticatedUser = await Auth.currentAuthenticatedUser()
            console.log("MpgUser: isUserAuthenticated: currentAuthenticatedUser:",currentAuthenticatedUser);
            this.userAuthenticated = true
        }catch(error){
            console.log("MpgUser: isUserAuthenticated: erro",error);
            this.userAuthenticated = false
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // signin using async/wait
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    signin = async (userName: string, password: string): Promise<ISigningResult> => {
        let result: ISigningResult = {
                    success: false,
                    message: 'Unknown Error'
        }
        try {
            let user = await Auth.signIn(userName, password)
            let cognitoUser = user as CognitoUser
            this.userAuthenticated = true
            this.userName = cognitoUser.getUsername()
            result = {
                success: true,
                message: 'User has been signined successully'
            }
            // retrieve JWT token
            // let session = cognitoUser.getSignInUserSession()
            // this.jwtToken = (session as CognitoUserSession).getIdToken().getJwtToken()
            // console.log("MpgUser: JWT Token:",this.getJwtToken());
            return result
        }catch (err){
            // console.log("MpgUser: signin: error returned from Auth.signIn: ",err)
            this.userAuthenticated = false
            this.userName = 'User'
            result = {
                success: false,
                message: (err as ISigninError).message
            }
            return result
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // signup using async/wait
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    signup = async (userName: string, password: string, email: string): Promise<ISigningResult> => {
        let result: ISigningResult = {
                    success: false,
                    message: 'Unknown Error'
        }
        try {
            const signupParams: SignUpParams = {
                username: userName,
                password: password,
                attributes: {
                    email
                }
            }
            const data : ISignUpResult = await Auth.signUp(signupParams)
            console.log("MpgUser: signup: signup result:",data);
            result = {
                success: true,
                message: 'User has been signined up successully'
            }
            return result
        }catch (err){
            console.log(err)
            this.userAuthenticated = false
            this.userName = 'User'
            result = {
                success: false,
                message: (err as ISigninError).message
            }
            return result
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // confirm code
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    confirmSignup = async (userName: string, code: string): Promise<ISigningResult> => {
        let result: ISigningResult = {
                    success: false,
                    message: 'Unknown Error'
        }
        try {
            const data  = await Auth.confirmSignUp(userName,code)
            console.log("MpgUser: confirmSignup result:",data);
            result = {
                success: true,
                message: 'User has been confirmed successully'
            }
            return result
        }catch (err){
            console.log(err)
            this.userAuthenticated = false
            this.userName = 'User'
            result = {
                success: false,
                message: (err as ISigninError).message
            }
            return result
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // signoff using async/wait
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    signoff = async (): Promise<ISigningResult> => {
        let result: ISigningResult = {
            success: false,
            message: 'Unknown Error'
        }
        try {
            await Auth.signOut()
            this.userAuthenticated = false
            this.userName = 'User'
            result = {
                success: true,
                message: 'User has been sign out successully'
            }
            return result
        }catch (err){
            console.log('MpgUser: Signout error',err)
            result = {
                success: false,
                message: err
            }
            return result
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get use name
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getUserName = (): string => {
        return this.userName
    }
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // // is user authenticated
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////
    isUserAuthenticated = (): boolean => {
        this.checkUserAuthenticationState()
        return this.userAuthenticated
    }
}