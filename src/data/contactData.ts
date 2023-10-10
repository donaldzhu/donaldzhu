import { ReactComponent as EmailSvg } from '../assets/qr-codes/email.svg'
import { ReactComponent as InstagramSvg } from '../assets/qr-codes/instagram.svg'
import { ReactComponent as LinkedInSvg } from '../assets/qr-codes/linkedin.svg'
import { ReactComponent as AreNaSvg } from '../assets/qr-codes/arena.svg'

const contactData = [
  {
    type: 'email',
    qrName: 'email',
    text: 'email',
    displayName: 'email',
    link: 'mailto:donaldzhu.toronto@gmail.com',
    SvgComponent: EmailSvg
  },
  {
    type: 'instagram',
    qrName: 'instagram',
    text: 'instagram',
    displayName: 'Instagram',
    link: 'https://www.instagram.com/donaldzhu.graphics/',
    SvgComponent: InstagramSvg
  },
  {
    type: 'linkedin',
    qrName: 'linkedin',
    text: 'linkedin',
    displayName: 'LinkedIn',
    link: 'https://www.linkedin.com/in/donald-zhu-012114179',
    SvgComponent: LinkedInSvg

  },
  {
    type: 'are.na',
    qrName: 'arena',
    text: 'are.na',
    displayName: 'are.na',
    link: 'https://www.are.na/donald-zhu',
    SvgComponent: AreNaSvg
  }
]

export default contactData