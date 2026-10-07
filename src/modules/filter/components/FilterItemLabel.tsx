interface Props {
  label: string;
}

export const FilterItemLabel = ({ label }: Props) => {
  return <h3 className='text-xs font-medium'>{label}</h3>;
};
