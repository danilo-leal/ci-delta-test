# ci-delta-test

A temporary repository for testing GitHub CI integrations from end to end.

## How CI works

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs
whenever a branch is pushed. Five independent jobs create five separate checks
on GitHub:

| Check | Simulated work |
| --- | --- |
| Lint | 10 segundos |
| Verificação de tipos | 20 segundos |
| Testes unitários | 30 segundos |
| Testes de integração | 40 segundos |
| Compilação | 50 segundos |

Jobs can run in parallel and finish at different times, making it easy to
observe state changes. Runner startup and queueing can take a little while.
Each job has a two-minute timeout.

These are dummy checks: they simply print messages and wait before finishing
successfully. They do not analyse the code. No apps, dependencies or secrets
are required.

Watch runs in the repository's **Actions** tab. GitHub Actions reports check
runs, not the old status of commits. The workflow uses only the push event, so
opening a pull request does not start a second run.

## Create a branch, push it, wait for CI and merge

Start from the latest state of `main` so your branch includes the workflow:

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/ci-example
git commit --allow-empty -m "Exercise the CI flow"
git push -u origin feature/ci-example
```

A blank commit is enough to run a test; you can also commit actual file
changes. Open a pull request from your branch to `main`, check the five checks
and merge the pull request once they have all completed successfully. Pushing
the merge to `main` also starts CI.

Merging is still manual. To prevent a merge before CI completes successfully,
configure a GitHub branch protection rule or ruleset for `main` that requires
these five checks. The workflow alone does not enforce this restriction.

### Existing branches without the workflow

On your feature branch, bring in the configuration from `main`:

```sh
git fetch origin
git merge origin/main
git push
```

Checks belong to a specific commit. Adding the workflow starts checks on the
newly pushed commit; it does not add checks to earlier commits.

## Start another run

On a branch that has already been pushed and contains the workflow:

```sh
git commit --allow-empty -m "Trigger CI"
git push
```

## Test a failure

In one job, replace the simulated step with:

```yaml
      - name: Fail intentionally
        run: exit 1
```

Commit and push the change to get a failed check. Then restore the successful
step and push again to get a passing check. The other jobs remain independent
and can still complete successfully.

## A small experiment

This repository is deliberately simple: make a small change, commit it and
push to see the full feedback cycle:

1. Your branch receives a commit.
2. GitHub Actions starts five independent checks.
3. The checks finish according to their own timings.
4. The pull request shows the combined result.

This makes it a handy place to experiment with branches, commits, pull
requests and CI without having to set up an app first.

### Quick check

If you're only testing the repository connection, adding a brief note like
this is enough to produce a real diff without changing CI behaviour.

> Test note: this line was added as a harmless change to the README.

> Another quick test note.

> One more small change to test the editing workflow.

> Further test: the README is still easy to edit.
