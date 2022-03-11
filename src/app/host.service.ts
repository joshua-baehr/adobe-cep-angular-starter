import { Injectable } from '@angular/core';
import { CSInterface, SystemPath } from 'csinterface-ts';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HostService {
  private readonly cs: CSInterface;
  private appId: string = '';

  constructor(private http: HttpClient) {
    this.cs = new CSInterface();
    this.http.get('appId', { responseType: 'text' }).subscribe((appId) => {
      this.appId = appId;

      // Load JXS files
      this.loadJSX('/../host/index.jsxbin');
    });
  }

  public async helloWorld(): Promise<void> {
    return this.evalHost('helloWorld()');
  }

  public async getProjectName(): Promise<string> {
    return this.evalHost<string>('getProjectName()');
  }

  /**
   * Evaluates a public function or variable of the host by using the build specific id
   */
  private async evalHost<T>(hostCall: string): Promise<T> {
    return this.evalScript<T>(`${this.appId}.${hostCall}`);
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
