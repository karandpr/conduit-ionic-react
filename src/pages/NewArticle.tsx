import React from 'react';
import {  IonContent, IonButton, IonInput, IonToast } from '@ionic/react';
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css"; 
import * as Showdown from "showdown"; 
import './Article.css';
import { RouteComponentProps } from 'react-router';
import Header from '../components/Header';
import { CONFIG } from '../constants';


type Props = { props: {
    match: any
} };
type State = { error: any, isLoaded: boolean, value: any, tab: any, articleBody: string, description: String, title: String, tags: Array<string>,toastState: boolean};

class NewArticlePage extends React.Component<Props & RouteComponentProps, State>    {
    constructor(props: any) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,                   
          value: "Write your article",
          tab: "write",
          articleBody: '',
          description: '',
          tags: [],
          title: '',
          toastState: false
        };
       
        this.setEditor = (editor: any) => {
          this.editor = editor;
        };
        this.focusEditor = () => {
          if (this.editor) {
            this.editor.focus();
          }
        };
        
        this.converter = new Showdown.Converter({
          tables: true,
          simplifiedAutoLink: true,
          strikethrough: true,
          tasklists: true
        });      
        
     
      }
      
      setEditor: any;
      editor:any;
      focusEditor: any;
      converter: any;
      handleBodyChange = (articleBody: any) => {
        this.setState({ articleBody });
      };
      handleTabChange = (tab: any) => {
        this.setState({ tab });
      };
      titleChange = (event: CustomEvent) => {
        
        this.setState({ title: event.detail.value });

      }
      descriptionChange = (event: CustomEvent) => {
       
        this.setState({ description : event.detail.value });
          
      }
      tagsChange = (event: any) => {
          
         let tags =  (event.target as HTMLInputElement).value.split(',');
        this.setState({ tags: tags });
          
      }
      submitArticle = (tag: any) =>{ 
         
          let articleData = {
            "article": {
                "title": this.state.title,
                "description": this.state.description,
                "body": this.state.articleBody,
                "tagList": this.state.tags
            }
          }        
        fetch(CONFIG.API_ENDPOINT+"articles", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token "+ localStorage.getItem("token") ,
            },
            body: JSON.stringify(articleData)

        })
        .then(res => res.json())
        .then(
          (result) => {
                  
              this.setState({
                toastState: true,
                title: "",
                description: "",
                articleBody: "",
                tags: []
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
             <IonToast
        isOpen={this.state.toastState}
        onDidDismiss={() => this.setState(() => ({ toastState: false }))}
        message= "Article Submitted"
        duration={400}
      ></IonToast>
    <Header title="New Article" />     
    <IonContent padding>        
    <form onSubmit={this.submitArticle}>
      <IonInput type="text" placeholder="Title" onIonChange={this.titleChange} class="border-input"></IonInput>
    <IonInput type="text" placeholder="What's this article about"  onIonChange={this.descriptionChange} class="border-input"></IonInput>
  
          <ReactMde
          onChange={this.handleBodyChange}
          onTabChange={this.handleTabChange}
          value={this.state.articleBody}
          selectedTab={this.state.tab}
          generateMarkdownPreview={markdown =>
            Promise.resolve(this.converter.makeHtml(markdown))
          }
        />
         <IonInput type="text"  placeholder="Enter Tags" class="border-input"  onIonChange={this.tagsChange}></IonInput>
         <IonButton expand="block" onClick={this.submitArticle}>Submit Article</IonButton>        
      </form>      
    </IonContent>
  </>
        )
    }

}
  
export default NewArticlePage