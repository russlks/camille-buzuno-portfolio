import WaterMermaid from "../components/WaterMermaid";

/* Isolated test page for the WaterMermaid prototype. Not linked from the site.
   Off-white background + a faint pale-blue blurry area + sample content so we
   can watch how the element behaves around headings, text and links. */
export default function WaterMermaidPreview() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#f4f3ee",
        color: "#14171a",
        overflow: "hidden",
      }}
    >
      {/* Faint pale-blue blurry area */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "18%",
          left: "8%",
          width: "46vw",
          height: "46vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(150,200,225,0.35), rgba(150,200,225,0) 68%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* The prototype */}
      <WaterMermaid />

      {/* Sample content */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "18vh 2rem 8rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#5b6b6d",
            marginBottom: "1.25rem",
          }}
        >
          Prototype · Water Mermaid
        </p>
        <h1
          style={{
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            fontWeight: 300,
            fontSize: "clamp(2.25rem, 6vw, 4rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          A living liquid
          <br />
          symbol, drifting.
        </h1>
        <p
          style={{
            marginTop: "1.75rem",
            maxWidth: "34rem",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#33403f",
          }}
        >
          This page exists only to evaluate the water-mermaid element in
          isolation — how it moves, how light it feels, and how it behaves
          around real content. It should never block this{" "}
          <a href="#" style={{ color: "#0d8f88", textDecoration: "underline" }}>
            test link
          </a>{" "}
          or make the text hard to read.
        </p>
      </main>
    </div>
  );
}
