# @parlay/common-config

Shared configuration utilities:

* **envSchema** – zod schema validating required environment variables.
* **getConfig()** – runtime helper that parses & returns typed env.
* **logger** – pre-configured `pino` instance.
* **trace()** – lightweight LangSmith-style tracing hook (no external deps).

```ts
import { getConfig, logger, trace } from '@config/index';
```

No external side-effects; safe to import in any Node or browser context.