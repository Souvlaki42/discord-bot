FROM oven/bun:latest
ADD src src 
ADD package.json package.json 
ADD bun.lockb bun.lockb 
ADD .env.local .env.local
ADD tsconfig.json tsconfig.json
RUN bun install
CMD bun run src/index.ts