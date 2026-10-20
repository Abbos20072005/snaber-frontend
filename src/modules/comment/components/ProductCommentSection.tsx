import { useLingui } from '@lingui/react/macro';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { MessageSquarePlusIcon } from 'lucide-react';
import { useId, useMemo, useState } from 'react';

import {
  COMMENT_QUERY_KEYS,
  CommentCard,
  CommentForm,
  getCommentsQueryOptions,
  getProductCommentStatusQueryOptions
} from '@/modules/comment';
import { Button } from '@/shared/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/shared/ui/carousel';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';

interface Props {
  currentProduct: Pick<ProductBase, 'id'>;
}

export const ProductCommentSection = ({ currentProduct }: Props) => {
  const { t } = useLingui();
  const queryClient = useQueryClient();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const formId = useId();
  const commentsRequest = useMemo(
    () => ({
      params: {
        product: currentProduct.id,
        page_size: 20
      }
    }),
    [currentProduct.id]
  );
  const statusRequest = useMemo(
    () => ({
      params: {
        product: currentProduct.id
      }
    }),
    [currentProduct.id]
  );

  const commentStatusSuspenseQuery = useSuspenseQuery(
    getProductCommentStatusQueryOptions(statusRequest)
  );

  const commentsSuspenseQuery = useSuspenseQuery(getCommentsQueryOptions(commentsRequest));

  const { can_comment, has_commented } = commentStatusSuspenseQuery.data.data;
  const comments = commentsSuspenseQuery.data.data.results || [];

  const handleCommentSuccess = () => {
    setCommentDialogOpen(false);
    void queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.base() });
  };

  return (
    <section className='space-y-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-foreground text-xl font-semibold'>{t`Customer comments`}</h2>
        </div>
        <Dialog onOpenChange={setCommentDialogOpen} open={commentDialogOpen}>
          {!has_commented && (
            <Button
              disabled={!can_comment}
              type='button'
              variant={can_comment ? 'default' : 'outline'}
              onClick={() => setCommentDialogOpen(true)}
            >
              <MessageSquarePlusIcon />
              {t`Add comment`}
            </Button>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t`Add comment`}</DialogTitle>
              <DialogDescription>{t`Share your product experience with other buyers.`}</DialogDescription>
            </DialogHeader>
            <CommentForm
              formId={formId}
              onSuccess={handleCommentSuccess}
              productId={currentProduct.id}
            />
            <DialogFooter>
              <DialogClose render={<Button variant='outline'>{t`Cancel`}</Button>} />
              <Button type='submit' form={formId}>
                {t`Submit`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {comments.length > 0 ? (
        <Carousel className='px-2 sm:px-4' opts={{ align: 'start' }}>
          <CarouselContent className='-ml-3'>
            {comments.map((comment) => (
              <CarouselItem key={comment.id} className='basis-full pl-3 md:basis-1/2'>
                <CommentCard comment={comment} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className='bg-background left-0 size-8 border shadow-md'
            variant='outline'
          />
          <CarouselNext
            className='bg-background right-0 size-8 border shadow-md'
            variant='outline'
          />
        </Carousel>
      ) : (
        <div className='bg-muted/30 rounded-lg border border-dashed px-5 py-8 text-center'>
          <p className='text-foreground font-medium'>{t`No comments yet`}</p>
          <p className='text-muted-foreground mt-1 text-sm'>
            {can_comment
              ? t`Be the first buyer to comment on this product.`
              : t`Comments will appear here after buyers review this product.`}
          </p>
        </div>
      )}
    </section>
  );
};
