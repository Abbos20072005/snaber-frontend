import { useLingui } from '@lingui/react/macro';

interface Props {
  selectedVariant?: ProductVariant;
}

export const PublicProductDescriptionTab = ({ selectedVariant }: Props) => {
  const { t } = useLingui();

  return (
    <p className='text-muted-foreground text-sm'>
      {selectedVariant?.description ?? t`No description available.`}
    </p>
  );
};
