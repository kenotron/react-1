import * as React from 'react'
import { Carousel, Image } from '@stardust-ui/react'

const carouselItems = [
  { key: 'ade', slide: { as: Image, src: 'public/images/avatar/large/ade.jpg' } },
  { key: 'elliot', slide: { as: Image, src: 'public/images/avatar/large/elliot.jpg' } },
  { key: 'kristy', slide: { as: Image, src: 'public/images/avatar/large/kristy.png' } },
  { key: 'nan', slide: { as: Image, src: 'public/images/avatar/large/nan.jpg' } },
]

const CarouselExample = () => (
  <Carousel
    items={carouselItems}
    tabList={false}
    buttonNext={{ 'aria-label': 'go to next slide' }}
    buttonPrevious={{ 'aria-label': 'go to previous slide' }}
  />
)

export default CarouselExample