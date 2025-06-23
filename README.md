# SmartScreen
Program to make our projector usefull
### Objectif du projet
Ce projet à pour but de permettre au membres de l'association DaVinci Bot de pouvoir partager leur écran directement via le site de davincibot.com. De plus, lorsqu'aucun contenu n'est partager, un diaporama est diffusé.

### Serveur

Le fichier `server.js` contient le script JavaScript permettant de lancer les serveurs WebSocket (wss) et HTTPS afin de pouvoir afficher les pages web (HTTPS) et les update en temps réel (WebSocket). Le serveur HTTP n'est pas utilisé car pour transmettre du flux vidéo entre deux machines différentes il faut être sur une page https.

La transmission des messages est en broadcast, c'est à dire que lorsqu'un client envoie un message, il est relayé à tous les autres clients connectés afin de pouvoir, par la suite, bloquer le partage aux autres clients lorsqu'un partage est déjà en cours.
```
Client HTTPS
│
├──> Requête HTTPS --> Renvoie un fichier (ex: sender.html)
│
└──> Connexion WebSocket (wss)
      │
      ├──> Envoie un message --> Relayé à tous les autres clients
      │
      └──> Déconnexion --> Retiré de la liste
```
Le serveur HTTPS et wss fonctionnent sur le même port soit le port 443. Le WebSocket est conçu pour fonctionner au dessus du HTTPS (ou HTTP) via une connexion "upgradée"

### Démarrer le serveur

Il est possible de démarrer le serveur via la commande `sudo npm run start` une fois dans le dossier WEBRTC_SCREEN_SHARE ou `node server.js`

### Transmission du flux vidéo

La transmission vidéo se fait via WebRTC (Web Real-Time Communication) qui est une technologie open-source qui permet aux navigateurs et applications mobiles de communiquer en temps réel directement (P2P) sans plugins. Donc dans notre cas, le serveur fait également office de client (peer) pour transmettre le flux vidéo.

### Démarrage lors du bootage 

Afin de faire en sorte que le programme se lance dès lors que la raspberry pi est alimentée, il faut d'abord écrire un script bash :
```
#!/bin/bash
export DISPLAY=:0
log_file="/home/utilisateur/cast_log.txt
cd /home/utilisateur/Dossier_contenant_le_projet
npm run start >> "$log_file" 2>&1 &
chromium-browser --kiosk "https://adresse_ip_ou_nom_de_domaine_du_serveur/public/receiver.html
```
Puis on se place dans le dossier utilisateur `nano .bashrc` et l'on vient ajouter `/chemin/vers/le/script.sh &` à la dernière ligne
