import { Skeleton } from '@/shared/ui/skeleton';
import { Spinner } from '@/shared/ui/spinner';

export const PageLoading = () => {
  return (
    <div className='flex h-screen flex-col'>
      <div className='bg-background flex h-14 items-center gap-2 px-4'>
        <Skeleton className='size-5' />
        <Skeleton className='h-5 w-40' />
      </div>
      <div className='grid h-full flex-1 place-items-center'>
        <Spinner />
      </div>
    </div>
  );
};
