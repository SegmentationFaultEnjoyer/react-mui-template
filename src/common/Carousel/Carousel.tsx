import '@splidejs/react-splide/css'
import './styles.scss'

import {
  Options as CarouselOptions,
  Splide,
  SplideSlide,
  SplideTrack,
} from '@splidejs/react-splide'
import { FC, forwardRef, useEffect, useMemo, useRef, useState } from 'react'

type MODE = 'default' | 'thumbnail'
type MODIFICATIONS = 'default' | 'image-cover'

interface Props {
  images: Array<string>
  label: string
  mode?: MODE
  modification?: MODIFICATIONS
  options?: CarouselOptions
}

const Carousel: FC<Props> = ({
  images,
  label,
  options,
  mode = 'default',
  modification = 'default',
  ...rest
}) => {
  const mainCarousel = useRef<Splide | null>(null)
  const thumbnailCarousel = useRef<Splide | null>(null)

  const [currentImageIdx, setCurrentImageIdx] = useState(1)

  const carouselOptions = useMemo<CarouselOptions>(
    () => ({
      perPage: 1,
      perMove: 1,
      rewind: true,
      heightRatio: 0.7,
      ...(mode === 'thumbnail'
        ? {
            type: 'fade',
            pagination: false,
            arrows: false,
          }
        : {
            classes: {
              pagination: 'carousel__pagination',
              arrow: 'splide__arrow carousel__arrow',
            },
          }),
      ...(options ?? {}),
    }),
    [mode, options],
  )

  const trackClasses = useMemo(
    () => (mode === 'thumbnail' ? '' : 'carousel__splide-track'),
    [mode],
  )

  const imageClasses = useMemo(
    () =>
      ['carousel__slide-image', `carousel__slide-image--${modification}`].join(
        ' ',
      ),
    [modification],
  )

  useEffect(() => {
    if (!mainCarousel?.current?.splide) return

    // keeping track of current image
    mainCarousel.current.splide.on('moved', index => {
      setCurrentImageIdx(index + 1)
    })

    if (!thumbnailCarousel?.current?.splide) return

    // synchronizing main image with thumbnails navigation
    mainCarousel.current.sync(thumbnailCarousel.current.splide)
  }, [mainCarousel, thumbnailCarousel])

  return (
    <div className='carousel'>
      <Splide
        className='carousel__splide'
        ref={mainCarousel}
        aria-label={label}
        options={carouselOptions}
        hasTrack={false}
        {...rest}
      >
        <SplideTrack
          data-image-amount={images.length}
          data-image-counter={currentImageIdx}
          className={trackClasses}
        >
          {images.map((image, key) => (
            <SplideSlide key={key} className='carousel__slide'>
              <img className={imageClasses} src={image} alt={image} />
            </SplideSlide>
          ))}
        </SplideTrack>
      </Splide>

      {mode === 'thumbnail' && (
        <ThumbnailNavigation
          label='thumbnail-navigation'
          images={images}
          ref={thumbnailCarousel}
        />
      )}
    </div>
  )
}

const ThumbnailNavigation = forwardRef<Splide, Props>(
  ({ images, label }, ref) => {
    const navigationOptions: CarouselOptions = {
      fixedWidth: 100,
      fixedHeight: 60,
      gap: 10,
      rewind: true,
      pagination: false,
      isNavigation: true,
      arrows: false,
      focus: 'center',
      breakpoints: {
        600: {
          fixedWidth: 60,
          fixedHeight: 44,
        },
      },
    }

    return (
      <Splide
        className='thumbnail-navigation'
        aria-label={label}
        ref={ref}
        options={navigationOptions}
      >
        {images.map((image, key) => (
          <SplideSlide key={key} className='thumbnail-navigation__slide'>
            <img
              className='thumbnail-navigation__slide-image'
              src={image}
              alt={image}
            />
          </SplideSlide>
        ))}
      </Splide>
    )
  },
)

export default Carousel
