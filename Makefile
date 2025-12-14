SVR_FLAGS=--allow-env --allow-net
SVR_TS=src/server/main.ts

# Build client

.PHONY: build_client
build_client:
	@deno bundle src/client/index.ts --output src/client/build/index.js --platform browser
	@deno bundle src/client/host.ts --output src/client/build/host.js --platform browser


# Run server

.PHONY: run_server
run_server: build_client
	@deno run ${SVR_FLAGS} ${SVR_TS}


# Run dev server

.PHONY: dev
dev:
	@./env/run_parrallel.sh \
		"deno bundle src/client/index.ts --watch --output src/client/build/index.js --platform browser" \
		"deno bundle src/client/host.ts --watch --output src/client/build/host.js --platform browser" \
		"deno run --watch ${SVR_FLAGS} ${SVR_TS}"


# Check

.PHONY: check
check:
	@deno check src/client/index.ts
	@deno check src/client/host.ts
	@deno check ${SVR_TS}


# Build targets

.PHONY: build
build: build_client
	@deno compile ${SVR_FLAGS} \
		--target x86_64-unknown-linux-gnu \
		--output build/tap-buzzer-x86_64-unknown-linux-gnu.bin \
		${SVR_TS}
	@deno compile ${SVR_FLAGS} \
		--target aarch64-unknown-linux-gnu \
		--output build/tap-buzzer-aarch64-unknown-linux-gnu.bin \
		${SVR_TS}
	@deno compile ${SVR_FLAGS} \
		--target x86_64-pc-windows-msvc \
		--output build/tap-buzzer-x86_64-pc-windows-msvc-gnu.exe \
		${SVR_TS}