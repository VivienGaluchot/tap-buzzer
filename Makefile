FLAGS=--allow-env --allow-net

@PHONY: run
run:
	@deno run ${FLAGS} src/server/main.ts

@PHONY: dev
dev:
	@deno run --watch ${FLAGS} src/server/main.ts

@PHONY: check
check:
	@deno check src/client/index.ts
	@deno check src/server/main.ts