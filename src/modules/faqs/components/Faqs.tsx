import { useSuspenseQuery } from '@tanstack/react-query';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/shared/ui/accordion';

import { getFaqsOptions } from '../options';

export const Faqs = () => {
  const faqsQuery = useSuspenseQuery(getFaqsOptions());
  const faqs = faqsQuery.data;
  const half = Math.floor(faqs.length / 2);

  return (
    <div className='grid lg:grid-cols-2 lg:gap-10'>
      <Accordion className='block lg:hidden'>
        {faqs.map((item, index) => (
          <AccordionItem key={index}>
            <AccordionTrigger>{item.name}</AccordionTrigger>
            <AccordionContent>{item.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Accordion className='hidden lg:block'>
        {faqs.slice(0, half).map((item, index) => (
          <AccordionItem key={index}>
            <AccordionTrigger>{item.name}</AccordionTrigger>
            <AccordionContent>{item.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Accordion className='hidden lg:block'>
        {faqs.slice(half).map((item, index) => (
          <AccordionItem key={index}>
            <AccordionTrigger>{item.name}</AccordionTrigger>
            <AccordionContent>{item.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
