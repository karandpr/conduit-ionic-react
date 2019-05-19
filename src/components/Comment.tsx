import React from 'react';
import {   IonIcon} from '@ionic/react'
import {CONFIG} from '../constants'
import './Comment.css';


type Props = {  
  body: string,
  username: string,
  createdAt: string,
  commentId: number,
  slug: string,
  key: string,
  onDeleteComment: any;
}

class Comment extends React.Component<Props, any> {

  constructor(props: Props){
    super(props);   
  }
  
  deleteComment = (params: any) => {
    let url = CONFIG.API_ENDPOINT + "/articles/" + this.props.slug + '/comments/' + this.props.commentId;
    fetch(url, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.getItem("token"),
        }
      })
      .then(res => res.json())
      .then(
        (res) => {
          this.props.onDeleteComment(this.props.commentId)
        },

        (err) => {
          console.error(err);
        }
      )
  }
  
  render() {   
      return (
            <div className="comment-box">            
              <p className="comment-body"> {this.props.body}</p>
              <div > 
              <span className="comment-author">
              {this.props.username}  .  
               {new Intl.DateTimeFormat('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: '2-digit' 
        }).format(new Date(this.props.createdAt))}
              </span>
              {this.props.username == localStorage.getItem("username") ? 
              <span className="delete-icon">
              <IonIcon slot="end" name="trash" onClick={this.deleteComment}  />    
              </span> : ''  
            }
            </div>
            </div>
      );

  }
}

export default Comment