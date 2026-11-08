"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { GALLERY_PHOTOS, type GalleryPhoto } from "@/data/gallery";

function splitColumns(photos: GalleryPhoto[], count: number) {
  return Array.from({ length: count }, (_, columnIndex) =>
    photos.filter((_, index) => index % count === columnIndex),
  );
}

function Photo({ photo }: { photo: GalleryPhoto }) {
  return (
    <div className="gallery-photo">
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.w}
        height={photo.h}
        sizes="(max-width: 767px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
        loading="lazy"
      />
    </div>
  );
}

export default function PreviousEdition() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const desktopColumns = useMemo(() => splitColumns(GALLERY_PHOTOS, 3), []);
  const mobileColumns = useMemo(() => splitColumns(GALLERY_PHOTOS, 2), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="previousedition" ref={sectionRef} className="gallery-section px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="gallery-heading-wrap">
          <p className="about-eyebrow">{"// LAST EDITION"}</p>
          <h2 className="about-heading">Previous Edition</h2>
          <div className="about-heading-rule" aria-hidden="true" />
          <p className="text-muted mt-7 max-w-2xl leading-relaxed">
            Moments from the previous edition of TuniHack.
          </p>
        </div>

        <div className={`gallery-viewport ${isVisible ? "gallery-is-visible" : "gallery-offscreen"}`}>
          <div className="gallery-columns gallery-columns-desktop">
            {desktopColumns.map((column, columnIndex) => (
              <div className={`gallery-column gallery-column-${columnIndex + 1}`} key={`desktop-${columnIndex}`}>
                {[...column, ...column].map((photo, index) => (
                  <Photo key={`${photo.src}-${index}`} photo={photo} />
                ))}
              </div>
            ))}
          </div>

          <div className="gallery-columns gallery-columns-mobile">
            {mobileColumns.map((column, columnIndex) => (
              <div className={`gallery-column gallery-column-${columnIndex + 1}`} key={`mobile-${columnIndex}`}>
                {[...column, ...column].map((photo, index) => (
                  <Photo key={`${photo.src}-${index}`} photo={photo} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
