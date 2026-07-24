const genericTrekImage =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600";

const allowedImageHosts = [
  "images.unsplash.com",
  "commons.wikimedia.org",
];

// Representative hero images per trek. A trek's own `image_url` in Supabase
// always takes precedence (see getTrekImageWithFallback); these are the
// curated defaults so every trek looks distinct out of the box.
const EBC_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/View_of_Everest_Base_Camp_Trek.jpg";
const ABC_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Annapurna%20Base%20Camp%20Trek.jpg";
const ANNAPURNA_CIRCUIT_IMAGE =
  "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1600&q=80";
const MANASLU_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80";
const LANGTANG_IMAGE =
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80";
const MARDI_IMAGE =
  "https://images.unsplash.com/photo-1605647540926-0962900559c9?w=1600&q=80";
const TILICHO_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80";
const MUSTANG_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80";

const trekImageBySlug: Record<string, string> = {
  "everest-base-camp": EBC_IMAGE,
  "everest-base-camp-trek": EBC_IMAGE,
  ebc: EBC_IMAGE,
  "annapurna-base-camp": ABC_IMAGE,
  "annapurna-base-camp-trek": ABC_IMAGE,
  abc: ABC_IMAGE,
  "annapurna-circuit": ANNAPURNA_CIRCUIT_IMAGE,
  "annapurna-circuit-trek": ANNAPURNA_CIRCUIT_IMAGE,
  "manaslu-circuit": MANASLU_IMAGE,
  "manaslu-circuit-trek": MANASLU_IMAGE,
  manaslu: MANASLU_IMAGE,
  "langtang-valley": LANGTANG_IMAGE,
  "langtang-valley-trek": LANGTANG_IMAGE,
  langtang: LANGTANG_IMAGE,
  "mardi-himal": MARDI_IMAGE,
  "mardi-himal-trek": MARDI_IMAGE,
  "tilicho-lake": TILICHO_IMAGE,
  "tilicho-lake-trek": TILICHO_IMAGE,
  tilicho: TILICHO_IMAGE,
  "upper-mustang": MUSTANG_IMAGE,
  "upper-mustang-trek": MUSTANG_IMAGE,
  mustang: MUSTANG_IMAGE,
  "poon-hill": ANNAPURNA_CIRCUIT_IMAGE,
  "ghorepani-poon-hill": ANNAPURNA_CIRCUIT_IMAGE,
  "ghorepani-poon-hill-trek": ANNAPURNA_CIRCUIT_IMAGE,
};

export function getTrekImage(slug: string) {
  return trekImageBySlug[slug] ?? genericTrekImage;
}

export function getTrekImageWithFallback(slug: string, imageUrl: string | null) {
  if (imageUrl && isAllowedImageUrl(imageUrl)) {
    return imageUrl;
  }

  return getTrekImage(slug);
}

function isAllowedImageUrl(imageUrl: string) {
  try {
    const parsed = new URL(imageUrl);

    if (parsed.protocol !== "https:") {
      return false;
    }

    return (
      allowedImageHosts.includes(parsed.hostname) ||
      parsed.hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
}
