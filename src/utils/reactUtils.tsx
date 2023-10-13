import parse, { HTMLReactParserOptions, domToReact } from 'html-react-parser'
import SmallText from '../components/common/styled/smallText'
import Anchor from '../components/common/anchor'


export const addEventListener = <T extends (Element | Document)>(
  target: T,
  eventName: T extends Element ? keyof ElementEventMap : keyof DocumentEventMap,
  callback: (this: T, event: T extends Element ? ElementEventMap[keyof ElementEventMap] : DocumentEventMap[keyof DocumentEventMap]) => any,
  options?: boolean | AddEventListenerOptions
) => {
  target.addEventListener(eventName, callback, options)
  return () => target.removeEventListener(eventName, callback, options)
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