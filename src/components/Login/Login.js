import React, { useContext } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import {UserContext} from '../../App';
import { useHistory, useLocation } from 'react-router-dom';

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };
    
    if(firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    }
    
    const handleGoogleSignIn = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            const {displayName, email} = result.user;
            const signedInUser = {name: displayName, email} 
            setLoggedInUser(signedInUser);
            captureToken()
          }).catch(function(error) {
            const errorMessage = error.message;
            console.log(errorMessage);
          });
    }

     const captureToken = () => {
         firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
         .then(function (idToken) {
             sessionStorage.setItem("token", idToken)
             history.replace(from);
         }).catch(function (error) {
             // Handle error
         });
     }
    return (
        <div>
            {
                loggedInUser.name ? <button onClick={() => setLoggedInUser({})}>Sign Out</button>
                : <div>
                    <h4>This is Login</h4>
                    <button onClick={handleGoogleSignIn}>Continue With Google</button>
                </div>
            }
        </div>
    );
};

export default Login;