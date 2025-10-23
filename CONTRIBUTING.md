# Contributing to MCP Website Helper

Thank you for your interest in contributing to MCP Website Helper!

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Development Workflow

### Making Changes

1. Make your changes in the `src/` directory
2. Build the project: `npm run build`
3. Test your changes: `npm test`
4. Run the server in development mode: `npm run dev`

### Code Style

- We use TypeScript with strict mode enabled
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic

### Testing

Before submitting a pull request:
1. Ensure the build succeeds: `npm run build`
2. Run tests: `npm test`
3. Test the server manually with an MCP client

### Adding New Tools

To add a new tool to the server:

1. Add a Zod schema for the tool's input in `src/index.ts`
2. Add the tool definition in the `ListToolsRequestSchema` handler
3. Add a handler method for the tool
4. Add the tool to the switch statement in `CallToolRequestSchema` handler
5. Update the README with documentation for the new tool
6. Add tests if applicable

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Ensure all tests pass
3. Update the version number if appropriate
4. The PR will be reviewed and merged if approved

## Questions?

Feel free to open an issue for any questions or concerns.
