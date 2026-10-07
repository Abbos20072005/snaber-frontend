interface MultiLan {
  en: string;
  ru: string;
  uz: string;
}

interface Pagination<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface ApiResponse<T> {
  message: string;
  result: T;
}

type SvgProps = React.SVGProps<SVGSVGElement>;
