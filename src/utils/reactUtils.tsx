import parse, { HTMLReactParserOptions, domToReact } from 'html-react-parser'
import SmallText from '../components/common/styled/smallText'
import Anchor from '../components/common/anchor'

export const addEventListener = <
  T extends Element | HTMLElement | Document | Window,
  K extends (
    T extends HTMLElement ? keyof HTMLElementEventMap :
    T extends Element ? keyof ElementEventMap :
    T extends Document ? keyof DocumentEventMap :
    T extends Window ? keyof WindowEventMap : never
  )>(
    target: T,
    type: K,
    listener: (
      this: T,
      ev: (
        K extends keyof ElementEventMap ? ElementEventMap[K] :
        K extends keyof HTMLElementEventMap ? HTMLElementEventMap[K] :
        K extends keyof DocumentEventMap ? DocumentEventMap[K] :
        K extends keyof WindowEventMap ? WindowEventMap[K] : never
      )
    ) => any,
    options?: boolean | AddEventListenerOptions
  ) => {
  target.addEventListener(type, listener as () => any, options)
  return () => target.removeEventListener(type, listener as () => any, options)
}


export const parseHtml = (string: string) => {
  string = string.replace(/—/g, ' — ')
  const options: HTMLReactParserOptions = {
    trim: true,
    replace: (domNode) => {
      if (!('attribs' in domNode)) return
      const { href, target } = domNode.attribs
      return 'name' in domNode && domNode.name === 'a' &&
        href && target ?
        <Anchor
          to={href}
          target={target}>
          {domToReact(domNode.children, options)}
        </Anchor> : domNode.name === 'p' ?
          <SmallText>{domToReact(domNode.children, options)}</SmallText> : undefined
    }
  }
  return parse(string, options)
}