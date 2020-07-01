/**
 * Copyright (c) 2020 August
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const SYMBOL = Symbol('$commands');

/** Represents what the "command" is like */
export interface EventDefinition {
  run(...args: any[]): Promise<void>;
  event: string;
}

/**
 * Gets all of the definitions found in the target's constructor
 * @param target The target class
 */
export function findListeners(target: any): EventDefinition[] {
  if (target.constructor == null) return [];

  const definitions = target.constructor[SYMBOL];
  if (!Array.isArray(definitions)) return [];

  return definitions;
}

/**
 * Adds an event listener
 * @param event The event to listen to
 */
export function Event(event: string): MethodDecorator {
  return (target: any, prop, descriptor: TypedPropertyDescriptor<any>) => {
    if (target.prototype !== undefined) throw new SyntaxError(`Method "${target.name}#${String(prop)}" is not a valid function to be used as a command.`);

    if (!target.constructor[SYMBOL]) target.constructor[SYMBOL] = [];

    (target.constructor[SYMBOL] as EventDefinition[]).push({
      event,
      run: descriptor.value
    });
  };
}