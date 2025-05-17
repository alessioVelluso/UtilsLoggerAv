export const CONSTRUCTOR = "constructor";

const isExcluded = (method: string, methodsToAvoid?:string[]) => methodsToAvoid?.includes(method) ?? false;
const isFunction = (item: unknown): item is Function => typeof item === "function";
const isPrototype = (value: unknown): value is object => typeof value === "object" && value !== null;
export const autobind = (instance: object, methodsToExclude?:string[]): void =>
{
    const proto = Object.getPrototypeOf(instance);
    if (!isPrototype(proto)) return;

    const protoProps = Object.getOwnPropertyNames(proto);
    for (const name of protoProps)
    {
        if (name === CONSTRUCTOR || isExcluded(name, methodsToExclude)) continue;

        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
        if (!descriptor) continue;
        if (descriptor.get || descriptor.set) continue; // skip accessors
        if (!isFunction(descriptor.value)) continue;

        // Bind only classic methods (defined in prototype)
        (instance as any)[name] = descriptor.value.bind(instance);
    }
}
