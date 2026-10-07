import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import React from 'react';

import { generateSlugId } from '@/shared/constants';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as BreadcrumbWrapper
} from '@/shared/ui/breadcrumb';

import { getCategoryBreadcrumbByIdOptions } from '../options';

interface Props {
  id: number | string;
}

export const CategoryBreadcrumb = ({ id }: Props) => {
  const { t } = useLingui();
  const getCategoryBreadcrumbQuery = useSuspenseQuery(getCategoryBreadcrumbByIdOptions({ id }));

  const breadcrumb = getCategoryBreadcrumbQuery.data;

  return (
    <BreadcrumbWrapper>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to='/catalog'>{t`Catalogs`}</Link>} />
        </BreadcrumbItem>
        {breadcrumb.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}`}>
            {index === breadcrumb.length - 1 ? (
              <React.Fragment>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <BreadcrumbSeparator />
                {item.id && (
                  <React.Fragment>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        render={
                          <Link
                            params={{ slug: generateSlugId(item.id, item.name) }}
                            to={`/catalog/$slug`}
                          >
                            {item.name}
                          </Link>
                        }
                      />
                    </BreadcrumbItem>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbWrapper>
  );
};
