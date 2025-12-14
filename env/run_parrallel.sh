#!/bin/bash


PIDS=()

echo "Start $(($#)) services..."

for CMD in "$@"; do
    eval "$CMD" &
    PIDS+=($!)
done

cleanup() {
    echo ""
    echo "--- Stopping processes ---"
    if [ ${#PIDS[@]} -gt 0 ]; then
        kill "${PIDS[@]}" 2>/dev/null 
        wait "${PIDS[@]}" 2>/dev/null
    fi
    
}

trap cleanup SIGINT
wait
