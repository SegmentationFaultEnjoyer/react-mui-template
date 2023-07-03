import './styles.scss'

import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Carousel } from '@/common'

interface Props {
  images: Array<string>
  info: {
    title: string
    count: number
    totalAmount: number
    price: string
  }
}

const TestCard: FC<Props> = ({ images, info, ...rest }) => {
  const { t } = useTranslation()

  const details: { label: string; value: string | number }[] = [
    {
      label: t('product-card.counter-lbl'),
      value: t('product-card.counter-value', {
        current: info.count,
        total: info.totalAmount,
      }),
    },
    {
      label: t('product-card.price-lbl'),
      value: info.price,
    },
  ]

  return (
    <div className='product-card' {...rest}>
      <Carousel
        images={images}
        label={t('product-card.carousel-label')}
        modification='image-cover'
      />
      <section className='product-card__info'>
        <p className='product-card__title'>{info.title}</p>
        {details.map((detail, idx) => (
          <div className='product-card__info-part' key={idx}>
            <p>{detail.label}</p>
            <p>{detail.value}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default TestCard
