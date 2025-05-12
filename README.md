# Restaurant Reservation API

API REST complète avec Node.js, Express et MySQL permettant de gérer les réservations d'un restaurant, son menu, les tables et l'authentification.

## Installation

```bash
# Cloner le projet
git clone [repo-url]
cd restaurant-api

# Installer les dépendances
npm install

# Configuration de la base de données
# Créer un fichier .env à la racine du projet avec:
DATABASE_URL="mysql://user:password@localhost:3306/restaurant_db"
JWT_SECRET="votre_cle_secrete"

# Migrer la base de données
npx prisma migrate dev

# Démarrer le serveur
npm start
```

## Structure de la base de données

La base de données est structurée comme suit:

- **User**: Utilisateurs de l'application avec authentification
- **Reservation**: Réservations effectuées par les utilisateurs
- **Table**: Tables du restaurant avec nombre de places
- **ReservationTable**: Association entre réservations et tables
- **MenuItem**: Éléments du menu du restaurant

## Documentation de l'API

### Authentification

| Endpoint | Méthode | Description | Corps de la requête | Réponse | Accès |
|----------|---------|-------------|---------------------|---------|-------|
| `/auth/signup` | POST | Création de compte utilisateur | `{ "email": "user@example.com", "password": "password123", "fname": "Jean", "lname": "Dupont", "phone": "0612345678" }` | `{ "message": "Compte créé", "userId": 1 }` | Public |
| `/auth/login` | POST | Authentification | `{ "email": "user@example.com", "password": "password123" }` | `{ "token": "jwt_token" }` | Public |

### Réservations

| Endpoint | Méthode | Description | Corps de la requête | Réponse | Accès |
|----------|---------|-------------|---------------------|---------|-------|
| `/reservations` | GET | Récupérer toutes les réservations | - | Liste des réservations | Admin |
| `/reservations/my-reservations` | GET | Récupérer les réservations de l'utilisateur | - | Liste des réservations | Utilisateur |
| `/reservations` | POST | Créer une réservation | `{ "numberOfPeople": 4, "date": "2023-12-25", "time": "19:00", "note": "Anniversaire" }` | Détails de la réservation | Utilisateur |
| `/reservations/:id` | PUT | Modifier une réservation | `{ "numberOfPeople": 6, "date": "2023-12-25", "time": "20:00" }` | Détails de la réservation mise à jour | Utilisateur (si pending) |
| `/reservations/:id` | DELETE | Annuler une réservation | - | Confirmation d'annulation | Utilisateur/Admin |
| `/reservations/:id/validate` | PATCH | Valider une réservation | - | Réservation confirmée | Admin |

### Menu

| Endpoint | Méthode | Description | Corps de la requête | Réponse | Accès |
|----------|---------|-------------|---------------------|---------|-------|
| `/menu` | GET | Récupérer tout le menu | - | Liste des plats | Public |
| `/menu` | POST | Ajouter un élément au menu | `{ "name": "Steak Frites", "description": "Steak with french fries", "price": 15.99, "category": "plats" }` | Détails du nouvel élément | Admin |
| `/menu/:id` | PUT | Modifier un élément du menu | `{ "price": 17.99 }` | Détails de l'élément mis à jour | Admin |
| `/menu/:id` | DELETE | Supprimer un élément du menu | - | Confirmation de suppression | Admin |

### Tables

| Endpoint | Méthode | Description | Corps de la requête | Réponse | Accès |
|----------|---------|-------------|---------------------|---------|-------|
| `/tables` | GET | Récupérer toutes les tables | - | Liste des tables | Admin |
| `/tables` | POST | Ajouter une table | `{ "seats": 4 }` | Détails de la nouvelle table | Admin |
| `/tables/:id` | PUT | Modifier une table | `{ "seats": 6 }` | Détails de la table mise à jour | Admin |
| `/tables/:id` | DELETE | Supprimer une table | - | Confirmation de suppression | Admin |

## Gestion des statuts de réservation

Les statuts possibles pour une réservation sont:
- **pending**: Statut par défaut lors de la création
- **confirmed**: Réservation validée par un administrateur
- **cancelled**: Réservation annulée par le client ou un administrateur

## Algorithme d'attribution des tables

L'API attribue automatiquement les tables en fonction du nombre de personnes:
1. Recherche d'une table avec correspondance exacte
2. Si aucune correspondance exacte, combine plusieurs tables pour atteindre le nombre requis
3. Si aucune combinaison possible, refuse la réservation

## Comptes de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@restaurant.com | admin123 | admin |
| client@example.com | client123 | client |

## Auteurs

- [Nom Prénom] - [Fonctionnalité 1, Fonctionnalité 2]
- [Nom Prénom] - [Fonctionnalité 3, Fonctionnalité 4]
- [Nom Prénom] - [Fonctionnalité 5, Fonctionnalité 6]
- [Nom Prénom] - [Fonctionnalité 7, Fonctionnalité 8]

## 👥 Équipe

- **Kyllian** : Authentification (signup, login, JWT, middleware)
- **Talha** : Réservations (/reservations, logique de validation, status)
- **Romain** : Menu du restaurant (/menu, structuration en catégories, CRUD)
- **Hugo** : Gestion des tables (CRUD tables, logique d'attribution, vérification)

## 📦 Fonctionnalités principales

- Authentification sécurisée via JWT
- Système de réservation intelligent avec attribution automatique des tables
- Menu dynamique accessible publiquement
- Gestion des tables et des créneaux disponibles
- Documentation complète (README + PDF)
- Base de données MySQL + script SQL fourni

## 📁 Structure du projet

## 🧪 Test de l'API

Utiliser **Postman**.

### Comptes de test :

- Client : `jean@example.com` / `password123`
- Admin : `admin@example.com` / `adminpass`

## 🧾 Routes disponibles

### 🔐 Authentification

| Méthode | Route     | Description                 |
|---------|-----------|-----------------------------|
| POST    | /signup   | Création d'un compte client |
| POST    | /login    | Connexion + JWT             |

### 📅 Réservations

| Méthode | Route                        | Accès         |
|---------|------------------------------|---------------|
| GET     | /reservations                | Admin         |
| GET     | /my-reservations             | Client        |
| POST    | /reservations                | Client        |
| PUT     | /reservations/:id            | Client/Admin  |
| DELETE  | /reservations/:id            | Client/Admin  |
| PATCH   | /reservations/:id/validate   | Admin         |

### 📋 Menu

| Méthode | Route     | Accès     |
|---------|-----------|-----------|
| GET     | /menu     | Public    |
| POST    | /menu     | Admin     |
| PUT     | /menu/:id | Admin     |
| DELETE  | /menu/:id | Admin     |

### 🪑 Tables

| Méthode | Route     | Accès  |
|---------|-----------|--------|
| GET     | /tables   | Admin  |
| POST    | /tables   | Admin  |
| PUT     | /tables/:id | Admin |
| DELETE  | /tables/:id | Admin |

## 🧰 Installation

```bash
git clone https://github.com/votre-repo/api-restaurant
cd api-restaurant
npm install
cp .env.example .env
# Remplir les infos BDD dans .env
npm start
