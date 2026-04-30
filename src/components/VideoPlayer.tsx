type Props = {
  url: string;
  title: string;
};

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}
function isVimeo(url: string) {
  return /vimeo\.com/.test(url);
}

function toEmbed(url: string) {
  if (isYouTube(url)) {
    // Already embed?
    if (url.includes("/embed/")) return url;
    const idMatch = url.match(/(?:v=|youtu\.be\/)([\w-]{6,})/);
    if (idMatch) return `https://www.youtube.com/embed/${idMatch[1]}`;
  }
  if (isVimeo(url)) {
    if (url.includes("player.vimeo.com")) return url;
    const idMatch = url.match(/vimeo\.com\/(\d+)/);
    if (idMatch) return `https://player.vimeo.com/video/${idMatch[1]}`;
  }
  return url;
}

export function VideoPlayer({ url, title }: Props) {
  const isMp4 = /\.mp4($|\?)/i.test(url);
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-[var(--shadow-card)]">
      {isMp4 ? (
        <video src={url} controls className="h-full w-full" />
      ) : (
        <iframe
          src={toEmbed(url)}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}
    </div>
  );
}
