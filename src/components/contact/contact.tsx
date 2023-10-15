import { MutableRefObject, useRef, useState } from 'react'
import styled from 'styled-components'
import contactData from '../../data/contactData'
import { ContactDataInterface } from '../../data/dataTypes'
import useCanvas from '../../hooks/useCanvas'
import useSidebar from '../../hooks/useSidebar'
import colorConfig from '../../styles/colors'
import { fontSizes } from '../../styles/fonts'
import mixins from '../../styles/mixins'
import { domSizes, sketchSizes } from '../../styles/sizes'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { styleDashedRect, wrapDrawingContext } from '../../utils/p5Utils'
import { validateRef } from '../../utils/typeUtils'
import Text from '../common/styled/text'
import TextContainer from '../common/styled/textContainer'
import ContactItem from './contactItem'
import { handleHoverType, QrSvg } from './contactType'

const Contact = () => {
  const [shownQr, setShownQR] = useState<ContactDataInterface>()
  const qrToolTipRef = useRef<QrSvg | null>(null)
  const qrPopUpRef = useRef<QrSvg | null>(null)

  useCanvas(() => ({
    draw: p5 => {
      if (!validateRef(qrToolTipRef) || !validateRef(qrPopUpRef)) return

      const qrTooltip = new ElemRect(qrToolTipRef, sketchSizes.contactQr.toolTipPadding.value)
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

  const handleQrHover = (elem: QrSvg, data: ContactDataInterface) => {
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

  return undefined
}

interface ContactSidebarProps {
  shownQrData?: ContactDataInterface
  qrRef: MutableRefObject<QrSvg | null>
  handleHover: handleHoverType
}

const ContactSidebar = ({ shownQrData, qrRef, handleHover }: ContactSidebarProps) => {
  const { SvgComponent } = shownQrData ?? {}
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