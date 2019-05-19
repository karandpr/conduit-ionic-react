import * as React from 'react';
import { IonChip, IonLabel } from '@ionic/react';
import './TagCloud.css'
import { CONFIG } from '../constants';

type Props = {
    onTagClick: any;
}
type State = { tags: Array<string>};

class TagCloud extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {        
        tags: [],        
      };   

  }
  handleClick(tag: any) {   
    this.props.onTagClick(tag);
  }
  
  componentDidMount() {    
    fetch(CONFIG.API_ENDPOINT+"tags")
      .then(res => res.json())
      .then(
        (res) => {
          this.setState({          
            tags: res.tags
          });
        },      
        (err) => {
          console.error(err)
        }
      )
  }
 
  render() {
    return (      
      <div className="tagcloud">
      <IonLabel text-center>
            Popular Tags
          </IonLabel>
          <div>        
         {this.state.tags.map((tag: any, index: number) => 
          <IonChip color="success" key={index}>
          <IonLabel  onClick={() => this.handleClick(tag)}>{tag}</IonLabel>
        </IonChip>           
             )}         
         </div>
      </div> 
    );       
  }
}  

export { TagCloud }