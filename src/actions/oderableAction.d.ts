// augment your global namespace
// here, we're augmenting 'WindowEventMap' from 'lib.dom.d.ts' 👌
declare namespace svelte.JSX {
  interface DOMAttributes<T> {
    onorderstart?: any;
    onorderend?: any;
  }
}
