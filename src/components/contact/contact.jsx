import { useRef, useState } from 'react'
import { styled } from 'styled-components'
import ContactItem from './contactItem'
import TextContainer from '../common/styled/textContainer'
import Text from '../common/styled/text'
import useCanvas from '../../hooks/useCanvas'
import useSidebar from '../../hooks/useSidebar'
import { styleDashedRect, wrapDrawingContext } from '../../utils/p5Utils'
import ElemRect from '../../utils/helpers/rect/elemRect'
import colorConfig from '../../styles/colors'
import mixins from '../../styles/mixins'
import { domSizes, sketchSizes } from '../../styles/sizes'
import contactData from '../../data/contactData'
import { fontSizes } from '../../styles/fonts'

const Contact = () => {
  const [shownQr, setShownQR] = useState()
  const qrToolTip = useRef()
  const qrPopUpRef = useRef()

  useCanvas(() => ({
    draw: p5 => {
      if (!qrToolTip.current || !qrPopUpRef.current) return

      const qrTooltip = new ElemRect(qrToolTip, sketchSizes.contactQr.toolTipPadding.value)
      const qrPopUp = new ElemRect(qrPopUpRef, sketchSizes.contactQr.popUpPadding.value)

      wrapDrawingContext(p5, () => {
        qrTooltip.rectAround(p5)
        qrPopUp.rectAround(p5)
        styleDashedRect(p5)
        p5.line(...qrTooltip.botLeft, ...qrPopUp.topLeft)
        p5.line(...qrTooltip.botRight, ...qrPopUp.topRight)
      })
    }
  }))

  const handleQrHover = (elem, data) => {
    setShownQR(data)
    qrToolTip.current = elem
  }

  useSidebar(
    <ContactSidebar
      shownQrData={shownQr}
      qrRef={qrPopUpRef}
      handleHover={handleQrHover} />,
    [shownQr]
  )
}

const ContactSidebar = ({ shownQrData, qrRef, handleHover }) => {
  const { SvgComponent } = shownQrData || {}
  return (
    <TextContainerWithQr>
      <Text><b>Feel free to contact for inquiry -</b> Toronto, Canada [In person/Remote]</Text>
      <ul>
        {contactData.map((data, i) => <ContactItem
          key={i}
          data={data}
          isQrShown={shownQrData?.type === data.type}
          handleHover={handleHover}
        />)}
      </ul>
      {shownQrData && <SvgComponent ref={qrRef} />}
    </TextContainerWithQr>
  )
}

const TextContainerWithQr = styled(TextContainer)`
  font-size: ${fontSizes.text.mono.css};

  > svg { 
    ${mixins.squared(domSizes.contact.qr.size.css)};
    position: relative;
    top: ${domSizes.contact.qr.top.css};
    color: ${colorConfig.toolTipColor};
  }

  &>:last-child {
    padding:0;
  }
`


export default Contact