
# Portail Client Botnb

## Project info

Application de gestion de logements connectée avec Beds24.

## Déploiement sur EasyPanel via GitHub

### Prérequis

1. Un compte GitHub avec ce dépôt
2. Un compte EasyPanel
3. Une instance Supabase configurée

### Configuration sur EasyPanel

1. Dans le tableau de bord EasyPanel, cliquez sur "Create App"
2. Sélectionnez "GitHub" comme source
3. Connectez-vous à votre compte GitHub et sélectionnez ce dépôt
4. Configurer les paramètres de build:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Variables d'environnement requises

Ajoutez ces variables d'environnement dans les paramètres de l'application EasyPanel:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Adresse du site

Après le déploiement, votre application sera accessible à l'URL fournie par EasyPanel.

## Développement local

Si vous voulez travailler localement sur ce projet, vous devez avoir Node.js & npm installés - [installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Suivez ces étapes:

```sh
# Étape 1: Cloner le dépôt en utilisant l'URL Git du projet
git clone <VOTRE_URL_GIT>

# Étape 2: Naviguer vers le répertoire du projet
cd <NOM_DE_VOTRE_PROJET>

# Étape 3: Installer les dépendances nécessaires
npm i

# Étape 4: Créer un fichier .env avec les variables nécessaires (voir .env.example)
cp .env.example .env
# Puis éditez le fichier .env avec vos valeurs

# Étape 5: Démarrer le serveur de développement
npm run dev
```

## Technologies utilisées

Ce projet est construit avec:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Structure du projet

- `/src`: Code source du projet
  - `/components`: Composants React réutilisables
  - `/context`: Contextes React (auth, etc.)
  - `/hooks`: Hooks personnalisés
  - `/lib`: Bibliothèques et configurations
  - `/pages`: Pages de l'application
  - `/services`: Services pour interagir avec les API
  - `/types`: Définitions de types TypeScript
  - `/utils`: Fonctions utilitaires
