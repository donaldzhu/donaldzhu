import { useRef, useState } from 'react'
import { styled } from 'styled-components'
import ContactItem from './contactItem'
import TextContainer from '../common/styled/textContainer'
import Text from '../common/styled/text'
import useCanvas from '../../hooks/useCanvas'
import useSidebar from '../../hooks/useSidebar'
import { responsiveCssSize } from '../../utils/styleUtils'
import { styleDashedRect, wrapDrawingContext } from '../../utils/p5Utils'
import ElemRect from '../../utils/helpers/rect/elemRect'
import colorConfig from '../../styles/colors'
import mixins from '../../styles/mixins'
import sizes from '../../styles/sizes'
import contactData from '../../data/contactData'
import { fontSizes } from '../../styles/fonts'

const Contact = () => {
  const [shownQr, setShownQR] = useState()
  const showQrRef = useRef()
  const qrRef = useRef()

  useCanvas(() => ({
    draw: p5 => {
      if (!showQrRef.current || !qrRef.current) return

      const showQr = new ElemRect(showQrRef, sizes.contactShowQrRetPadding())
      const qr = new ElemRect(qrRef, sizes.contactQrRetPadding())

      wrapDrawingContext(p5, () => {
        showQr.rectAround(p5)
        qr.rectAround(p5)
        styleDashedRect(p5)
        p5.line(...showQr.botLeft, ...qr.topLeft)
        p5.line(...showQr.botRight, ...qr.topRight)
      })
    }
  }))

  const handleQrHover = (elem, data) => {
    setShownQR(data)
    showQrRef.current = elem
  }

  useSidebar(
    <ContactSidebar
      shownQrData={shownQr}
      qrRef={qrRef}
      handleHover={handleQrHover} />,
    [shownQr]
  )
}

const ContactSidebar = ({ shownQrData, qrRef, handleHover }) => {
  const { SvgComponent } = shownQrData || {}
  return (
    <TextContainerWithQr>
      <Text><b>Feel free to contact for inquiry -</b> Toronto, Canada [In person/Remote]</Text>
      <LinkContainer>
        {contactData.map((data, i) => <ContactItem
          key={i}
          data={data}
          isQrShown={shownQrData?.type === data.type}
          handleHover={handleHover}
        />)}
      </LinkContainer>
      {shownQrData && <SvgComponent ref={qrRef} />}
    </TextContainerWithQr>
  )
}

const TextContainerWithQr = styled(TextContainer)`
  ${mixins.innerMargin(0)} 
  font-size: ${fontSizes.sidebarText};

  > svg { 
    ${mixins.squared(responsiveCssSize({ l: 120, xxl: 200 }))};
    position: relative;
    top: ${sizes.contactQrTop};
    color: ${colorConfig.toolTipColor};
  }

  &>:last-child {
    padding:0;
  }
`

const LinkContainer = styled.ul`
  padding: ${sizes.textInnerMargin} 0;
`

export default Contact