#!/bin/bash

deno compile --target aarch64-unknown-linux-gnu --output out/tap-buzzer-aarch64-unknown-linux-gnu.bin --allow-env --allow-net --unstable-raw-imports src/main.ts
deno compile --target x86_64-pc-windows-msvc --output out/tap-buzzer-x86_64-pc-windows-msvc.exe --allow-env --allow-net --unstable-raw-imports src/main.ts