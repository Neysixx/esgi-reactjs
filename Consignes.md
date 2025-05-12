📦 Projet Final — API Node / Express : Application de Réservation pour un Restaurant
🎯 Objectif Général

Développer une API REST complète avec Node.js, Express et MySQL permettant de gérer :

    Les réservations clients

    Le menu du restaurant (accès public)

    La gestion des tables et créneaux horaires

    L’authentification sécurisée (JWT)

    Cette API sera consommée par une future application frontend. Elle doit être claire, documentée, maintenable et complète.

👥 Organisation du Projet

    Travail obligatoire en groupe de 4 étudiants

    Chacun doit participer à au moins une fonctionnalité complète

    Indiquer qui fait quoi dans le README.md ou un document PDF

    Évaluation collective + vérification des participations individuelles

🧩 Partie 1 — Obligatoire (60%)
✅ Authentification

    POST /signup : Création de compte utilisateur

    POST /login : Authentification via email/mot de passe → JWT

    Middleware authMiddleware pour protéger les routes privées

✅ Gestion des Réservations (/reservations)

    GET /reservations : Toutes les réservations (admin)

    GET /my-reservations : Réservations de l’utilisateur connecté

    POST /reservations : Création (auth requise)
    Champs : name, phone, number_of_people, date, time, note
    ✅ Vérifie disponibilité et attribue automatiquement les tables
    ➕ Statut par défaut : pending

    PUT /reservations/:id : Modification (si statut = pending)

    DELETE /reservations/:id : Annulation

    PATCH /reservations/:id/validate : Validation par admin → statut = confirmed

Statuts possibles :

    pending

    confirmed (admin uniquement)

    cancelled (admin ou client)

✅ Menu du Restaurant (/menu)

    GET /menu : Libre d’accès

    Structuration par catégories : entrées, plats, desserts, boissons, etc.

    Chaque plat : id, name, description, price, category, image (optionnel)

✅ Gestion des Tables

    Tables fixes (2, 4, 6 places)

    L’admin peut gérer les tables disponibles

    Réservation = 1+ tables selon le nombre de personnes

    Doit respecter la disponibilité (ex. : 7 pers = 1 table 6 + 1 table 2)

✅ Documentation de l’API (obligatoire)

Inclure dans le README.md et/ou un PDF :

    Liste des endpoints

    Exemples de requêtes (JSON input/output)

    Méthodes utilisées (GET, POST, etc.)

    Codes de statuts HTTP

    Précision sur les droits d’accès

🌟 Partie 2 — Bonus (jusqu’à +40%)

    Optionnel, à réaliser sur une demi-journée supplémentaire

💡 Fonctionnalités Bonus Proposées

    Créneaux personnalisés

        Table opening_slots : horaires par jour (ex : 12h, 13h, 19h, etc.)

        Gestion exceptions : fermetures / ajouts exceptionnels

        Exemple : GET /availability?date=2025-06-20

    Rôles utilisateur

        role dans users : admin / client

        Admin peut tout valider, annuler, gérer horaires et stats

        Client peut réserver, voir/annuler ses réservations

    Gestion fine des tables

        Réservation de plusieurs tables

        Refus si aucune combinaison possible

    Filtres dynamiques

        GET /reservations?date=...&status=...&sort=...

        GET /menu?category=...&max_price=...

    Notifications simulées

        Ex : Console log lors d'une confirmation :

    [NOTIF] Réservation "confirmée" pour Marie DURND à 20h le 15/06.

Structure BDD (MySQL)
Exemple de tables :

    users(id, email, password_hash, fname, lname, phone, role)
    reservations(id, user_id, number_of_people, date, time, status)
    tables(id, seats)
    reservation_tables(reservation_id, table_id)
    menu_items(id, name, description, price, category)
    opening_slots(id, date_time, duration, available, comment)

📦 Livrables à Rendre

    Projet complet sur GitHub/GitLab :

        server.js, routes/, controllers/, models/

    Testable via Postman ou ThunderClient

    Fichier .sql de création des tables

    Schéma BDD (MCD / MLD / MPD)

    README.md contenant :

        Présentation du projet

        Documentation des routes

        Instructions d’installation & de test

    JWT de test ou comptes pré-enregistrés (ex : jean@example.com / mot de passe)

🧮 Barème Final (/100)
Partie Obligatoire — 60 pts
Critère	Points
API fonctionnelle	/40
Implication individuelle	/20
Partie Bonus — 40 pts
Critère	Points
Fonctionnalités avancées	/30
Initiative personnelle	/10