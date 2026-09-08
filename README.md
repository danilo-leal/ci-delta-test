# ci-delta-test

A throwaway repository for testing GitHub CI integrations end to end.

## How CI works

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on
every branch push. It waits 30 seconds so the in-progress state is visible,
then succeeds. No application code, dependencies, or secrets are required.

Watch runs in the repository's **Actions** tab. GitHub Actions reports check
runs, not legacy commit statuses.

## Trigger another run

On a branch that contains the workflow:

```sh
git commit --allow-empty -m "Trigger CI"
git push
```

The branch must already have an upstream. For a new branch, use
`git push -u origin YOUR_BRANCH` for its first push.

## Test a failure

Replace the last workflow step with:

```yaml
      - name: Fail intentionally
        run: exit 1
```

Commit and push the change to get a failed check. Restore the successful
step and push again to get a passing check.
