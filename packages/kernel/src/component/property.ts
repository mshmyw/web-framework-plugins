import "reflect-metadata";

import { ComponentElement } from "./element";
import { PROPERTY_METADATA_PREFIX } from "./constant";

export interface PropertyDeclaration {
  name: string;
}

export function property(declaration: PropertyDeclaration): PropertyDecorator {
  return function decorateProperty(
    target: Object,
    propertyKey: string | symbol
  ): void {
    Reflect.defineMetadata(
      `${PROPERTY_METADATA_PREFIX}:${propertyKey as string}`,
      declaration,
      target
    );

    Reflect.defineProperty(target, declaration.name, {
      get(): any {
        return (this as any)[propertyKey];
      },
      set(value: any) {
        (this as any)[propertyKey] = value;
        (this as any).render();
      },
      enumerable: true,
    });
  };
}
