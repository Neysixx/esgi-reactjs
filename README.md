# API REST - Réservations de Restaurant (Node.js + Express + MySQL)

## 👥 Équipe

- **Kyllian** : Authentification (signup, login, JWT, middleware)
- **Talha** : Réservations (/reservations, logique de validation, status)
- **Romain** : Menu du restaurant (/menu, structuration en catégories, CRUD)
- **Hugo** : Gestion des tables (CRUD tables, logique d’attribution, vérification)

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
| POST    | /signup   | Création d’un compte client |
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
