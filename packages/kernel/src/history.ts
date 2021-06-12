import { createBrowserHistory } from "history";

export class History {
  private history = createBrowserHistory();

  public getCurrentURL(): string {
    return this.history.location.pathname;
  }
}

export const history: History = new History();
