import { Link } from 'react-router-dom'
import parse, { domToReact } from 'html-react-parser'
import SmallText from '../components/common/styled/smallText'

export const addEventListener = (target, eventName, callback) => {
  target.addEventListener(eventName, callback)
  return () => target.removeEventListener(eventName, callback)
}

const linkIsExternal = href => href && href.match(/^(https|www)/)
export const parseHtml = string => {
  string = string.replace(/—/g, ' — ')
  const options = {
    trim: true,
    replace: ({ name, attribs, children }) => {
      return name === 'a' ?
        <Link
          to={attribs.href}
          target={attribs.target || (linkIsExternal(attribs.href) ? '_blank' : '_self')}
          rel='noreferrer'>
          {domToReact(children, options)}
        </Link> : name === 'p' ?
          <SmallText>{domToReact(children, options)}</SmallText> : undefined
    }
  }
  return parse(string, options)
}
