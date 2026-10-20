import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';

import { generateSlugId } from '@/shared/constants';
// FEATURE DISABLED: Company mini-site links.
import { Separator } from '@/shared/ui/separator.tsx';

interface Props {
  result?: GlobalSearch;
  onCloseDialog?: () => void;
}

export const GlobalSearchSuggestionList = ({ result, onCloseDialog }: Props) => {
  const { t } = useLingui();

  const hasResults = !!result?.products?.length || !!result?.categories?.length; // FEATURE DISABLED: companies search results.

  return (
    <div>
      {!hasResults && (
        <p className='text-muted-foreground px-4 py-2 text-center text-sm'>{t`No results found.`}</p>
      )}

      {!!result?.products?.length && (
        <div>
          <p className='text-muted-foreground px-2 pb-1 text-xs font-semibold'>{t`Products`}</p>
          {result.products.map((product) => (
            <Link
              key={product.id}
              params={{
                slug: generateSlugId(product.id, product.name)
              }}
              onClick={onCloseDialog}
              to='/product/$slug'
            >
              <div className='hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md p-2'>
                <img
                  alt={`${product.name}-image`}
                  className='size-10 rounded-md object-cover'
                  src={product.media}
                />
                <p className='flex-1 truncate text-sm'>{product.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!!result?.categories?.length && !!result?.products?.length && <Separator className='my-2' />}

      {!!result?.categories?.length && (
        <div>
          <p className='text-muted-foreground px-2 pb-1 text-xs font-semibold'>{t`Categories`}</p>
          {result.categories.map((category) => (
            <Link
              key={category.id}
              params={{ slug: generateSlugId(category.id, category.name) }}
              onClick={onCloseDialog}
              to='/catalog/$slug'
            >
              <div className='hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md p-2'>
                {category.image && (
                  <img
                    alt={`${category.name}-image`}
                    className='size-10 rounded-md object-cover'
                    src={category.image}
                  />
                )}
                <p className='flex-1 truncate text-sm'>{category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* FEATURE DISABLED: Companies search results. */}
      {/* {!!result?.categories?.length && !!result?.companies?.length && (
        <Separator className='my-2' />
      )} */}

      {/* {!!result?.companies?.length && (
        <div>
          <p className='text-muted-foreground px-2 pb-1 text-xs font-semibold'>{t`Companies`}</p>
          {result.companies.map((company) => (
            <Link
              key={company.id}
              params={{
                slug: generateSlugId(company.id, company.name || company.id.toString())
              }}
              onClick={onCloseDialog}
              to='/companies/$slug'
            >
              <div className='hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md p-2'>
                {company.id && (
                  <img
                    alt={`${company.name}-image`}
                    className='size-10 rounded-md object-cover'
                    src={company.logo}
                  />
                )}
                <p className='flex-1 truncate text-sm'>{company.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )} */}
    </div>
  );
};
