import React from 'react';
import {  IonAvatar, IonItem, IonIcon, IonLabel, IonGrid, IonCol, IonRow, IonItemSliding, IonItemOptions, IonItemOption} from '@ionic/react'
import { Link } from 'react-router-dom';
import './ArticleCard.css';
import { CONFIG } from '../constants';


type Props = {  
  title: string,
  src: string,
  description: string,
  favorited: boolean,
  favoritesCount: number,
  slug: string,
  author: string
}

type State = {  
  favorited: boolean,
  favoritesCount: number
}

class ArticleCard extends React.Component<Props, State> {

  constructor(props: Props){
    super(props);

    this.state = {      
      favorited: this.props.favorited,
      favoritesCount: this.props.favoritesCount
    }
    this.routeLink = '/article/'+this.props.slug;
    this.profileLink = '/profile/'+this.props.author;
    

  }
  routeLink: string;
  profileLink: string
favoriteArticle = (params: any) => {
 
  let url = CONFIG.API_ENDPOINT+"articles/" + this.props.slug + '/favorite';
  let method;
  if (!this.state.favorited) {
    method = 'POST'
  } else {
    method = "DELETE"
  }
  fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token " + localStorage.getItem("token"),
      }
    })
    .then(res => res.json())
    .then(
      (res) => {       
        this.setState({
          favorited: res.article.favorited,
          favoritesCount: res.article.favoritesCount,
        })
      },
      (err) => {
        console.error(err);
      }
    )
}

loggedInCard(){
  return (        
           <IonItemSliding>
          {this.loggedOutCard()}
        <IonItemOptions side="end">
          <IonItemOption  color={this.state.favorited ? "success": "light"} onClick={this.favoriteArticle}>
          <IonIcon color={this.state.favorited ? "light": "success"} class="icon-blog-card" name="heart" />{this.state.favoritesCount}</IonItemOption>
        </IonItemOptions>
      </IonItemSliding>           
  )
}

loggedOutCard() {
  return (                 
           <IonItem >
          <IonAvatar slot="start">
              <img src={this.props.src} />              
            </IonAvatar>
            <IonLabel>
              <p className="title">{this.props.title}</p>              
              <IonGrid >
                <IonRow>
                  <IonCol class="author" size="6">
                  <Link className="link" to={this.profileLink}>
                  {this.props.author}</Link>                     
                 </IonCol>
                  <IonCol  size="6" text-right>                  
                  <Link className="link" to={this.routeLink}>Read More</Link>        
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonLabel>
          </IonItem>      
  )
}  
  render() {   
      return (
        <>
        {localStorage.getItem("isLogin") === "true" ? this.loggedInCard() : this.loggedOutCard()} 
        </>               
      );    
  }
}

export default ArticleCard