import parse, { domToReact } from 'html-react-parser'
import SmallText from '../components/common/styled/smallText'
import Anchor from '../components/common/anchor'

export const addEventListener = (target, eventName, callback) => {
  target.addEventListener(eventName, callback)
  return () => target.removeEventListener(eventName, callback)
}

export const parseHtml = string => {
  string = string.replace(/—/g, ' — ')
  const options = {
    trim: true,
    replace: ({ name, attribs, children }) => {
      return name === 'a' ?
        <Anchor
          to={attribs.href}
          target={attribs.target}>
          {domToReact(children, options)}
        </Anchor> : name === 'p' ?
          <SmallText>{domToReact(children, options)}</SmallText> : undefined
    }
  }
  return parse(string, options)
}
