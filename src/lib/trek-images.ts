const genericTrekImage =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600";

const trekImageBySlug: Record<string, string> = {
  "everest-base-camp":
    "https://commons.wikimedia.org/wiki/Special:FilePath/View_of_Everest_Base_Camp_Trek.jpg",
  "everest-base-camp-trek":
    "https://commons.wikimedia.org/wiki/Special:FilePath/View_of_Everest_Base_Camp_Trek.jpg",
  "annapurna-base-camp":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Annapurna%20Base%20Camp%20Trek.jpg",
  "annapurna-base-camp-trek":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Annapurna%20Base%20Camp%20Trek.jpg",
};

export function getTrekImage(slug: string) {
  return trekImageBySlug[slug] ?? genericTrekImage;
}

export function getTrekImageWithFallback(slug: string, imageUrl: string | null) {
  return imageUrl || getTrekImage(slug);
}
