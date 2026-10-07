import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { StarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { COMMENT_QUERY_KEYS } from '@/modules/comment';
import { postComment } from '@/shared/api';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { FieldGroup } from '@/shared/ui/field';
import { useAppForm } from '@/shared/ui/form/hooks';

import type { CommentFormSchema } from './constants';

import { commentFormSchema } from './constants';

interface CommentFormProps {
  formId: string;
  variantId: number;
  onSuccess?: () => void;
}

export const CommentForm = ({ formId, onSuccess, variantId }: CommentFormProps) => {
  const { t } = useLingui();

  const postCommentMutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      toast.success(t`Your comment has been submitted`);
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      let errorMessage = t`An error occurred while submitting your comment`;
      if (error instanceof AxiosError) {
        const messageKey = error.response?.data?.message_key;
        if (!!messageKey && messageKey === 'action_not_allowed')
          errorMessage = t`You are not allowed to submit a comment for this product. You should make a purchase first.`;
      }
      toast.error(errorMessage);
    },
    meta: {
      invalidatesQuery: COMMENT_QUERY_KEYS.base(),
      withoutToastOnError: true
    }
  });

  const form = useAppForm({
    validators: {
      onChange: commentFormSchema()
    },
    defaultValues: {
      variant: String(variantId),
      text: '',
      rating: 5,
      images: []
    } satisfies CommentFormSchema as CommentFormSchema,
    onSubmit: ({ value }) => {
      postCommentMutation.mutate({
        data: {
          variant: Number(value.variant),
          text: value.text,
          rating: value.rating,
          images: value.images
        }
      });
    }
  });

  return (
    <form.AppForm>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name='rating'>
            {(field) => (
              <div className='space-y-2'>
                <span className='text-sm font-medium'>{t`Rating`}</span>
                <div className='flex items-center gap-1'>
                  {Array.from({ length: 5 }, (_, index) => {
                    const rating = index + 1;
                    const isActive = rating <= field.state.value;

                    return (
                      <Button
                        key={rating}
                        aria-label={t`Set rating`}
                        className='size-8 rounded-md'
                        size='icon-sm'
                        type='button'
                        variant='ghost'
                        onClick={() => field.handleChange(rating)}
                      >
                        <StarIcon
                          className={cn(
                            'size-5 text-amber-400',
                            isActive ? 'fill-amber-400' : 'text-muted-foreground fill-transparent'
                          )}
                        />
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </form.AppField>

          <form.AppField name='text'>
            {(field) => (
              <field.Textarea
                isRequired
                label={t`Comment`}
                placeholder={t`Share your experience with this product`}
                rows={5}
              />
            )}
          </form.AppField>
        </FieldGroup>
      </form>
    </form.AppForm>
  );
};
