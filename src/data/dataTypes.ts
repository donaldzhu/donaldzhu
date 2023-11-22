import type { FunctionComponent, MutableRefObject, SVGProps } from 'react'


export interface ContactDataInterface {
  type: string
  qrName: string
  text: string
  displayName: string
  link: string
  SvgComponent: FunctionComponent<SVGProps<SVGSVGElement>> & {
    ref?: MutableRefObject<SVGSVGElement | null>
  }
}