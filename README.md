# Ditto QA Playwright Assessment

Playwright + TypeScript automation for the Ditto insurance flow using Page Object Model (POM).

## Project Structure

```
ditto/
  .github/workflows/playwright.yml
  pages/
    DittoHomePage.ts
    DittoHealthFormPage.ts
    DittoPolicyPage.ts
  tests/
    base.ts
    ditto-insurance.spec.ts
  fixtures/
    testData.ts
  utils/
    dateHelper.ts
  .gitignore
  README.md
  package.json
  package-lock.json
  playwright.config.ts
```

## Setup

1. Install dependencies:

```bash
npm ci
```

2. Install Playwright browsers:

```bash
npx playwright install
```

## Run Tests

- Run all tests:

```bash
npm test
```

- Run in headed mode:

```bash
npm run test:headed
```

- Run only the Ditto suite:

```bash
npm run test:ditto
```

- View HTML report:

```bash
npm run report
```

## What the Suite Covers

- Select a health product on Ditto
- Validate key policy sections
- Fill family composition and details
- Trigger premium calculation and validate premium breakdown totals
