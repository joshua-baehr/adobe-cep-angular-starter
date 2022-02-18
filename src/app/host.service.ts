import { Injectable } from '@angular/core';
import { CSInterface, SystemPath } from 'csinterface-ts';

@Injectable({
  providedIn: 'root',
})
export class HostService {
  private readonly cs: CSInterface;

  constructor() {
    this.cs = new CSInterface();
    // Load JXS files
    this.loadJSX('/../host/polyfills.jsx').then((result) => {
      this.loadJSX('/../host/index.jsxbin');
    });
  }

  public async helloWorld(): Promise<void> {
    return this.evalScript('helloWorld()');
  }

  public async getProjectName(): Promise<string> {
    return this.evalScript<string>('getProjectName()');
  }

  /**
   * Evaluates a JavaScript script using the CSInterface
   *
   * @param script    The JavaScript script.
   */
  private async evalScript<T>(script: string): Promise<T> {
    return new Promise((resolve) => {
      this.cs.evalScript(script, (response) => {
        if (response == undefined) {
          resolve(response);
          return;
        }
        try {
          resolve(JSON.parse(response) as T);
        } catch (e) {
          resolve(response as T);
        }
      });
    });
  }

  /**
   * Evaluates a JSX or JSXBin script located in the /host folder
   *
   * @param fileName    The filename of the JavaScript script.
   */
  private async loadJSX(fileName: string): Promise<void> {
    const extensionRoot =
      this.cs?.getSystemPath(SystemPath.EXTENSION) + '/jsx/';
    return new Promise((resolve) => {
      this.cs.evalScript(
        '$.evalFile("' + extensionRoot + fileName + '")',
        (result) => resolve(result)
      );
    });
  }
}
