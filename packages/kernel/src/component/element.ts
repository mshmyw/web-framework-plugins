import { PROPERTY_METADATA_PREFIX } from "./constant";

export abstract class ComponentElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  public abstract render():void;
}

export interface ComponentDeclaration {
  name: string;
}

export function component(declaration: ComponentDeclaration): ClassDecorator {
  return function decorateClass(target: any): void {
    const metadataKeys = Reflect.getMetadataKeys(target.prototype);
    metadataKeys.forEach((metadataKey) => {
      if (metadataKey.startsWith(PROPERTY_METADATA_PREFIX)) {
        const propertyDeclaration = Reflect.getMetadata(
          metadataKey,
          target.prototype
        );
      }
    });

    customElements.define(declaration.name, target);
  };
}
