# Backend i18n Strategy (API)

## Principles

- All user-facing API messages (errors, success, info) must be translatable.
- Centralized error message retrieval via `getErrorMessage(key, lang, params)`.
- Language is detected from cookie (`NEXT_LOCALE`) or `accept-language` header.
- All error keys are exhaustively typed (`ApiErrorKey`).
- Fallback to a generic error if a key is missing.

## How to add a new error message

1. Add the key in all translation files under `api.errors`.
2. Add the key to `ApiErrorKey` in `src/types/i18n-api-error-keys.ts`.
3. Use `getErrorMessage('yourKey', lang)` in your API route.

## How to add a new language

1. Add a new file in `src/locales/<lang>/index.ts`.
2. Register it in `src/locales/server.ts` and `client.ts`.
3. Ensure all `api.errors` keys are present.

## How to test

- Run `jest src/lib/i18n-api.test.ts` to check translation and fallback logic.
- Add integration tests for API endpoints with different language headers/cookies.

## Parametrized messages

- Use `{param}` in your translation string and pass `{ param: value }` to `getErrorMessage`.

## Fallbacks

- If the requested language is not supported, fallback to `fr` (configurable in code).
- If the key is missing, fallback to `api.errors.unknown`.

## Lint/TS

- All error keys are type-checked.
- No `any` is used for translation lookups.

---

**Contact:** @Pomme978 for i18n conventions or issues.
