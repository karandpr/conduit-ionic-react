import React from 'react';
import { IonContent, IonButton, IonInput, IonTextarea, IonLabel, IonItem, IonToast } from '@ionic/react';
import Header from '../components/Header';
import { CONFIG } from '../constants';


type Props = { props:any };
type State = {username: string, password: string, bio: string, image: string, email: string, toastState: boolean};

class SettingsPage extends React.Component <Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
     username: '',
     password: '',     
     bio: '',
     image: '',
     email: '',
     toastState: false
    };       
 
  }

  updateUserName = (event: any) => {
    this.setState({ username: event.detail.value});   
  };


  updatePassword = (event: any) => {
    this.setState({ password: event.detail.value});
  };

  updateImage = (event: any) => {
    this.setState({ image: event.detail.value });
  };

  updateBio = (event: any) => {
    this.setState({ bio: event.detail.value});
  };
  

  componentDidMount() {
    let url = CONFIG.API_ENDPOINT+"user";
    
  
  fetch(url, {
          method: 'GET',
          headers: {
              "Content-Type": "application/json", 
              "Authorization": "Token " + localStorage.getItem("token")
          },         
      })
      .then(res => res.json())
      .then(
        (result) => {               
           this.setState({username: result.user.username, bio: result.user.bio, image: result.user.image, email: result.user.email})                
        },
          (error) => {
         console.error(error);
        }
      )
}  

update= () => {
  let credentials;
     credentials = {
      "user": {
        "bio": this.state.bio,        
        "image": this.state.image,
        "username": this.state.username,        
      }
    }
    if(this.state.password != ''){
      credentials = {
        "user": {
          "bio": this.state.bio,        
          "image": this.state.image,
          "username": this.state.username,
          "password": this.state.password
          
        }
      }      
    }
    if(this.state.image == null || this.state.image == '' ){
      delete credentials.user.image;
    }
    fetch(CONFIG.API_ENDPOINT+"user", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json", 
                "Authorization": "Token "+ localStorage.getItem("token")             
            },
            body: JSON.stringify(credentials)
        })
        .then(res => res.json())
        .then(
          (result) => {                 
              localStorage.setItem("token",result.user.token);      
              this.setState({
                toastState: true
              }) 
          },    
          (error) => {
           console.error(error);
          }
        )
  }
   
 render(){
    return(
      <>
        <Header title="Settings"> </Header>
        <IonToast
        isOpen={this.state.toastState}
        onDidDismiss={() => this.setState(() => ({ toastState: false }))}
        message= "Settings Updated"
        duration={400}
      ></IonToast>
        <IonContent padding>
          <form action="">
            <IonItem>
              <IonLabel position="fixed">Username</IonLabel>
              <IonInput onIonChange={this.updateUserName} type="text" placeholder="username"
                value={this.state.username}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Image URL</IonLabel>
              <IonInput onIonChange={this.updateImage} type="text" placeholder="Profile Picture"
                value={this.state.image}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Bio</IonLabel>
              <IonTextarea rows={8} onIonChange={this.updateBio} placeholder="Bio" value={this.state.bio}></IonTextarea>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Email</IonLabel>
              <IonInput disabled type="text" placeholder="email" value={this.state.email}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Password</IonLabel>
              <IonInput onIonChange={this.updatePassword} type="password" placeholder="password"
                value={this.state.password}></IonInput>
            </IonItem>
            <IonButton color="success" expand="block" onClick={this.update}>Update Settings</IonButton>
          </form>
        </IonContent>
      </>
    )
  }
}
export default SettingsPage