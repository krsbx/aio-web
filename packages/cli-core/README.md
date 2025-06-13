# @Ignisia/CLI-Core

A lightweight command line interface for Bun with a focus on simplicity and ease of use.

## Requirements

- [Bun](https://bun.sh/)

## Installation

```bash
bun add @ignisia/cli
```

## Usage

```ts
import { CommandLineAction, CommandLineParser } from '@ignisia/cli-core';

// Create a command line action
export class BuildAction extends CommandLineAction<{ keyPath: string }> {
  constructor() {
    super({
      name: 'build',
      summary: 'Build the project',
      description: 'Build the project...',
    });

    // Add a string parameter for the actions
    this.addStringParameter('keyPath', {
      required: true, // Mark the parameter to be required
      alias: 'k', // Set the alias for the parameter
      description: 'The path to the key file', // Set the description for the parameter
      default: 'key.pem', // Set the default value for the parameter
    });
  }

  public override async onExecute() {
    // Do something with the parameters
    const { keyPath } = this.values
  }
}

// Create a command line parser
export class ProjectCli extends CommandLineParser {
  constructor() {
    super('Project CLI', 'Do something to your projects');

    // Add the build action
    this.addAction(new BuildAction());
  }
}

const parser = new ProjectCli();

// Run the command line parser
await parser.execute();
```

> Some of the functions is not covered in the usage example above
