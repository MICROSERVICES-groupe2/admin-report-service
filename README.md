# Admin & Report Service

Ce service Node.js/TypeScript gère l'administration globale de la plateforme bancaire et la génération des rapports consolidés

## Fonctionnalités Principales

- **Tableau de Bord Administrateur (CRUD)** : Gestion des opérateurs financiers (Wave, Orange Money, etc.).
- **Paramétrage Global** : Configuration des commissions et plafonds système. Mise à jour propagée via le Message Bus (RabbitMQ/Kafka).
- **Génération de Rapports** :
  - **PDF** : Rapport détaillé de transactions généré via Puppeteer (HTML vers PDF).
  - **Excel** : Export natif via ExcelJS.
- **Statistiques** : Endpoints agrégés pour le volume des transactions et le scoring des prêts, communiquant avec les autres microservices de la plateforme via l'API Gateway.

## Stack Technique

- **Backend** : Node.js avec Express, TypeScript.
- **Base de données** : PostgreSQL (avec l'ORM Sequelize).
- **Génération Documentaire** : Puppeteer (PDF), ExcelJS (XLSX).
- **Message Bus** : RabbitMQ (via amqplib) pour les événements `ConfigUpdatedEvent`.

---

## 🚀 Démarrage Rapide

### Pré-requis
- Node.js (v18 ou v20 recommandés)
- Docker et Docker Compose

### 1. Variables d'environnement
Copiez le fichier `.env.example` en `.env` (ou utilisez les valeurs par défaut) :
```bash
cp .env.example .env
```
Assurez-vous de définir (si différent du dev local) :
```env
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bank_admin_db
RABBITMQ_URL=amqp://guest:guest@localhost:5674
API_GATEWAY_URL=http://localhost:8000
PORT=8088
```

### 2. Démarrer l'infrastructure locale (DB + RabbitMQ)
Pour démarrer rapidement PostgreSQL et RabbitMQ pour le test de ce service :
```bash
docker-compose -f docker-compose.dev.yml up -d postgres rabbitmq
```

### 3. Lancer l'application en développement
Installez les dépendances :
```bash
npm install
```

Puis démarrez le serveur :
```bash
npm run dev
```
Le service écoutera par défaut sur `http://localhost:8088`.

---

## 🐳 Déploiement avec Docker

Pour démarrer tout le service dans des conteneurs :
```bash
docker-compose -f docker-compose.dev.yml up --build
```
Ceci lancera le service Node.js avec Chromium embarqué (pour Puppeteer), la base de données PostgreSQL, et RabbitMQ.

---

## 🧪 Tester l'API

Vous pouvez tester les différents endpoints via Postman ou curl.

### 1. Administration des Opérateurs

**Lister les opérateurs :**
```bash
curl -X GET http://localhost:8088/api/v1/admin/operators
```

**Créer un opérateur :**
```bash
curl -X POST http://localhost:8088/api/v1/admin/operators \
     -H "Content-Type: application/json" \
     -d '{"name": "Wave", "code": "WAVE", "status": "ACTIVE"}'
```

### 2. Paramétrages globaux (Propage l'événement RabbitMQ)

**Mettre à jour les commissions :**
```bash
curl -X PUT http://localhost:8088/api/v1/admin/config/commissions \
     -H "Content-Type: application/json" \
     -d '{"WAVE": 1.0, "ORANGE_MONEY": 2.0}'
```

### 3. Rapports (PDF & Excel)

**Télécharger le rapport PDF des transactions :**
```bash
curl -X POST http://localhost:8088/api/v1/reports/transactions \
     -H "Content-Type: application/json" \
     -d '{"from": "2026-01-01", "to": "2026-12-31"}' \
     --output report.pdf
```

**Télécharger le rapport Excel :**
```bash
curl -X POST http://localhost:8088/api/v1/reports/transactions/excel \
     -H "Content-Type: application/json" \
     -d '{"from": "2026-01-01", "to": "2026-12-31"}' \
     --output report.xlsx
```

---

## ✅ Tests Unitaires

Pour exécuter la suite de tests (Jest) :
```bash
npm run test
```
*(Assurez-vous que les dépendances soient installées et que les mocks d'API externes soient configurés dans les tests)*.

## 📦 Organisation du Code

- `src/config/` : Configuration de la DB Sequelize et chargement des variables d'environnement.
- `src/controllers/` : Logique de traitement des requêtes HTTP (Admin et Rapports).
- `src/models/` : Modèles de données Sequelize (`Operator`, `SystemConfig`).
- `src/reports/` : Templates HTML pour la génération PDF.
- `src/routes/` : Définition des endpoints.
- `src/services/` : Interfaces avec l'extérieur (génération de rapports, HttpClient via Axios, RabbitMQ).
