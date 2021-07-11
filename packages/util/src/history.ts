import { createBrowserHistory } from "history";

export class History {
  private history = createBrowserHistory();

  public getCurrentURI(): string {
    return this.history.location.pathname;
  }

  public listen(listener: (uri: string) => void): void {
    this.history.listen(({ location }) => {
      listener(location.pathname);
    });
  }
}
