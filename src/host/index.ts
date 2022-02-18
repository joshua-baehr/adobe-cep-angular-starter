// Choose the type definitions for the solution you are targeting
/// <reference types="types-for-adobe/Premiere/2018"/>

function helloWorld(): void {
  app.setSDKEventMessage('Hello World!', 'info');
}

function getProjectName(): string {
  return app.project.name;
}
