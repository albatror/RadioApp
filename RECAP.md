# Audit Récapitulatif — EthnAfrika RadioApp

**Date d'audit** : 2026-06-19  
**Auditeur** : Ruflo Swarm (swarm-1781853196283-iqow0d, topology: hierarchical)  
**Niveau de maturité global** : **2.5 / 5 — MVP / Prototype fonctionnel**

---

## Score par Dimension

| Dimension | Score | Résumé |
|-----------|-------|--------|
| Architecture & Structure | 3.5/5 | Bonne séparation composants, mais état centralisé et CSS non scopé |
| Qualité du code | 2.5/5 | Lisible mais problèmes significatifs : duplication, types `any`, catch vides |
| Gestion des dépendances | 3/5 | Stack moderne, dépendances minimales, conflit CDN/npm |
| Tests & Couverture | 1/5 | 2 tests visuels, tous deux en échec |
| Documentation | 1.5/5 | README minimal, pas de LICENSE, pas de CHANGELOG |
| Sécurité | 2/5 | URLs hardcodées, clé API exposée, CDN externe non vérifié |
| Performance | 3.5/5 | Visualiseur optimisé, mais rechargement stream inutile à chaque play |
| Conformité & Bonnes pratiques | 2/5 | Pas d'ESLint, pas de CI/CD, fichiers binaires en dépôt |

---

## 1. Architecture & Structure

### Points forts
- Composants petits et focalisés (`Hero`, `History`, `UpNext`, `Visualizer`, `Sidebar`, `TopBar`)
- Typage TypeScript avec interfaces AzuraCast bien définies dans `types.ts`
- Séparation claire données / présentation : `App.tsx` gère l'état, les composants sont purement visuels
- PWA avec `manifest.json` et icônes

### Problèmes
- **`constants.ts` vide** — les constantes critiques (`AZURACAST_API_URL`, `STREAM_URL`, `LIKED_SONGS_KEY`) sont inlinées dans `App.tsx`
- **Un seul fichier CSS global** (`index.css`) — pas de scoping, risque de collisions de noms à l'échelle
- **Pas de service worker** — le manifest PWA est présent mais l'app n'est pas offline-capable
- **Conflit de chargement React** : `index.html` charge React via importmap CDN (`aistudiocdn.com`) ET `package.json` inclut React en dépendance npm — double chargement potentiel

---

## 2. Qualité du Code

### Points forts
- Composants concis (aucun ne dépasse ~115 lignes)
- Utilisation correcte des hooks React (`useRef`, `useEffect`, `useState`)
- `useIsMobile()` hook bien encapsulé
- Accessibilité de base : `aria-label` sur tous les boutons de contrôle
- Gestion Safari via `webkitAudioContext`

### Problèmes identifiés

| Priorité | Problème | Localisation |
|----------|---------|-------------|
| P1 | `catch (e) {}` silencieux — erreurs avalées sans feedback utilisateur | `App.tsx:59`, `App.tsx:75` |
| P1 | Duplication de `fmtTime()` | `Hero.tsx:17` et `UpNext.tsx:10` |
| P2 | Types `any` — `station: any`, `live: any`, `custom_fields: any[]` | `types.ts:44,46,18` |
| P2 | Handlers `handleStalled` et `handleWaiting` vides (no-op) enregistrés inutilement | `App.tsx:145-147` |
| P2 | Props `(p: any)` sur tous les exports d'icônes | `Icons.tsx:25-41` |
| P2 | Interface `Song` déclarée mais jamais utilisée | `types.ts:1-6` |
| P3 | Liens sociaux `href="#"` — non fonctionnels en production | `App.tsx:224-228` |
| P3 | Commentaire de code mort : `{/* <div className="countdown">in 2:14</div> */}` | `UpNext.tsx:29` |
| P3 | `metadata.json` non utilisé au runtime | `src/metadata.json` |

---

## 3. Gestion des Dépendances

### Points forts
- Stack minimaliste : seulement 2 dépendances runtime (React + ReactDOM)
- Versions récentes et actuelles (React 19, Vite 6, TS 5.8)

### Problèmes

| Problème | Impact |
|---------|--------|
| Conflit CDN/npm : React chargé deux fois | Erreurs runtime potentielles |
| `vite.config.ts` expose `GEMINI_API_KEY` dans le bundle client | Fuite de clé API si définie |
| `@types/node` en devDependency mais TypeScript config inclut `"types": ["node"]` | Inutile pour une app browser pure |
| Pas de `engines` dans `package.json` | Aucune contrainte sur la version Node |

---

## 4. Tests & Couverture

### Situation actuelle
- **2 tests Playwright** uniquement (`verify_ui.spec.ts`)
- Tests purement visuels (screenshot) — aucune assertion fonctionnelle
- **Les 2 tests sont en échec** (`test-results/.last-run.json`: `"status": "failed"`)
- Pas de tests unitaires, pas de tests d'intégration
- Couverture fonctionnelle estimée : **< 5%**

### Ce qui n'est pas testé
- Lecture audio (play/pause)
- Appel API AzuraCast
- Système de likes (ajout, suppression, TTL 24h)
- Changement de langue EN/FR
- Changement de thème dark/light
- Gestion d'erreur réseau
- Vue mobile vs desktop
- Visualiseur audio

### Recommandations
1. Ajouter **Vitest** pour les tests unitaires (hooks, fonctions utilitaires)
2. Corriger les tests Playwright existants
3. Ajouter des tests Playwright fonctionnels : play, like, langue
4. Viser 60% de couverture minimum sur les fonctions critiques

---

## 5. Documentation

### Situation actuelle
- `README.md` : 3 lignes d'instructions, sans description du projet ni contexte
- Commentaires inline : présents dans `Visualizer.tsx` (explications algorithmiques — bonne pratique)
- Pas de `LICENSE`
- Pas de `CONTRIBUTING.md`
- Pas de `.env.example`
- Pas de documentation API

### Créé par cet audit
- `ARCHITECTURE.md` — structure complète, data flow, audio pipeline
- `CHANGELOG.md` — historique des versions et roadmap
- `CONTEXT.md` — contexte projet, décisions techniques, état actuel
- `RECAP.md` — ce document

---

## 6. Sécurité

### Vulnérabilités identifiées

| Sévérité | Problème | Recommandation |
|----------|---------|----------------|
| **HAUTE** | `GEMINI_API_KEY` injectée dans le bundle client via `vite.config.ts` | Supprimer `define` ou utiliser `VITE_` prefix uniquement pour les vars publiques |
| **HAUTE** | URLs API et stream hardcodées dans le code source | Déplacer vers `.env` variables |
| **MOYENNE** | React chargé depuis CDN externe `aistudiocdn.com` non officiel | Utiliser le build npm uniquement |
| **MOYENNE** | Images depuis `i.ibb.co` (CDN tiers non contrôlé) | Héberger les assets sur le domaine propriétaire |
| **MOYENNE** | `ruvector.db` committé (fichier binaire de données) | Ajouter à `.gitignore`, supprimer du repo |
| **FAIBLE** | `catch (e) {}` silencieux — masque les erreurs | Logger les erreurs, afficher un état d'erreur à l'utilisateur |
| **FAIBLE** | Pas de Content-Security-Policy configuré | Ajouter headers CSP dans Vite/serveur |
| **INFO** | `crossOrigin="anonymous"` sur `<audio>` — correct | Maintenir |

---

## 7. Performance

### Points forts
- `Visualizer.tsx` : optimisation remarquable
  - `IntersectionObserver` — pause quand hors viewport
  - `document.visibilitychange` — pause quand onglet caché
  - FPS cappé à 24 (`const FPS = 24`)
  - Manipulation DOM directe via `refs` — zéro re-render React
  - Distribution logarithmique des fréquences pour meilleure réponse visuelle

### Axes d'amélioration

| Problème | Impact | Fix |
|---------|--------|-----|
| Cache-bust à chaque play (`?t=Date.now()`) force le rechargement du flux même pour une reprise | Latence, reconnexion réseau | Ne bust que si en erreur ou première lecture |
| Listeners audio ajoutés/retirés à chaque changement de `isPlaying` | CPU overhead minimal | Déplacer hors du hook dépendant d'`isPlaying` |
| Images externes (logo, QR) sans `loading="lazy"` | LCP dégradé | Ajouter `loading="lazy"` |
| Pas de `React.memo` sur composants purement présentationnels | Re-renders sur chaque fetch API (10s) | Mémoïser `History`, `UpNext`, `Sidebar` |

---

## 8. Conformité & Bonnes Pratiques

### Présent ✓
- `.gitignore` (standard Node.js)
- PWA Manifest
- TypeScript strict
- Responsive design (mobile + desktop)
- HTML sémantique (`<aside>`, `<header>`, `<footer>`, `<main>`)
- `aria-label` sur les boutons interactifs
- `React.StrictMode` activé

### Absent ✗
- `LICENSE` — projet sans licence = tous droits réservés par défaut
- `.env.example` — aucun modèle pour les variables d'environnement
- ESLint — pas de linting
- Prettier — pas de formatage automatique
- Husky / lint-staged — pas de hooks pre-commit
- CI/CD (GitHub Actions ou autre)
- `ruvector.db` dans le repo (binaire non versionnable)

---

## 9. Points Forts & Faibles

### Points forts
1. **Visualiseur audio performant** — implémentation WebAudio + rAF de qualité production
2. **Stack moderne** — React 19, Vite 6, TypeScript 5.8
3. **Composants légers et lisibles** — aucun composant > 115 lignes
4. **PWA-ready** — manifest configuré avec couleurs et icônes
5. **Bilingue** — EN/FR avec helper inline simple et efficace
6. **Reconnexion automatique** — gestion des erreurs stream avec retry
7. **Accessibilité de base** — aria-labels systématiques

### Faibles critiques
1. **Tests en échec** — 0% de tests fonctionnels passants
2. **Pas de LICENSE** — projet légalement ambigu
3. **Sécurité des clés API** — `GEMINI_API_KEY` exposée côté client
4. **Erreurs silencieuses** — l'utilisateur ne voit jamais d'état d'erreur
5. **Conflit React CDN/npm** — comportement runtime imprévisible
6. **Pas de feedback sur les boutons non fonctionnels** — Cast, Bell, Settings, Share n'ont aucune action

---

## Plan d'Amélioration Priorisé

### Phase 1 — Urgences (1-2 jours)
- [ ] **Retirer `GEMINI_API_KEY` du `vite.config.ts`** — risque de fuite
- [ ] **Corriger le conflit CDN/npm** — retirer l'importmap de `index.html` ou retirer React des deps npm
- [ ] **Ajouter `ruvector.db` au `.gitignore`**
- [ ] **Ajouter un `LICENSE`** (MIT recommandé)

### Phase 2 — Qualité (3-5 jours)
- [ ] **Déplacer les constantes** (`AZURACAST_API_URL`, `STREAM_URL`) vers `.env` + `.env.example`
- [ ] **Corriger les `catch` silencieux** — ajouter état d'erreur avec message utilisateur
- [ ] **Dédupliquer `fmtTime()`** — créer `src/utils.ts`
- [ ] **Typer les `any`** dans `types.ts` et `Icons.tsx`
- [ ] **Ajouter ESLint + Prettier** + config `tsconfig.json` strict

### Phase 3 — Tests (1 semaine)
- [ ] **Ajouter Vitest** pour les hooks et fonctions utilitaires
- [ ] **Corriger et étendre les tests Playwright** — play/pause, like, changement de langue
- [ ] **Viser 60% de couverture** sur les chemins critiques

### Phase 4 — Production (1-2 semaines)
- [ ] **GitHub Actions CI/CD** — build + lint + test sur PR
- [ ] **Ajouter un service worker** (Workbox via Vite plugin)
- [ ] **Héberger les assets** (logo, QR) sur le domaine propriétaire
- [ ] **Implémenter les boutons manquants** (volume, share, cast) ou les retirer de l'UI
- [ ] **Ajouter des Error Boundaries** React pour une dégradation élégante

---

*Audit généré par Ruflo Swarm — EthnAfrika RadioApp v0.0.0*
