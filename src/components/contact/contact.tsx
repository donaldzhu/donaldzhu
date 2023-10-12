import { MutableRefObject, useRef, useState } from 'react'
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
import { handleHoverType, qrSvg } from './contactType'
import { ContactDataInterface } from '../../data/dataTypes'

const Contact = () => {
  const [shownQr, setShownQR] = useState<ContactDataInterface>()
  const qrToolTipRef = useRef<qrSvg | null>(null)
  const qrPopUpRef = useRef<qrSvg | null>(null)

  useCanvas(() => ({
    draw: p5 => {
      if (!qrToolTipRef.current || !qrPopUpRef.current) return

      const qrTooltip = new ElemRect(qrToolTipRef as MutableRefObject<qrSvg>, sketchSizes.contactQr.toolTipPadding.value)
      const qrPopUp = new ElemRect(qrPopUpRef as MutableRefObject<qrSvg>, sketchSizes.contactQr.popUpPadding.value)

      wrapDrawingContext(p5, () => {
        qrTooltip.rectAround(p5)
        qrPopUp.rectAround(p5)
        styleDashedRect(p5)
        p5.line(...qrTooltip.botLeft, ...qrPopUp.topLeft)
        p5.line(...qrTooltip.botRight, ...qrPopUp.topRight)
      })
    }
  }))

  const handleQrHover = (elem: qrSvg, data: ContactDataInterface) => {
    setShownQR(data)
    qrToolTipRef.current = elem
  }

  useSidebar(
    <ContactSidebar
      shownQrData={shownQr}
      qrRef={qrPopUpRef}
      handleHover={handleQrHover} />,
    [shownQr]
  )
}

interface ContactSidebarProps {
  shownQrData?: ContactDataInterface
  qrRef: MutableRefObject<qrSvg | null>
  handleHover: handleHoverType
}

const ContactSidebar = ({ shownQrData, qrRef, handleHover }: ContactSidebarProps) => {
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
      {shownQrData && SvgComponent && <SvgComponent ref={qrRef} />}
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