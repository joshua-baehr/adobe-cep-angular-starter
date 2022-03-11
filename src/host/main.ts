// Choose the type definitions for the solution you are targeting
/// <reference types="types-for-adobe/Premiere/2018"/>

/**
 * Public static fields and of the Main class methods are accessible in the panel.
 */
class Main {
  public static helloWorld(): void {
    alert('Hello!');
  }

  public static getProjectName(): string {
    return app.project.name;
  }
}
