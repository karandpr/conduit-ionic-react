import React from 'react';
import { IonToolbar, IonTitle,  IonHeader, IonMenuButton } from '@ionic/react';

class Header extends React.Component<any,any> {
    render() {   
        return (  
         <IonHeader>
          <IonToolbar >
          <IonTitle  class="header"  color="success">{this.props.title}</IonTitle>           
            <IonMenuButton slot="start"></IonMenuButton>      
          </IonToolbar>
        </IonHeader> 

        )
    }
}
export default Header