# ci-delta-test

Un dépôt éphémère destiné à tester les intégrations CI de GitHub de bout en
bout.

## Fonctionnement de la CI

Le workflow dans [`.github/workflows/ci.yml`](.github/workflows/ci.yml) se
déclenche à chaque envoi d'une branche. Cinq tâches indépendantes créent cinq
vérifications GitHub distinctes :

| Vérification | Travail simulé |
| --- | --- |
| Lint | 10 secondes |
| Vérification des types | 20 secondes |
| Tests unitaires | 30 secondes |
| Tests d'intégration | 40 secondes |
| Compilation | 50 secondes |

Les tâches peuvent s'exécuter en parallèle et se terminer à des moments
différents, ce qui rend les changements de statut faciles à observer. Le
démarrage du runner et la mise en file d'attente peuvent prendre du temps.
Chaque tâche a un délai d'expiration de deux minutes.

Il s'agit de vérifications fictives : elles affichent simplement des messages
et attendent avant de réussir. Elles n'inspectent pas le code. Aucune
application, dépendance ou information secrète n'est requise.

Observez les exécutions dans l'onglet **Actions** du dépôt. GitHub Actions
signale des exécutions de vérification, et non les anciens statuts de commit.
Le workflow utilise uniquement l'événement push ; l'ouverture d'une pull
request ne lance donc pas une exécution en double.

## Créer une branche, envoyer, attendre la CI et fusionner

Partez du dernier état de `main` afin que votre branche contienne le workflow :

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/ci-example
git commit --allow-empty -m "Exercise the CI flow"
git push -u origin feature/ci-example
```

Un commit vide suffit pour effectuer un test ; vous pouvez également valider
de véritables modifications de fichiers. Ouvrez une pull request de votre
branche vers `main`, surveillez les cinq vérifications, puis fusionnez la pull
request une fois qu'elles ont réussi. L'envoi de la fusion vers `main` lance
également la CI.

La fusion reste manuelle. Pour empêcher une fusion avant la réussite de la CI,
configurez une règle de protection de branche ou un ruleset GitHub pour `main`
qui exige ces cinq vérifications. Le workflow seul n'impose pas cette
restriction.

### Branches existantes sans le workflow

Sur votre branche de fonctionnalité, récupérez la configuration depuis `main` :

```sh
git fetch origin
git merge origin/main
git push
```

Les vérifications appartiennent à un commit précis. L'ajout du workflow
déclenche des vérifications sur le nouveau commit envoyé ; il n'ajoute pas de
vérifications aux anciens commits.

## Déclencher une autre exécution

Sur une branche envoyée qui contient le workflow :

```sh
git commit --allow-empty -m "Trigger CI"
git push
```

## Tester un échec

Dans une tâche, remplacez l'étape de simulation par :

```yaml
      - name: Fail intentionally
        run: exit 1
```

Validez et envoyez la modification pour obtenir une vérification en échec.
Restaurez ensuite l'étape qui réussit et envoyez-la à nouveau pour obtenir une
vérification réussie. Les autres tâches restent indépendantes et peuvent
continuer à réussir.

## Une petite expérience

Ce dépôt est volontairement simple : effectuez une petite modification,
validez-la et envoyez-la pour observer la boucle complète de retour
d'information :

1. Votre branche reçoit un commit.
2. GitHub Actions démarre cinq vérifications indépendantes.
3. Les vérifications se terminent à leur propre rythme.
4. La pull request affiche le résultat combiné.

Cela en fait un endroit pratique pour expérimenter les branches, les commits,
les pull requests et la CI sans avoir à configurer d'abord une application.

### Vérification rapide

Si vous testez uniquement la connexion au dépôt, l'ajout d'une courte note
comme celle-ci suffit à produire un véritable diff sans modifier le
comportement de la CI.

> Note de test : cette ligne a été ajoutée comme modification inoffensive du README.
