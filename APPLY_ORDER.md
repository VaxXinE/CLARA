# Apply Order

## Step 1 — Create Branch

```bash
git checkout -b docs/align-master-documentation-index
```

## Step 2 — Apply Patch

Copy all files from:

```text
PATCH/root/
```

to repository root.

Example:

```bash
cp -R CLARA-OFFICIAL-REPO-AUDIT-PATCH/PATCH/root/. .
```

## Step 3 — Review Diff

```bash
git diff
git status
```

## Step 4 — Add Master Documentation Index

Unzip:

```text
CLARA-MASTER-DOCUMENTATION-INDEX.zip
```

into:

```text
docs/CLARA-MASTER-DOCUMENTATION-INDEX/
```

## Step 5 — Add Book IX

Unzip all Book IX parts into:

```text
docs/BOOK-09-Product-Operations-Growth-and-Continuous-Improvement/
```

Expected:

```text
PART-01-Product-Operations-Foundation/
PART-02-Customer-Onboarding-and-Success/
PART-03-Support-Operations-and-Knowledge-Loop/
PART-04-Growth-Experiments-and-Activation/
PART-05-Billing-Packaging-and-Monetization-Operations/
PART-06-Analytics-and-Product-Insights/
PART-07-Feedback-Prioritization-and-Roadmap-Operations/
PART-08-Continuous-Security-and-Compliance-Operations/
PART-09-Continuous-Reliability-and-Performance-Improvement/
PART-10-AI-Quality-and-Automation-Improvement/
PART-11-Business-Review-and-Operating-Cadence/
PART-12-Product-Operations-Handover-and-Master-Index/
BOOK-09-Master-Index/
```

## Step 6 — Add Book VI–VIII

Add previously generated Book VI–VIII docs into:

```text
docs/BOOK-06-Security-Governance-and-Compliance/
docs/BOOK-07-Operations-Observability-and-Reliability/
docs/BOOK-08-Implementation-Delivery-and-Production-Launch/
```

## Step 7 — Run Checks

```bash
bash -n scripts/*.sh 2>/dev/null || true
find . -name ".DS_Store" -print
git status
```

If GitHub Actions is enabled, `docs-check.yml` will run on PR.

## Step 8 — Commit

```bash
git add .
git commit -m "docs: align Clara repository with master documentation index"
git push origin docs/align-master-documentation-index
```

## Step 9 — Open PR

Use the new PR template.
