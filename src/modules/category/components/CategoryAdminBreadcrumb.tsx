import type { ComponentProps } from 'react';

import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import React from 'react';

import { cn } from '@/shared/lib/utils';
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
  className?: ComponentProps<'div'>['className'];
  id: number | string;
  isAdmin?: boolean;
}

export const CategoryAdminBreadcrumb = ({ id, className }: Props) => {
  const { t } = useLingui();
  const getCategoryBreadcrumbQuery = useSuspenseQuery(getCategoryBreadcrumbByIdOptions({ id }));

  const breadcrumb = getCategoryBreadcrumbQuery.data;

  return (
    <BreadcrumbWrapper className={cn(className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to='/admin/category'>{t`Catalogs`}</Link>} />
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
                          <Link params={{ id: String(item.id) }} to='/admin/category/$id'>
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
