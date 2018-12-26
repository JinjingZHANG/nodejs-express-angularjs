# express-test
## L'objectif 
créer un mini carnet d'adresse pour extraterrestre sous NodeJS à savoir :
* (Inscription/Connexion/Déconnexion) du extraterrestre par login/mot de passe 
* (Afficher/Modifier) ses informations (age / famille / race / nourriture) 
* (ajouter /supprimer) un extraterrestre (déjà inscrit) de sa liste d'amis

## Les technologies
nodeJS, express, mongoDB, jQuery...

## Pour commencer  
````
npm install --save nodemon
nodemon
````

# En attendant l'amélioration
1. Le mot de passe doit être caché ou masqué lors de l'affichage. (blueimp-md5)  
2. Quand l'utilisateur veut modifier les insformations, on doit faire le "Login d'authentification" pour juger son droit de modification. (express-session que j'ai utilisé dans Connexion/Déconnexion ou JSON Web Tokens)
