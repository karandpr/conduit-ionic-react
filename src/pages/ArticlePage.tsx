import React from 'react';
import {  IonAvatar, IonLabel, IonButton, IonContent, IonChip,  IonTextarea} from '@ionic/react'
import {  RouteComponentProps } from 'react-router-dom';
import * as Showdown from "showdown";
import Comment from '../components/Comment';
import "./Article.css"
import Header from '../components/Header';
import { CONFIG } from '../constants';

type Props = {  
 
}

type State = {  
  article: any,
  author: any,
  comments: any,
  comment: string
}

class ArticlePage extends React.Component<Props & RouteComponentProps<any>, State> {

  constructor(props: any){
    super(props);

    this.state = {     
        article: '',   
        author: '',
        comments: [],
        comment: ''           
    }    
     this.converter = new Showdown.Converter({
          tables: true,
          simplifiedAutoLink: true,
          strikethrough: true,
          tasklists: true,
          requireSpaceBeforeHeadingText: true
        });  
    

  }
  converter: any;
  fetchArticle(url: string){
    let headers;
    if(localStorage.getItem("isLogin") && localStorage.getItem("isLogin") == "true"){ 
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
      let url = CONFIG.API_ENDPOINT+"articles/"+ this.props.match.params.slug;
      let commentsUrl = url + '/comments';
      let headers:any;
     

      Promise.all([this.fetchArticle(url),this.fetchArticle(commentsUrl)]).then(
        (result) => {
          this.setState({
            article: result[0].article,
            author: result[0].article.author,
            comments: result[1].comments

          })
        }
      ) 

  }  

  updateComment = (event: any) => {
    this.setState({ comment: event.detail.value });
   
  }

  deleteComment = (e: any) => {
    this.setState({
      comments: this.state.comments.filter((com: any) => com.id !== e )
    })
    
  }
  addComment = () => {
    let url = CONFIG.API_ENDPOINT+"articles/"+ this.props.match.params.slug;
    let commentsUrl = url + '/comments';
    let body = {
      "comment": {
        "body": this.state.comment
      }
    }
    fetch(commentsUrl, {
      method: 'POST',
      headers: {
          "Content-Type": "application/json", 
          "Authorization": "Token " + localStorage.getItem("token")
      },
      body: JSON.stringify(body)

  }).then(res => res.json())
  .then((com) => {
    let newComments = this.state.comments;
    newComments.push(com.comment);
 this.setState({comments: newComments, comment: ''})
  }) 

  }
  viewAuthor = () => {
    
    this.props.history.replace('/profile/' + this.state.author.username)
  }


  
  render() {
      let article = this.state.article;
      let author = this.state.author;
   
      return (
        <>
          <Header title="Article"></Header>
          <IonContent padding>
            <div className="ion-padding-left ion-padding-right">
              <div className="article-title">{article.title}</div>
              <div className="article-description">{article.description}</div>

              <IonChip onClick={this.viewAuthor}>
                <IonAvatar>
                  <img src={author.image} />
                </IonAvatar>
                <IonLabel>{author.username} </IonLabel>

              </IonChip>
              <IonChip>
                {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
                }).format(new Date(article.createdAt ? article.createdAt : 0))}
              </IonChip>

              <hr />
              <div dangerouslySetInnerHTML={ { __html: this.converter.makeHtml(article.body)}}></div>

            </div>
            <hr className="horizontal-line" />
            {this.state.comments.length > 0 ?
            <div>
              {this.state.comments.map((art: any, index: number) =>
              <Comment key={art.id} body={art.body} slug={this.state.article.slug} createdAt={art.createdAt}
                commentId={art.id} username={art.author.username} onDeleteComment={this.deleteComment}></Comment>
              )}
            </div>: <p className="ion-text-center">
              No Comments
            </p>}

            <hr className="horizontal-line" />

            {localStorage.getItem("isLogin") === "true" ?
            <div>
            <div className="border-green">
              <IonTextarea onIonChange={this.updateComment} placeholder="Write a comment" value={this.state.comment}>
              </IonTextarea>              
            </div> 
            <IonButton color="success" onClick={this.addComment}>Add Comment</IonButton>
            </div>: '' }
          </IonContent>
        </>
      );
    
  }
}

export default ArticlePage