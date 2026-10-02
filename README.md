# ci-delta-test

A temporary repository for testing GitHub CI integrations end to end.

## How CI works

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs
whenever a branch is pushed. Five independent jobs create five separate checks
on GitHub:

| Check | Simulated job |
| --- | --- |
| Lint | 10 seconds |
| Type checking | 20 seconds |
| Unit tests | 30 seconds |
| Integration tests | 40 seconds |
| Build | 50 seconds |

Jobs can run in parallel and finish at different times, making it easy to watch
their status change. Starting runners and waiting in the queue can take some
time. Each job has a two-minute limit.

These are test checks: they only print messages and wait before succeeding. They
do not analyse code. No apps, dependencies or secrets are required.

Track runs in the repository's **Actions** tab. GitHub Actions reports check
runs, not the previous status of commits. The workflow uses only the `push`
event, so opening a pull request does not start another run.

## Create a branch, push it, wait for CI and merge

Start from the latest version of `main` so your branch includes the workflow:

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/ci-example
git commit --allow-empty -m "Exercise the CI flow"
git push -u origin feature/ci-example
```

A commit with no changes is enough to run a test; you can also include actual
file changes. Open a pull request from your branch to `main`, check the five
checks, and merge when they have all succeeded. Pushing the merge to `main` also
starts CI.

Merging is still manual. To prevent merging before CI succeeds, configure a
branch protection rule or GitHub ruleset for `main` that requires these five
checks. The workflow does not enforce this restriction on its own.

### Existing branches without the workflow

On your feature branch, bring in the configuration from `main`:

```sh
git fetch origin
git merge origin/main
git push
```

Checks belong to a specific commit. When you add the workflow, they run on the
commit you just pushed; checks are not added retroactively to earlier commits.

## Start another run

On a branch that you've already pushed and that contains the workflow:

```sh
git commit --allow-empty -m "Trigger CI"
git push
```

## Test a failure

In one of the jobs, replace the simulated step with:

```yaml
      - name: Fail intentionally
        run: exit 1
```

Commit and push the change to get a failing check. Then restore the successful
step and push again to get a passing check. The other jobs remain independent
and can still succeed.

## A simple experiment

This repository is intentionally simple: make a small change, create a commit
and push it to see the full feedback loop:

1. Your branch gets a commit.
2. GitHub Actions starts five independent checks.
3. The checks finish at their own pace.
4. The pull request shows the combined result.

This gives you a practical place to experiment with branches, commits, pull
requests and CI without having to set up an app first.

### Quick test

If you're just testing the connection to the repository, adding a brief note
like this is enough to create a real diff without changing CI behaviour.

> Test note: this line was added to the README as a harmless change.

> Another quick test note.

> One more small change to test the editing workflow.

> Another test: the README is still easy to edit.
