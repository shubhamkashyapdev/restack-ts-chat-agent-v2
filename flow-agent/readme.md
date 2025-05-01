# Flow Agent

A standalone agent service for workflow orchestration.

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create a `.env` file in the root directory with your configuration:
```
# Example environment variables
OPENAI_API_KEY=your_openai_api_key
# Add other required environment variables
```

## Running the Application

### Development mode
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Production mode
```bash
npm run build
npm start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
```

## Available Scripts

- `start`: Run the service
- `start.watch`: Run the service with nodemon for automatic restarts
- `dev`: Open the application in a browser and run with file watching
- `lint`: Lint and fix code issues
- `build`: Build the TypeScript project
- `workflow`: Run the workflow scheduler
- `event`: Run the event agent
