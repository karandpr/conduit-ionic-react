import React from 'react';
import { IonToolbar,  IonContent,   IonButton, IonInput, IonToast, IonItem,  IonFooter } from '@ionic/react';
// import { any } from 'prop-types';
import image from '../assets/images/playstore-icon.png';
import { RouteComponentProps } from 'react-router';

import Header from '../components/Header';
import { CONFIG } from '../constants';

type Props = { props:any };
type State = {username: string, password: string, toastState: boolean, toastMessage: string, action: string, email: string};

class LoginPage extends React.Component <Props & RouteComponentProps<any>, State> {

  constructor(props: any) {
    super(props);
    this.state = {
     username: '',
     password: '',
     toastState: false,
     toastMessage: 'Message',
     action: "Login",
     email: ''
    };           
    this.event = new CustomEvent('loggedIn', {
      detail: false
    });
    
 
  }
  event: Event;



  updateUserName = (event: any) => {
    this.setState({ username: event.detail.value });
    
  };


  updatePassword = (event: any) => {
    this.setState({ password: event.detail.value });
  };

  updateEmail = (event: any) => {
    this.setState({ email: event.detail.value });
  };
  toggleAction = () => {
    this.state.action === 'Login' ? this.setState({action: 'SignUp'}) : this.setState({action: 'Login'})
  }
  componentDidMount(){
    
    this.clearCredentials();
  
  
    this.props.history.listen((location, action) => {
    if(location.pathname == "/login"){
      this.clearCredentials();
    }
})
    

  }

  clearCredentials(){
    this.event = new CustomEvent('loggedIn', {
      detail: false
    });
    window.dispatchEvent(this.event);   
    localStorage.removeItem("token");       
            localStorage.removeItem("username");
            localStorage.removeItem("isLogin");
            localStorage.removeItem("email");
  }


  login= () => {
    let url , credentials;     
    if(this.state.action  == 'Login'){
      url = CONFIG.API_ENDPOINT + '/users/login';
      credentials = {
        "user": {
          "email": this.state.email,
          "password": this.state.password
      }
      }

    } else {
      url = CONFIG.API_ENDPOINT + '/users';
      credentials = {
        "user": {
          "email": this.state.email,
          "password": this.state.password,
          "username": this.state.username
      }
      }
    }
    fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",              
            },
            body: JSON.stringify(credentials)

        })
        .then((res) => {
          
          if(res.status == 200){
            return res.json();
          } else {  
            if(this.state.action == 'SignUp') {
              throw new Error("Error creating user");
            } else {
              throw new Error("Error Logging in")  
            }                
          }
         
        } )
        .then(
          (result) => {
                 
              localStorage.setItem("token",result.user.token);       
              localStorage.setItem("username", result.user.username);
              localStorage.setItem("isLogin", "true");
              localStorage.setItem("email", result.user.email);
             
              this.event = new CustomEvent('loggedIn', {
                detail: true,
              });
              window.dispatchEvent(this.event);
              this.props.history.replace('/');
          },
    
          (error) => {
           console.error(error);           
           this.setState({toastMessage: error.toString(), toastState: true});
          }
        )
  }

  render(){
    return(
      <>
    <Header title="Login"></Header>    
    <IonContent padding>

    <div className="ion-text-center">
    <img src={image} alt="logo" width="25%" /> 
    </div>
    <h1 className="ion-text-center conduit-title">conduit</h1>      

    <IonToast
        isOpen={this.state.toastState}
        onDidDismiss={() => this.setState(() => ({ toastState: false }))}
        message= {this.state.toastMessage}
        duration={400}
      >
      </IonToast>
        
    <form action="">
    
    <IonItem>
      
      <IonInput  onIonChange={this.updateEmail} type="email" placeholder="Email"></IonInput>
    </IonItem>
    {this.state.action === 'SignUp' ?    
      <IonItem>
       
        <IonInput onIonChange={this.updateUserName} type="text" placeholder="Username"></IonInput>
      </IonItem>
      : <></> }
    
    <IonItem>
    <IonInput onIonChange={this.updatePassword} type="password" placeholder="Password"></IonInput>      
    </IonItem>

    </form>      
    
            <IonButton onClick={this.login}>{this.state.action}</IonButton>         
         
    </IonContent>
    <IonFooter>
      <IonToolbar text-center>
          Click here to <a onClick={this.toggleAction}>{this.state.action === 'Login'? 'SignUp' : 'Login'}</a>
      </IonToolbar>
    </IonFooter>
  </>
    )
  }
}
export default LoginPage