# ci-delta-test

A throwaway repository for testing GitHub CI integrations end to end.

> This line was added as a quick edit test.

## How CI works

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on
every branch push. Five independent jobs create five separate GitHub checks:

| Check | Simulated work |
| --- | --- |
| Lint | 10 seconds |
| Typecheck | 20 seconds |
| Unit tests | 30 seconds |
| Integration tests | 40 seconds |
| Build | 50 seconds |

Jobs can run in parallel and finish at different times, making status changes
easy to observe. Runner startup and queueing can add time. Each job has a
two-minute timeout.

These are pretend checks: they only print messages and wait, then succeed.
They do not inspect the code. No application, dependencies, or secrets are
required.

Watch runs in the repository's **Actions** tab. GitHub Actions reports check
runs, not legacy commit statuses. The workflow uses only the push event, so
opening a pull request does not start a duplicate run.

## Branch, push, wait for CI, and merge

Start from the latest `main` so your branch includes the workflow:

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/ci-example
git commit --allow-empty -m "Exercise the CI flow"
git push -u origin feature/ci-example
```

An empty commit is enough for a test; you can also commit actual file changes.
Open a pull request from your branch into `main`, watch the five checks,
then merge the pull request after they pass. The merge push to `main` also
starts CI.

Merging remains manual. To prevent merging before CI passes, configure a
GitHub branch protection rule or ruleset for `main` requiring these five
checks. The workflow alone does not enforce that restriction.

### Existing branches without the workflow

On your feature branch, bring in the setup from `main`:

```sh
git fetch origin
git merge origin/main
git push
```

Checks belong to a specific commit. Adding the workflow triggers checks on
the new pushed commit; it does not add checks to older commits.

## Trigger another run

On a pushed branch that contains the workflow:

```sh
git commit --allow-empty -m "Trigger CI"
git push
```

## Test a failure

In one job, replace its simulation step with:

```yaml
      - name: Fail intentionally
        run: exit 1
```

Commit and push the change to get a failed check. Restore the successful
step and push again to get a passing check. The other jobs remain independent
and can still pass.
