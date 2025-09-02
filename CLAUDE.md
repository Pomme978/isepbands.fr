### 1. Approche Générale

- Toujours viser des **solutions propres et durables** : pas de quick-fix ou workaround.
- Chercher à résoudre la **cause racine** des problèmes.
- Ne jamais donner de solution “partielle” qui contourne le vrai souci.

### 2. Qualité de Code

- Toujours rédiger une **TODO list détaillée** avant d’implémenter une fonctionnalité.
- Lire les fichiers existants avant toute modification.
- Favoriser la **clarté et la maintenabilité** du code (structure, typage, conventions).
- Utiliser TypeScript de manière stricte (éviter `any`, privilégier des types précis).
- Respecter les bonnes pratiques Next.js 15 (App Router, Server Components vs Client Components).
- **Internationalisation** : tout texte doit passer par `next-international`.

### 3. Tests

- Toujours penser en mode **TDD (Test Driven Development)** : écrire les tests avant le code.
- Utiliser **Jest** pour les tests unitaires, **Playwright** pour les E2E.
- Tester avec des données réelles quand c’est possible (éviter les mocks abusifs).

### 4. Sécurité & Config

- Ne jamais hardcoder de secrets (API keys, tokens, SMTP).
- Utiliser les **fichiers `.env`** et le système de config Next.js (`process.env`).
- Vérifier les permissions côté backend **et** côté frontend (double barrière).
- Toute API doit passer par la middleware **`standardAuth`**.

### 5. Base de Données

- Toute évolution passe par **Prisma Migrate** :
  ```bash
  npx prisma migrate dev
  ```

Utilise toujours langlink pour les liens de page
prisma est localisé à @/lib/prisma
utiliser en priorité les components de @/components/common au lieu de shadcn si disponibles.
Ne jamais build le projet.
Le serveur de dev est en ligne au port 3000.
les données de seed sont dans /src/data.
uniformise toujours les components et modal.
Aucun emojis dans le code.