---
name: land
description: >-
  Land a user-requested change in the ci-delta-test repository through its
  protected GitHub main branch. Invoke this skill only when the user has
  explicitly requested landing or merging changes, not for review, preparation,
  passing checks, or skill installation.
metadata:
  delta-thread: land
---

# Land changes

Use this skill only for an explicit request to land or merge the current
change. The request that invoked this skill supplies merge intent; do not ask
the user to reconfirm it. This repository uses a protected `main` branch and
lands changes through a pull request.

## Scope and review-thread safety

1. Inspect the inherited parent context and available review-thread events
   before changing Git state. Look for evidence that a review subthread
   proposed file changes that have not been Delta-merged into the parent.
2. Commentary-only reviews, proposals already merged into the parent, and
   review threads with no evidence of proposed changes do not block landing.
3. If unmerged proposed changes are indicated, pause and ask whether to
   include them or land without them. The original landing request does not
   answer this separate scope question.
4. If the user wants them included, identify the exact review thread and state
   that the parent thread must perform Delta's `merge_subthread` operation.
   Do not use Git merge, cherry-pick, or manual copying as a substitute. Stop
   and require Land to be started again from the updated parent after that
   merge.

## Preflight

Run read-only checks before preparing the change:

```sh
git --no-optional-locks status --short --branch
git remote -v
gh auth status
gh repo view danilo-leal/ci-delta-test --json nameWithOwner,defaultBranchRef,mergeCommitAllowed,rebaseMergeAllowed,squashMergeAllowed,viewerDefaultMergeMethod,viewerPermission
gh api repos/danilo-leal/ci-delta-test/branches/main/protection
```

These commands and the protected-branch workflow are verified by
`.github/workflows/ci.yml` and the repository's `README.md` sections
“Branch, push, wait for CI, and merge” and “Trigger another run”.

Confirm that:

- The repository is `danilo-leal/ci-delta-test`, the destination is `main`, and
  the authenticated GitHub account can push and merge.
- `main` still requires the `CI Pass` check, does not allow force pushes, and
  the available merge method remains compatible with the repository default.
- The working tree contains the requested change. Preserve unrelated
  uncommitted work; if the requested scope cannot be separated safely, stop and
  report the blocker instead of committing unrelated files.
- No repository policy requires additional reviews, signatures, changelog
  entries, contributor agreements, or submission metadata. If settings or
  repository files show a new applicable requirement, satisfy it or stop with
  the specific blocker.

Do not overwrite, reset, stash destructively, or force-push unrelated work.
Use a topic branch based on the current `main` state. If the current branch is
`main`, create a descriptive branch before committing. Stage only the files
belonging to this request and create a focused commit with a clear message.

## Prepare and publish

Update the topic branch from the destination before publishing. If a conflict
occurs, automatically resolve it only when the intended result is clear and
the resolution preserves unrelated work. This is the user's established
conflict preference. Pause and report the conflicting files when intent is
ambiguous, the resolution could lose work, or the conflict cannot be resolved
without guessing.

Push the topic branch without force:

```sh
git push -u origin <topic-branch>
```

Create or identify a pull request targeting `main`:

```sh
gh pr create --base main --head <topic-branch> --title "<focused title>" --body "<concise summary and verification>"
```

Use an existing pull request for the same topic branch when one already
contains the requested commit; do not create a duplicate. Do not push directly
to protected `main`.

## Verify checks and land

Before merging, verify the pull request's current head SHA and required checks:

```sh
gh pr view <number> --json number,headRefName,baseRefName,headRefOid,state,mergeStateStatus,statusCheckRollup
gh api repos/danilo-leal/ci-delta-test/branches/main/protection
```

Require `CI Pass` to be completed successfully for the exact head commit being
landed. The workflow defines `CI Pass` as requiring successful `Lint`,
`Typecheck`, `Unit tests`, `Integration tests`, and `Build` jobs
(`.github/workflows/ci.yml`, jobs `ci_pass` and its `needs` list). Pending,
failing, missing, stale, or unverifiable checks are blockers; do not assume
that a run for an earlier commit applies. Wait for checks when they are
running, then re-read the pull request and confirm the head SHA has not
changed. If it changed, verify the new commit again.

When all requirements pass, merge with the repository's configured default
method, normally:

```sh
gh pr merge <number> --merge
```

If the current repository settings no longer allow that method, stop rather
than silently selecting another strategy. Do not use `--admin`, force pushes,
or bypass branch protection.

## Verify the outcome

Landing is successful only after verifying both the pull request and
destination branch:

```sh
gh pr view <number> --json state,mergedAt,mergeCommit,headRefOid,baseRefName
git fetch origin main
git merge-base --is-ancestor <landed-commit> origin/main
git status --short --branch
```

Confirm the PR state is `MERGED`, its merge commit or landed head is present in
`origin/main`, and unrelated working-tree changes remain intact. A prepared
commit, pushed topic branch, open PR, or passing local/remote checks is not a
successful landing.

If a command fails, a check fails, permissions are insufficient, settings
change, or the final destination cannot be verified, report that the change
has not landed and explain the blocker. Continue safe recovery when permitted
by the automatic-conflict preference, but never bypass a failed check or
uncertain scope. After any recovery, verify the final outcome again.

For every terminal outcome, call `report_subthread_status`:

- Use `status: "success"` only after verifying that the requested change
  reached `origin/main` through the pull-request workflow.
- Use `status: "failure"` for a failed attempt or genuine blocker. Explain what
  stopped landing and the useful next step.
- `title` must be concise sentence-case Markdown.
- `description` must be short, easy-to-read Markdown of a few sentences that
  states the verified result or blocker and relevant evidence.
