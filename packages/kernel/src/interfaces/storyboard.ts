export interface StoryboardComponentConfig {
  name: string;
  properties?: { [name: string]: any };
}

export interface StoryboardRouteConfig {
  uri: string;
  components?: StoryboardComponentConfig[];
}

export interface StoryboardConfig {
  routes?: StoryboardRouteConfig[];
}
