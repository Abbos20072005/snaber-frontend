// FEATURE DISABLED: Seller card / stock info lines.
// import type { LucideIcon } from 'lucide-react';

import { useLingui } from '@lingui/react/macro';
// FEATURE DISABLED: Company mini-site link.
// import { Link } from '@tanstack/react-router';
import {
  // FEATURE DISABLED: Seller card.
  // Building2,
  EyeIcon,
  // FEATURE DISABLED: Stock info lines.
  // Factory,
  // FEATURE DISABLED: Seller card.
  // MapPin,
  // FEATURE DISABLED: Chat functionality.
  // MessageSquare,
  // FEATURE DISABLED: Stock info lines.
  // PackageCheck,
  // FEATURE DISABLED: Seller card.
  // ShieldCheck,
  // FEATURE DISABLED: Stock info lines.
  // Tag,
  // Truck
} from 'lucide-react';
import { useState } from 'react';

import { ReadyCartButtons } from '@/modules/cart/components/ReadyCartButtons';
import { RfqCartButton } from '@/modules/cart/components/RfqCartButton';
import {
  AttributeStockSelector,
  productTypeColorMap,
  productTypeLabelMap
} from '@/modules/products';
// FEATURE DISABLED: Company mini-site link.
// import { generateSlugId } from '@/shared/constants';
import { useFormatCount } from '@/shared/lib/format';
// FEATURE DISABLED: Stock info lines.
// import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { useCartStore } from '@/shared/store';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button.tsx';
// FEATURE DISABLED: Seller card.
import { Card, CardContent } from '@/shared/ui/card';
// import { CardHeader, CardTitle } from '@/shared/ui/card';
// import { Separator } from '@/shared/ui/separator';

import { getVariantTitle } from './helpers';

// FEATURE DISABLED: Seller card / stock info lines.
// interface InfoLineProps {
//   icon: LucideIcon;
//   label: string;
//   value: string;
// }

interface VariantImageOptionProps {
  fallbackImage: string;
  isInCart?: boolean;
  isSelected: boolean;
  variant: ProductVariant;
  onSelect: (variant: ProductVariant) => void;
}

interface Props {
  basePrice: string;
  leadTime: string;
  product: PublicProduct;
  selectedPrice: string;
  selectedVariant?: ProductVariant;
  totalStock: number;
  onVariantChange: (variant: ProductVariant) => void;
}

// FEATURE DISABLED: Seller card / stock info lines.
// const InfoLine = ({ icon: Icon, label, value }: InfoLineProps) => (
//   <div className='flex min-w-0 gap-3'>
//     <div className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg'>
//       <Icon className='size-4' />
//     </div>
//     <div className='min-w-0'>
//       <p className='text-muted-foreground text-xs font-medium tracking-widest uppercase'>{label}</p>
//       <p className='truncate text-sm font-semibold'>{value}</p>
//     </div>
//   </div>
// );

const getVariantPreviewImage = (variant: ProductVariant, fallbackImage: string) =>
  variant.medias.find((media) => media.product_media_type === 'photo')?.file || fallbackImage;

export const VariantImageOption = ({
  fallbackImage,
  isInCart,
  isSelected,
  variant,
  onSelect
}: VariantImageOptionProps) => (
  <button
    className={cn(
      'group focus-visible:ring-ring bg-muted hover:border-primary/70 relative size-14 overflow-hidden rounded-md border transition focus-visible:ring-2 focus-visible:outline-none sm:size-16',
      isSelected && 'border-primary ring-primary/25 ring-2'
    )}
    title={getVariantTitle(variant)}
    type='button'
    onClick={() => onSelect(variant)}
  >
    <img
      alt={getVariantTitle(variant)}
      className='size-full object-cover transition group-hover:scale-105'
      src={getVariantPreviewImage(variant, fallbackImage)}
    />
    {isInCart && (
      <div className='bg-primary absolute top-1 right-1 size-2 rounded-full ring-1 ring-white' />
    )}
  </button>
);

export const PublicProductAside = ({
  basePrice,
  // FEATURE DISABLED: Stock info lines.
  // leadTime,
  product,
  selectedPrice,
  selectedVariant,
  // totalStock,
  onVariantChange
}: Props) => {
  const { t } = useLingui();
  const { cartMap } = useCartStore();
  const [selectedAttributeStock, setSelectedAttributeStock] = useState<
    ProductVariantAttributeStock | undefined
  >(selectedVariant?.attribute_stocks[0]);

  const companyCart = cartMap[product.company.id] || {};

  const isVariantInCart = (variant: ProductVariant) => {
    const hasRfq = Object.values(companyCart).some(
      (entry) => entry.type === 'rfq' && entry.variant === variant.id
    );
    if (hasRfq) return true;

    return variant.attribute_stocks.some((stock) =>
      Object.values(companyCart).some(
        (entry) => entry.type === 'ready' && entry.attributeStockId === stock.id
      )
    );
  };

  const selectedVariantPrice = selectedVariant ? selectedPrice : t`No variant selected`;
  // FEATURE DISABLED: Stock info lines.
  // const selectedVariantMoq = selectedVariant
  //   ? `${selectedVariant.moq_override} ${product.moq_unit.unit}`
  //   : `${product.moq} ${product.moq_unit.unit}`;
  // const selectedVariantStock = selectedVariant
  //   ? `${formatPrice(selectedAttributeStock?.quantity ?? selectedVariant.stock_quantity)} ${t`pcs`}`
  //   : 'N/A';

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedAttributeStock(variant?.attribute_stocks[0]);
    onVariantChange(variant);
  };

  const formatCount = useFormatCount();

  return (
    <aside className='space-y-6'>
      <Card className='rounded-lg py-0'>
        <CardContent className='space-y-4 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              {product.product_type === 'both' ? (
                <div className='flex flex-wrap gap-2'>
                  <Badge
                    style={{
                      backgroundColor: productTypeColorMap.ready
                    }}
                  >
                    {t(productTypeLabelMap.ready)}
                  </Badge>
                  <Badge
                    style={{
                      backgroundColor: productTypeColorMap.made_to_order
                    }}
                  >
                    {t(productTypeLabelMap.made_to_order)}
                  </Badge>
                </div>
              ) : (
                <Badge
                  style={{
                    backgroundColor: productTypeColorMap[product.product_type]
                  }}
                >
                  {t(productTypeLabelMap[product.product_type])}
                </Badge>
              )}
            </div>
            <div className='mt-1 flex w-fit items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-white backdrop-blur-sm'>
              <EyeIcon className='size-3' />
              <span className='text-xs font-medium'>{formatCount(product.view_count)}</span>
            </div>
          </div>
          <div>
            <p className='text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase'>
              {t`Selected variant price`}
            </p>
            <p className='text-primary mt-1 text-2xl font-bold'>{selectedVariantPrice}</p>
            <p className='text-muted-foreground mt-1 text-sm'>
              {t`Base range`}: {basePrice}
            </p>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between gap-4'>
              <p className='text-sm font-semibold'>{t`Choose variant`}</p>
              <p className='text-muted-foreground text-xs'>
                {product.variants.length} {t`options`}
              </p>
            </div>
            <div className='flex flex-wrap gap-2.5'>
              {product.variants.map((variant) => (
                <VariantImageOption
                  key={variant.id}
                  fallbackImage={product.image}
                  isInCart={isVariantInCart(variant)}
                  isSelected={variant.id === selectedVariant?.id}
                  variant={variant}
                  onSelect={handleVariantChange}
                />
              ))}
            </div>
          </div>

          <AttributeStockSelector
            variant={selectedVariant}
            onStockChange={(stock) => setSelectedAttributeStock(stock)}
            selectedStockId={selectedAttributeStock?.id}
          />

          {/* FEATURE DISABLED: MOQ / lead time / stock info lines. */}
          {/* <div className='grid grid-cols-2 gap-4'> */}
          {/*   <InfoLine label='MOQ' value={selectedVariantMoq} icon={PackageCheck} /> */}
          {/*   <InfoLine label={t`Lead time`} value={leadTime} icon={Truck} /> */}
          {/*   <InfoLine label={t`Variant stock`} value={selectedVariantStock} icon={Factory} /> */}
          {/*   <InfoLine label={t`Total stock`} value={`${formatPrice(totalStock)}pcs`} icon={Tag} /> */}
          {/* </div> */}

          {selectedVariant &&
            (selectedAttributeStock ? (
              <ReadyCartButtons
                company={product.company}
                productVariant={selectedVariant}
                stock={selectedAttributeStock}
              />
            ) : (
              <Button disabled className='w-full'>
                {t`Out of stock`}
              </Button>
            ))}

          {product.product_type !== 'ready' && <RfqCartButton product={product} />}
        </CardContent>
      </Card>

      {/* FEATURE DISABLED: Seller card. */}
      {/* <Card className='rounded-lg'> */}
      {/*   <CardHeader> */}
      {/*     <CardTitle className='flex items-center gap-2'> */}
      {/*       <Building2 className='text-primary size-5' /> */}
      {/*       {t`Seller`} */}
      {/*     </CardTitle> */}
      {/*   </CardHeader> */}
      {/*   <CardContent className='space-y-5'> */}
      {/*     <div className='flex gap-4'> */}
      {/*       <img */}
      {/*         alt={product.company.name} */}
      {/*         className='size-12 rounded-lg border object-cover' */}
      {/*         src={product.company.logo || '/images/company-logo.jpg'} */}
      {/*       /> */}
      {/*       <div className='min-w-0'> */}
      {/*         <p className='text-primary truncate font-semibold'>{product.company.name}</p> */}
      {/*         <p className='text-muted-foreground text-sm capitalize'> */}
      {/*           {product.company.region?.name ?? t`N/A`} */}
      {/*         </p> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*     <Separator /> */}
      {/*     <InfoLine */}
      {/*       label={t`Region`} */}
      {/*       value={product.company.region?.name ?? t`N/A`} */}
      {/*       icon={MapPin} */}
      {/*     /> */}
      {/*     <InfoLine */}
      {/*       label={t`Verification`} */}
      {/*       value={t`Company profile available`} */}
      {/*       icon={ShieldCheck} */}
      {/*     /> */}
      {/*   </CardContent> */}
      {/* </Card> */}

      {/* FEATURE DISABLED: Chat functionality (chat-based purchase steps). */}
      {/* <Card className='rounded-lg'> */}
      {/*   <CardHeader> */}
      {/*     <CardTitle>{t`What happens next`}</CardTitle> */}
      {/*   </CardHeader> */}
      {/*   <CardContent className='space-y-4'> */}
      {/*     {[ */}
      {/*       t`Buyer starts a chat from this product`, */}
      {/*       t`Seller confirms selected variant and quantity`, */}
      {/*       t`Both sides agree delivery and documents`, */}
      {/*       t`Order is created from the confirmed chat` */}
      {/*     ].map((step, index) => ( */}
      {/*       <div key={step} className='grid grid-cols-[28px_1fr] gap-3'> */}
      {/*         <div className='bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold'> */}
      {/*           {index + 1} */}
      {/*         </div> */}
      {/*         <p className='pt-1 text-sm font-medium'>{step}</p> */}
      {/*       </div> */}
      {/*     ))} */}
      {/*   </CardContent> */}
      {/* </Card> */}
    </aside>
  );
};
