import React, { Component } from 'react';

import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import './App.css';
import {
  IonApp, 
  IonPage,
  IonRouterOutlet,
  IonSplitPane
} from '@ionic/react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
 import ProfilePage from './pages/ProfilePage';
 import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
 import ArticlePage from './pages/ArticlePage';
import SettingsPage from './pages/Settings';
 import NewArticlePage from './pages/NewArticle';

class App extends Component {
  constructor(props: any){
        super(props);
        }
  render() {
    return (
      <Router>
        <div className="App">        
          <IonApp>
          <IonSplitPane contentId="main">         
            <SideMenu></SideMenu>
            <IonPage id="main">        
              <IonRouterOutlet>
                <Route exact path="/" component={HomePage} />
                <Route path="/article/:slug" component={ArticlePage} />
                <Route path="/profile/:authorname" component={ProfilePage} />
                <Route exact path="/login" component={LoginPage} />                        
                <Route path="/settings" component={SettingsPage} />
                <Route path="/newarticle" component={NewArticlePage} />               
              </IonRouterOutlet>
            </IonPage>
            </IonSplitPane>
          </IonApp>
        </div>
      </Router>
    );
  }
}

export default App;
