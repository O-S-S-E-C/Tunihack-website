export type GalleryPhoto = {
  src: string;
  alt: string;
  w: number;
  h: number;
};

// Add one photo entry here and place the matching file under public/tunihack/.
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { src: "/tunihack/DSC09202.webp", alt: "Participants arriving at TuniHack", w: 1600, h: 1067 },
  { src: "/tunihack/DSC09204.webp", alt: "Opening gathering at TuniHack", w: 1600, h: 1067 },
  { src: "/tunihack/DSC09207.webp", alt: "Workshop participants learning together", w: 1600, h: 1067 },
  { src: "/tunihack/DSC09210.webp", alt: "Mentors guiding a workshop", w: 1600, h: 1067 },
  { src: "/tunihack/DSC09223.webp", alt: "Teams working on their projects", w: 1600, h: 1067 },
  { src: "/tunihack/DSC09313.webp", alt: "Hackathon team collaborating", w: 1600, h: 1067 },
  { src: "/tunihack/DSC09316.webp", alt: "Builders presenting their work", w: 1600, h: 1067 },
  { src: "/tunihack/DSC_0884.webp", alt: "Capture the Flag challenge in progress", w: 1600, h: 1067 },
  { src: "/tunihack/DSC_0940.webp", alt: "Participants solving a security challenge", w: 1600, h: 1067 },
  { src: "/tunihack/DSC_0969.webp", alt: "Final presentations at TuniHack", w: 1600, h: 1067 },
  { src: "/tunihack/DSC_1073.webp", alt: "TuniHack community celebrating", w: 1600, h: 1067 },
  { src: "/tunihack/DSC_1121.webp", alt: "Closing moment with participants", w: 1600, h: 1067 },
];
