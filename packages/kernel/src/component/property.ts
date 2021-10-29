import "reflect-metadata";

import { ComponentElement } from "./element";
import { PROPERTY_METADATA_PREFIX } from "./constant";

export interface PropertyDeclaration {
  name: string;
}

export function property(declaration: PropertyDeclaration): PropertyDecorator {
  return function decorateProperty(
    target: ComponentElement,
    propertyKey: string
  ): void {
    Reflect.defineMetadata(
      `${PROPERTY_METADATA_PREFIX}:${propertyKey}`,
      declaration,
      target
    );

    Reflect.defineProperty(target, declaration.name, {
      get(): any {
        return this[propertyKey];
      },
      set(value: any) {
        this[propertyKey] = value;
        this.render();
      },
      enumerable: true,
    });
  };
}
