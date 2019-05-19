import React from 'react';
import {  IonContent,  IonSegment, IonSegmentButton, IonLabel,  IonList} from '@ionic/react'
import ArticleCard from '../components/ArticleCard';
import { TagCloud } from '../components/TagCloud';
import Header from '../components/Header';
import { CONFIG } from '../constants';

type Props = { props:any };
type State = { articles: Array<any>, segment: string};

class HomePage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {      
      articles: [],              
      segment: "Global"
    };    
 
  }  
 
  handleTagClick = (tag: any) =>{ 
   
    fetch(CONFIG.API_ENDPOINT+"articles?tag="+tag)
    .then(res => res.json())
    .then(
      (res) => {
        this.setState({          
            articles: res.articles,         
        });
      },

      (err) => {
        console.error(err);
      }
    )
  }
  componentDidMount() {       
    fetch(CONFIG.API_ENDPOINT+"articles")
      .then(res => res.json())
      .then(
        (res) => {
          this.setState({           
            articles: res.articles,
            segment: "Global"
          });
        },
       
        (err) => {
            console.error(err);
        }
      )
  }

  toggle = (e: any) =>  {
    
    let url,headers;
    if(e.detail.value == 'myfeed') {
      url = CONFIG.API_ENDPOINT+"articles/feed";
      headers =  {
        "Content-Type": "application/json",  
        "Authorization": "Token "+ localStorage.getItem("token")           
    }
    } else {
      url = CONFIG.API_ENDPOINT+"articles";
      headers =  {
        "Content-Type": "application/json",                    
    } 
    }    
      fetch(url, {
        method: 'GET',
        headers: headers
      })
      .then(res => res.json())
      .then(
        (res) => {
          this.setState({           
            articles: res.articles,
            segment: e.detail.value
          });
        },
        (err) => {            
            console.error(err);
        }
      )
    
  }   

  render() {      
      return (
        <>   
        <Header title="Home"></Header>
        <IonContent> 
          <IonSegment onIonChange={this.toggle} color="success">
              <IonSegmentButton value="Global" color="success" checked={this.state.segment==='Global' }>
                  <IonLabel>Global Feed</IonLabel>
              </IonSegmentButton>
              {localStorage.getItem("isLogin") === "true" ? <IonSegmentButton value="myfeed" color="success"
                  checked={this.state.segment==='myfeed' }>
                  <IonLabel>Your Feed</IonLabel>
              </IonSegmentButton> : '' }
          </IonSegment>
        <IonList>
        {this.state.articles.map((article: any) => 
        <ArticleCard key={article.slug} title={article.title} src={article.author.image} description={article.description} favorited={article.favorited} favoritesCount={article.favoritesCount} slug={article.slug} author={article.author.username}></ArticleCard>
        )}      
        </IonList>
        <TagCloud onTagClick={(e: any) => this.handleTagClick(e)} ></TagCloud>   
        </IonContent>    
      </>
      );
    }
  
}

export default HomePage