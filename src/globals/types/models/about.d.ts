interface About {
  information: string;
  information_en: string;
  information_ru: string;
  information_uz: string;
}

interface AboutDTO {
  information_en: string;
  information_ru: string;
  information_uz: string;
}

type AboutResponse = About;
