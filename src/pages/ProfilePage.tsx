import React from 'react';
import { IonIcon, IonLabel, IonContent, IonChip, IonItemDivider, IonToast,} from '@ionic/react'
import { RouteComponentProps } from 'react-router-dom';
import "./Article.css"
import Header from '../components/Header';
import ArticleCard from '../components/ArticleCard';
import { CONFIG } from '../constants';


type  Props = {  
 
}

type State = {  
  profile: any,
  articlesAuthor: any,
  articlesFavorites : any,
  isFollowing: boolean,
  toastState: boolean
  
}

class ProfilePage extends React.Component<Props & RouteComponentProps<any>, State> {

  constructor(props: any){
    super(props);

    this.state = {     
      profile: '',   
      articlesFavorites: [],
      articlesAuthor: [],
      isFollowing: false,
      toastState: false
                  
    }    
  }

  fetchArticles(url: string){
    let headers;
  
    if(localStorage.getItem("isLogin") && localStorage.getItem("isLogin") === "true"){ 
      headers =  {
        "Content-Type": "application/json",  
        "Authorization": "Token "+ localStorage.getItem("token")           
    }
    } else {
      headers =  {
        "Content-Type": "application/json",                      
    }
  }
    
    return fetch(url, {
      method: 'GET',
            headers: headers, 
    }).then((res) => res.json())
  
}
  componentDidMount() {
      let profileUrl = CONFIG.API_ENDPOINT+"profiles/"+ this.props.match.params.authorname;
      let articlesByProfileUrl = CONFIG.API_ENDPOINT+"articles/?author="+ this.props.match.params.authorname;
      let favoritedArticlesUrl = CONFIG.API_ENDPOINT+"articles/?favorited="+ this.props.match.params.authorname;




      Promise.all([this.fetchArticles(profileUrl), this.fetchArticles(articlesByProfileUrl),this.fetchArticles(favoritedArticlesUrl)]).then((result) => {
        
        this.setState({
          profile: result[0].profile,
          articlesFavorites: result[2].articles,
          articlesAuthor: result[1].articles,
          isFollowing: result[0].profile.following
        });
       
      }).catch(err => {
        console.error(err);
      })

  }  

  settings = (event: any) => {   
    this.props.history.push('/settings');

  }
  followUser = (e: any) => {
    let profileUrl = CONFIG.API_ENDPOINT+"profiles/"+ this.props.match.params.authorname +'/follow';
    let method;
    if(this.state.isFollowing){
      method = 'DELETE'
    } else {
      method = 'POST'
    } 
    fetch(profileUrl, {
      method: method,
      headers: {
          "Content-Type": "application/json", 
          "Authorization": "Token " + localStorage.getItem("token")
      }
     

  }).then(res => res.json())
  .then((res) => {
    this.setState({
      isFollowing: !this.state.isFollowing,
      toastState: true
    })

   
  }) 

  }


  
  render() {      
   
      return (
        <>
          <IonToast
        isOpen={this.state.toastState}
        onDidDismiss={() => this.setState(() => ({ toastState: false }))}
        message= {this.state.isFollowing ?  'Following '+ this.state.profile.username : 'Unfollowed ' + this.state.profile.username}
        duration={400}></IonToast>
          <Header title="Profile"></Header>
          <IonContent padding>
            <div className="ion-text-center">
              <img src={this.state.profile.image} alt="logo" width="30%" />
            </div>
            <div className="ion-padding-left ion-padding-right ion-text-center">
              <div className="article-title">{this.state.profile.username}</div>
              <div className="article-description">{this.state.profile.bio}</div>

              <hr />
              {localStorage.getItem("isLogin") === "true" ? 
                <>
                 {localStorage.getItem("username") === this.state.profile.username ?
              <IonChip onClick={this.settings}>
                <IonIcon name="settings" color="primary" />
                <IonLabel>Settings </IonLabel>
              </IonChip> :
              <IonChip onClick={this.followUser}>
                <IonIcon name={this.state.isFollowing ? "remove" : "add" } color="primary" />
                <IonLabel>{this.state.isFollowing ? "Unfollow" : "Follow"} </IonLabel>
              </IonChip> }
                </> : ''
              }
             
              <IonItemDivider>
                <IonLabel>
                  Articles By Author
                </IonLabel>
              </IonItemDivider>
              {this.state.articlesAuthor.map((art: any, index: number) =>
              <ArticleCard key={art.slug} title={art.title} src={art.author.image} description={art.description}
                favorited={art.favorited} favoritesCount={art.favoritesCount} slug={art.slug}
                author={art.author.username}></ArticleCard>

              )}
              <IonItemDivider>
                <IonLabel>
                  Favorites
                </IonLabel>
              </IonItemDivider>
              {this.state.articlesFavorites.map((art: any, index: number) =>
              <ArticleCard key={art.slug} title={art.title} src={art.author.image} description={art.description}
                favorited={art.favorited} favoritesCount={art.favoritesCount} slug={art.slug}
                author={art.author.username}></ArticleCard>)}
            </div>
          </IonContent>
        </>
      );
 
  }
}

export default ProfilePage