interface Legal {
  information: string;
  information_en: string;
  information_ru: string;
  information_uz: string;
}

interface LegalDTO {
  information_en: string;
  information_ru: string;
  information_uz: string;
}

type LegalResponse = Legal;
