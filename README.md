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

The jobs can run in parallel and finish at different times, making it easy to
observe status changes. Starting the runners and waiting in the queue can take
a little while. Each job has a two-minute limit.

These are test checks: they simply print messages and wait before completing
successfully. They don't analyse the code. No applications, dependencies or
secrets are required.

Follow runs in the repository's **Actions** tab. GitHub Actions reports check
runs, not the earlier status of commits. The workflow uses only the `push`
event, so opening a pull request doesn't start another run.

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

A commit with no changes is enough to run a test; you can also include real
file changes. Open a pull request from your branch to `main`, check the five
checks and merge it once they've all completed successfully. Pushing the merge
to `main` also starts CI.

Merging is still manual. To prevent merging before CI completes successfully,
set up a branch protection rule or GitHub ruleset for `main` that requires
these five checks. The workflow alone doesn't enforce this restriction.

### Existing branches without the workflow

On your feature branch, bring in the configuration from `main`:

```sh
git fetch origin
git merge origin/main
git push
```

Checks belong to a specific commit. When you add the workflow, the checks run
on the commit you've just pushed; checks aren't added to earlier commits.

## Start another run

On a branch you've already pushed that contains the workflow:

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

Commit and push the change to get a failed check. Then restore the successful
step and push again to get a passing check. The other jobs remain independent
and can still complete successfully.

## A simple experiment

This repository is intentionally simple: make a small change, create a commit
and push it to see the full feedback cycle:

1. Your branch gets a commit.
2. GitHub Actions starts five independent checks.
3. The checks finish on their own schedules.
4. The pull request shows the combined result.

This gives you a handy place to experiment with branches, commits, pull
requests and CI without having to set up an application first.

### Quick test

If you're only testing the connection to the repository, adding a brief note
like this is enough to create a real diff without changing CI behaviour.

> Test note: this line was added as a harmless change to the README.

> Another quick test note.

> One more small change to test the editing workflow.

> Another test: the README is still easy to edit.
