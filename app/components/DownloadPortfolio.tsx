/* Download the full portfolio PDF — important for galleries, curators and
   collectors. Styled in the shared motion language: the arrow drifts down on
   hover with the site's organic easing.

   TO CONNECT THE FILE: pass `href` (e.g. drop the PDF at public/portfolio.pdf
   and use <DownloadPortfolio href="/portfolio.pdf" />, or point href at any
   URL). Until an href is provided the button renders visible but inert — no
   dead link goes live. */
export default function DownloadPortfolio({
  href,
  label = "Download Full Portfolio",
  className = "",
  downloadName,
}: {
  href?: string;
  label?: string;
  className?: string;
  // Optional clean filename for the saved file (e.g. "Camille_Buzuno.pdf").
  // When omitted the browser uses the file's own name — matching prior behaviour.
  downloadName?: string;
}) {
  const cls = `dl-portfolio ${className}`.trim();
  const inner = (
    <>
      <span className="dl-arrow" aria-hidden="true">
        ↓
      </span>
      {label}
    </>
  );

  if (href) {
    return (
      <a href={href} download={downloadName ?? true} className={cls}>
        {inner}
      </a>
    );
  }

  // No file assigned yet — visible, focusable, but does nothing when pressed.
  return (
    <button type="button" className={cls}>
      {inner}
    </button>
  );
}
