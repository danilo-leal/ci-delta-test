# ci-delta-test

Un repository temporaneo destinato a testare le integrazioni CI di GitHub
end-to-end.

## Come funziona la CI

Il workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) viene
eseguito a ogni push di un branch. Cinque job indipendenti creano cinque
controlli GitHub distinti:

| Controllo | Lavoro simulato |
| --- | --- |
| Lint | 10 secondi |
| Controllo dei tipi | 20 secondi |
| Test unitari | 30 secondi |
| Test di integrazione | 40 secondi |
| Compilazione | 50 secondi |

I job possono essere eseguiti in parallelo e terminare in momenti diversi, cosa
che rende facili da osservare i cambiamenti di stato. L'avvio del runner e
l'attesa in coda possono richiedere del tempo. Ogni job ha un timeout di due
minuti.

Si tratta di controlli fittizi: mostrano semplicemente dei messaggi e attendono
prima di avere esito positivo. Non analizzano il codice. Non sono necessarie
applicazioni, dipendenze o informazioni riservate.

Osserva le esecuzioni nella scheda **Actions** del repository. GitHub Actions
segnala le esecuzioni dei controlli, non i vecchi stati dei commit. Il workflow
usa solo l'evento push; l'apertura di una pull request non avvia quindi una
seconda esecuzione.

## Creare un branch, eseguire il push, attendere la CI e fare il merge

Parti dallo stato più recente di `main`, così il tuo branch conterrà il
workflow:

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/ci-example
git commit --allow-empty -m "Exercise the CI flow"
git push -u origin feature/ci-example
```

Un commit vuoto è sufficiente per eseguire un test; puoi anche effettuare il
commit di modifiche reali ai file. Apri una pull request dal tuo branch verso
`main`, controlla i cinque controlli e fai il merge della pull request quando
sono tutti completati con successo. Il push del merge su `main` avvia anch'esso
la CI.

Il merge resta manuale. Per impedire un merge prima del completamento positivo
della CI, configura una regola di protezione del branch o un ruleset GitHub per
`main` che richieda questi cinque controlli. Il solo workflow non impone questa
restrizione.

### Branch esistenti senza il workflow

Sul tuo branch di funzionalità, recupera la configurazione da `main`:

```sh
git fetch origin
git merge origin/main
git push
```

I controlli appartengono a uno specifico commit. L'aggiunta del workflow avvia
controlli sul nuovo commit inviato; non aggiunge controlli ai commit precedenti.

## Avviare un'altra esecuzione

Su un branch già inviato che contiene il workflow:

```sh
git commit --allow-empty -m "Trigger CI"
git push
```

## Testare un errore

In un job, sostituisci il passaggio di simulazione con:

```yaml
      - name: Fail intentionally
        run: exit 1
```

Esegui il commit e il push della modifica per ottenere un controllo non
superato. Ripristina quindi il passaggio che ha esito positivo ed esegui
nuovamente il push per ottenere un controllo superato. Gli altri job restano
indipendenti e possono continuare ad avere esito positivo.

## Un piccolo esperimento

Questo repository è volutamente semplice: apporta una piccola modifica, esegui
il commit e il push per osservare il ciclo completo di feedback:

1. Il tuo branch riceve un commit.
2. GitHub Actions avvia cinque controlli indipendenti.
3. I controlli terminano secondo i propri tempi.
4. La pull request mostra il risultato combinato.

È quindi un luogo pratico per fare esperimenti con branch, commit, pull request
e CI senza dover prima configurare un'applicazione.

### Verifica rapida

Se stai testando solo la connessione al repository, aggiungere una breve nota
come questa è sufficiente a produrre un diff reale senza modificare il
comportamento della CI.

> Nota di test: questa riga è stata aggiunta come modifica innocua al README.
